/**
 * Admin Single Feature API
 * PUT /api/admin/features/:id - Update feature
 * DELETE /api/admin/features/:id - Delete feature
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// Update feature
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

    const existing = await prisma.landingFeature.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    const { title, description, icon, gradient, displayOrder, isPublished } = body;

    const feature = await prisma.landingFeature.update({
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

    return NextResponse.json({ success: true, feature });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete feature
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

    const existing = await prisma.landingFeature.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    await prisma.landingFeature.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Feature deleted' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
