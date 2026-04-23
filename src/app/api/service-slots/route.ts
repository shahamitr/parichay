import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { getAuthenticatedUser } from '@/lib/auth-utils';

/**
 * GET /api/service-slots
 * Get service slots for a branch
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (!branchId) {
      return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });
    }

    const where: any = { branchId };
    if (activeOnly) {
      where.isActive = true;
    }

    const serviceSlots = await prisma.serviceSlot.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      serviceSlots,
    });
  } catch (error) {
    console.error('Error fetching service slots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/service-slots
 * Create a new service slot
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      branchId,
      name,
      description,
      duration,
      price,
      currency,
      isActive,
      maxPerDay,
      displayOrder,
      color,
    } = body;

    if (!branchId || !name || !duration) {
      return NextResponse.json(
        { error: 'Branch ID, name, and duration are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this branch
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        OR: [
          { brandId: user.brandId || '' },
          { admins: { some: { id: user.id } } },
        ],
      },
    });

    if (!branch && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const serviceSlot = await prisma.serviceSlot.create({
      data: {
        branchId,
        name,
        description,
        duration: parseInt(duration),
        price: price ? parseFloat(price) : null,
        currency: currency || 'INR',
        isActive: isActive ?? true,
        maxPerDay: maxPerDay ? parseInt(maxPerDay) : null,
        displayOrder: displayOrder || 0,
        color,
      },
    });

    return NextResponse.json({ success: true, serviceSlot });
  } catch (error) {
    console.error('Error creating service slot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/service-slots
 * Update a service slot
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service slot ID required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.serviceSlot.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Service slot not found' }, { status: 404 });
    }

    if (existing.branch.brandId !== user.brandId && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const serviceSlot = await prisma.serviceSlot.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        duration: updateData.duration ? parseInt(updateData.duration) : undefined,
        price: updateData.price !== undefined ? (updateData.price ? parseFloat(updateData.price) : null) : undefined,
        currency: updateData.currency,
        isActive: updateData.isActive,
        maxPerDay: updateData.maxPerDay !== undefined ? (updateData.maxPerDay ? parseInt(updateData.maxPerDay) : null) : undefined,
        displayOrder: updateData.displayOrder,
        color: updateData.color,
      },
    });

    return NextResponse.json({ success: true, serviceSlot });
  } catch (error) {
    console.error('Error updating service slot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/service-slots
 * Delete a service slot
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service slot ID required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.serviceSlot.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Service slot not found' }, { status: 404 });
    }

    if (existing.branch.brandId !== user.brandId && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.serviceSlot.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service slot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
