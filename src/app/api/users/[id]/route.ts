import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { UserRole } from '@/generated/prisma';
import { z } from 'zod';
import { encryptPhone, decryptPhone } from '@/lib/encryption';
import { logDataChange, logAuditEvent, AuditEventType, computeIntegrityHash, getIpAddress } from '@/lib/audit-trail';
import { verifySignedRequest, extractSigningFields } from '@/lib/request-signing';

// =============================================================================
// Validation Schema
// =============================================================================
const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  phone: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  password: z.string().min(8).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// =============================================================================
// GET /api/users/[id] - Get single user details
// =============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromRequest(request);
    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, phone: true,
        lastLoginAt: true, lastLogoutAt: true, deletedAt: true,
        createdAt: true, updatedAt: true, emailVerified: true,
        mfaEnabled: true, brandId: true,
        brand: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Decrypt phone for display
    return NextResponse.json({
      user: { ...user, phone: decryptPhone(user.phone) },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// PATCH /api/users/[id] - Update user (with audit + encryption + signing for role changes)
// =============================================================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromRequest(request);
    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // For role changes, verify request signature (critical operation)
    const { payload, nonce, signature } = extractSigningFields(body);
    const dataToValidate = nonce ? payload : body;

    if (dataToValidate.role && nonce && signature) {
      const sigResult = await verifySignedRequest(
        payload as Record<string, unknown>,
        nonce,
        signature,
        currentUser.id
      );
      if (!sigResult.valid) {
        await logAuditEvent({
          eventType: AuditEventType.REQUEST_SIGNATURE_FAILED,
          userId: currentUser.id,
          resourceId: params.id,
          resourceType: 'User',
          ipAddress: getIpAddress(request.headers),
          metadata: { reason: sigResult.reason, attemptedRole: dataToValidate.role },
        });
        return NextResponse.json({ error: 'Invalid request signature' }, { status: 403 });
      }
    }

    const parsed = updateUserSchema.safeParse(dataToValidate);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { password, phone, ...updateFields } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Email uniqueness check
    if (updateFields.email && updateFields.email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: updateFields.email } });
      if (emailTaken) {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
      }
    }

    // Build update data
    const data: Record<string, unknown> = { ...updateFields };

    // Encrypt phone if provided
    if (phone !== undefined) {
      data.phone = phone ? encryptPhone(phone) : null;
    }

    // Hash password if provided
    if (password) {
      const { AuthService } = await import('@/lib/auth');
      data.passwordHash = await AuthService.hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, phone: true,
        lastLoginAt: true, lastLogoutAt: true, deletedAt: true,
        createdAt: true, updatedAt: true, emailVerified: true,
        mfaEnabled: true, brandId: true,
        brand: { select: { id: true, name: true } },
      },
    });

    // Audit log: track changes with before/after diff
    const changedFields = Object.keys(parsed.data);
    const isSensitiveChange = changedFields.includes('role') || changedFields.includes('isActive') || changedFields.includes('email');

    if (isSensitiveChange) {
      await logDataChange({
        eventType: changedFields.includes('role') ? AuditEventType.ROLE_CHANGED : AuditEventType.USER_UPDATED,
        userId: currentUser.id,
        resourceId: params.id,
        resourceType: 'User',
        before: {
          email: existingUser.email,
          role: existingUser.role,
          isActive: existingUser.isActive,
          phone: existingUser.phone ? '[encrypted]' : null,
        },
        after: {
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          phone: updatedUser.phone ? '[encrypted]' : null,
        },
        ipAddress: getIpAddress(request.headers),
        userAgent: request.headers.get('user-agent') || undefined,
      });
    }

    // Return with decrypted phone for display
    return NextResponse.json({
      user: { ...updatedUser, phone: decryptPhone(updatedUser.phone) },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// DELETE /api/users/[id] - Soft delete user (admin action, requires signing)
// =============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromRequest(request);
    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent deleting yourself
    if (currentUser.userId === params.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (existingUser.deletedAt) {
      return NextResponse.json({ error: 'User is already deleted' }, { status: 400 });
    }

    // Soft delete
    await prisma.user.update({
      where: { id: params.id },
      data: { deletedAt: new Date(), isActive: false },
    });

    // Audit log
    await logAuditEvent({
      eventType: AuditEventType.USER_DELETED,
      userId: currentUser.id,
      resourceId: params.id,
      resourceType: 'User',
      ipAddress: getIpAddress(request.headers),
      userAgent: request.headers.get('user-agent') || undefined,
      metadata: {
        deletedUserEmail: existingUser.email,
        deletedUserRole: existingUser.role,
        type: 'admin-deletion',
      },
    });

    return NextResponse.json({ success: true, message: 'User soft-deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
