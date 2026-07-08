/**
 * Verification Review API (Admin Only)
 * GET /api/verification/review — List pending verification requests
 * POST /api/verification/review — Approve or reject a verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { logAuditEvent, AuditEventType } from '@/lib/audit-trail';
import { z } from 'zod';

// GET — List all pending verifications
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Find branches with pending verification (verificationNotes contains "pending")
    const branches = await prisma.branch.findMany({
      where: {
        isVerified: false,
        verificationNotes: { not: null },
      },
      select: {
        id: true,
        name: true,
        verificationNotes: true,
        createdAt: true,
        brand: { select: { id: true, name: true, slug: true, logo: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Filter to only pending ones
    const pending = branches.filter((b) => {
      try {
        const notes = JSON.parse(b.verificationNotes || '{}');
        return notes.status === 'pending';
      } catch { return false; }
    }).map((b) => {
      const notes = JSON.parse(b.verificationNotes || '{}');
      return {
        branchId: b.id,
        branchName: b.name,
        brand: b.brand,
        requestedAt: notes.requestedAt,
        documents: notes.documents || [],
        notes: notes.notes || '',
      };
    });

    return NextResponse.json({ requests: pending, total: pending.length });
  } catch (error) {
    console.error('Verification review list error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// POST — Approve or reject
const reviewSchema = z.object({
  branchId: z.string().min(1),
  action: z.enum(['approve', 'reject']),
  reason: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { branchId, action, reason } = reviewSchema.parse(body);

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { brand: { select: { ownerId: true, name: true } } },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await prisma.branch.update({
        where: { id: branchId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          verifiedBy: user.id,
          verificationNotes: JSON.stringify({
            status: 'approved',
            approvedAt: new Date().toISOString(),
            approvedBy: user.id,
          }),
        },
      });

      // Notify brand owner
      if (branch.brand.ownerId) {
        await prisma.notification.create({
          data: {
            userId: branch.brand.ownerId,
            type: 'SYSTEM_ALERT',
            title: '✅ Business Verified!',
            message: `Congratulations! "${branch.brand.name}" has been verified. Your profile now shows a verification badge.`,
            metadata: { branchId },
          },
        }).catch(() => {});
      }
    } else {
      await prisma.branch.update({
        where: { id: branchId },
        data: {
          verificationNotes: JSON.stringify({
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectedBy: user.id,
            reason: reason || 'Documents could not be verified.',
          }),
        },
      });

      // Notify brand owner
      if (branch.brand.ownerId) {
        await prisma.notification.create({
          data: {
            userId: branch.brand.ownerId,
            type: 'SYSTEM_ALERT',
            title: 'Verification Update',
            message: `Your verification request for "${branch.brand.name}" needs attention: ${reason || 'Please resubmit clearer documents.'}`,
            metadata: { branchId, reason },
          },
        }).catch(() => {});
      }
    }

    // Audit log
    await logAuditEvent({
      eventType: AuditEventType.DATA_MODIFIED,
      userId: user.id,
      resourceId: branchId,
      resourceType: 'Branch',
      metadata: { action: `verification_${action}`, reason },
    });

    return NextResponse.json({
      success: true,
      message: action === 'approve'
        ? 'Business verified successfully. Badge is now live.'
        : 'Verification rejected. Owner has been notified.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    console.error('Verification review error:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}
