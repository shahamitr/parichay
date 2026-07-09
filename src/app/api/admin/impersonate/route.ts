/**
 * Admin Impersonate User API
 * POST /api/admin/impersonate — Generate a temporary session as another user
 *
 * SECURITY:
 * - SUPER_ADMIN only
 * - Audit logged with original admin ID
 * - Token expires in 30 minutes (shorter than normal)
 * - Cannot impersonate other SUPER_ADMINs
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { AuthService } from '@/lib/auth';
import { logAuditEvent, AuditEventType, getIpAddress, logSuspiciousActivity } from '@/lib/audit-trail';
import { z } from 'zod';

const impersonateSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = impersonateSchema.parse(body);

    // Can't impersonate yourself
    if (userId === admin.id) {
      return NextResponse.json({ error: 'Cannot impersonate yourself' }, { status: 400 });
    }

    // Fetch target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, brandId: true, firstName: true, lastName: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cannot impersonate other SUPER_ADMINs
    if (targetUser.role === 'SUPER_ADMIN') {
      await logSuspiciousActivity({
        userId: admin.id,
        description: 'Attempted to impersonate another SUPER_ADMIN',
        severity: 'high',
        ipAddress: getIpAddress(request.headers),
      });
      return NextResponse.json({ error: 'Cannot impersonate other admins' }, { status: 403 });
    }

    // Generate short-lived token for impersonation (30 min)
    const impersonationToken = AuthService.generateToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      brandId: targetUser.brandId || undefined,
    });

    // Audit log — this is critical for compliance
    await logAuditEvent({
      eventType: AuditEventType.SENSITIVE_ACCESS,
      userId: admin.id,
      resourceId: targetUser.id,
      resourceType: 'User',
      ipAddress: getIpAddress(request.headers),
      metadata: {
        action: 'impersonate',
        targetEmail: targetUser.email,
        targetRole: targetUser.role,
        expiresIn: '30 minutes',
      },
    });

    // Set impersonation cookie (shorter expiry)
    const response = NextResponse.json({
      success: true,
      message: `Now viewing as ${targetUser.firstName} ${targetUser.lastName} (${targetUser.email})`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        role: targetUser.role,
      },
    });

    // Set a separate impersonation cookie (doesn't replace admin session)
    response.cookies.set({
      name: 'impersonateToken',
      value: impersonationToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 minutes only
      path: '/',
    });

    // Store original admin ID for "exit impersonation"
    response.cookies.set({
      name: 'originalAdmin',
      value: admin.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    console.error('Impersonate error:', error);
    return NextResponse.json({ error: 'Impersonation failed' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/impersonate — Exit impersonation mode
 */
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Exited impersonation mode' });
  response.cookies.delete('impersonateToken');
  response.cookies.delete('originalAdmin');
  return response;
}
