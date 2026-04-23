/**
 * Admin Single How It Works Step API
 * PUT /api/admin/how-it-works/:id - Update step
 * DELETE /api/admin/how-it-works/:id - Delete step
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// Update step
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.howItWorksStep.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const { title, description, icon, gradient, displayOrder, isPublished } = body;

    const step = await prisma.howItWorksStep.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(gradient !== undefined && { gradient }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({ success: true, step });
  } catch (error) {
    console.error('Error updating how it works step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete step
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.howItWorksStep.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    await prisma.howItWorksStep.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Step deleted' });
  } catch (error) {
    console.error('Error deleting how it works step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
