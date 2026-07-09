/**
 * Branch Publish/Unpublish API
 * POST /api/branches/[id]/publish — Toggle branch visibility
 *
 * Allows store owners to temporarily hide their microsite
 * (e.g., during renovation, vacation, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const publishSchema = z.object({
  action: z.enum(['publish', 'unpublish']),
  reason: z.string().max(200).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason } = publishSchema.parse(body);

    // Verify ownership
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: { brand: { select: { ownerId: true, name: true } } },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && branch.brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const isPublishing = action === 'publish';

    await prisma.branch.update({
      where: { id },
      data: {
        isActive: isPublishing,
        // Store unpublish reason in visibility field
        visibility: isPublishing ? 'public' : 'unlisted',
      },
    });

    // Notify via notification
    if (!isPublishing && branch.brand.ownerId) {
      await prisma.notification.create({
        data: {
          userId: branch.brand.ownerId,
          type: 'SYSTEM_ALERT',
          title: isPublishing ? 'Microsite Published' : 'Microsite Unpublished',
          message: isPublishing
            ? `"${branch.brand.name}" is now visible to customers.`
            : `"${branch.brand.name}" is now hidden from customers.${reason ? ` Reason: ${reason}` : ''}`,
          metadata: { branchId: id, action, reason },
        },
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      isActive: isPublishing,
      message: isPublishing
        ? 'Your microsite is now live and visible to customers.'
        : 'Your microsite is now hidden. Customers won\'t see it until you publish again.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    console.error('Publish toggle error:', error);
    return NextResponse.json({ error: 'Failed to update visibility' }, { status: 500 });
  }
}
