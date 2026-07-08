/**
 * Business Verification Request API
 * POST /api/verification/request — Submit verification documents
 *
 * Flow:
 * 1. Business owner uploads documents (GST cert, license, PAN, address proof)
 * 2. Admin reviews in /admin/verification-queue
 * 3. Admin approves/rejects
 * 4. Branch gets isVerified=true + verifiedAt timestamp
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { logAuditEvent, AuditEventType } from '@/lib/audit-trail';
import { z } from 'zod';

const verificationRequestSchema = z.object({
  branchId: z.string().min(1),
  documents: z.array(z.object({
    type: z.enum(['gst_certificate', 'business_license', 'pan_card', 'address_proof', 'identity_proof', 'other']),
    url: z.string().url(),
    name: z.string(),
  })).min(1, 'At least one document is required'),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const data = verificationRequestSchema.parse(body);

    // Verify branch ownership
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
      include: { brand: { select: { ownerId: true, name: true } } },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }
    if (user.role !== 'SUPER_ADMIN' && branch.brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if already verified
    if (branch.isVerified) {
      return NextResponse.json({ error: 'Branch is already verified' }, { status: 409 });
    }

    // Store verification request in branch metadata
    await prisma.branch.update({
      where: { id: data.branchId },
      data: {
        verificationNotes: JSON.stringify({
          status: 'pending',
          requestedAt: new Date().toISOString(),
          requestedBy: user.id,
          documents: data.documents,
          notes: data.notes || '',
        }),
      },
    });

    // Create notification for all super admins
    const admins = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN', isActive: true },
      select: { id: true },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'SYSTEM_ALERT',
          title: 'New Verification Request',
          message: `"${branch.brand.name}" has submitted documents for verification review.`,
          metadata: { branchId: data.branchId, brandName: branch.brand.name },
        },
      }).catch(() => {});
    }

    // Audit log
    await logAuditEvent({
      eventType: AuditEventType.DATA_MODIFIED,
      userId: user.id,
      resourceId: data.branchId,
      resourceType: 'Branch',
      metadata: { action: 'verification_requested', documentCount: data.documents.length },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted. Our team will review within 24-48 hours.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please provide valid documents', details: error.errors }, { status: 400 });
    }
    console.error('Verification request error:', error);
    return NextResponse.json({ error: 'Failed to submit verification request' }, { status: 500 });
  }
}
