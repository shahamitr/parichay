import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const badgeTypeEnum = z.enum([
  'TOP_SELLER',
  'VERIFIED',
  'TRUSTED',
  'AWARD_WINNER',
  'CERTIFIED',
  'YEARS_IN_BUSINESS',
  'CUSTOMER_FAVORITE',
  'BEST_RATED',
  'FEATURED',
  'PREMIUM',
]);

const updateBadgeSchema = z.object({
  type: badgeTypeEnum.optional(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
});

// GET - Get single badge
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const badge = await prisma.socialProofBadge.findUnique({
      where: { id },
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    if (!badge) {
      return NextResponse.json(
        { error: 'Social proof badge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ badge });
  } catch (error) {
    console.error('Error fetching social proof badge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social proof badge' },
      { status: 500 }
    );
  }
}

// PUT - Update badge
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingBadge = await prisma.socialProofBadge.findUnique({
      where: { id },
      select: { brandId: true },
    });

    if (!existingBadge) {
      return NextResponse.json(
        { error: 'Social proof badge not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== existingBadge.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateBadgeSchema.parse(body);

    const badge = await prisma.socialProofBadge.update({
      where: { id },
      data: {
        ...validatedData,
        expiresAt: validatedData.expiresAt
          ? new Date(validatedData.expiresAt)
          : validatedData.expiresAt === null
            ? null
            : undefined,
      },
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ badge });
  } catch (error) {
    console.error('Error updating social proof badge:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update social proof badge' },
      { status: 500 }
    );
  }
}

// DELETE - Delete badge
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingBadge = await prisma.socialProofBadge.findUnique({
      where: { id },
      select: { brandId: true },
    });

    if (!existingBadge) {
      return NextResponse.json(
        { error: 'Social proof badge not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== existingBadge.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.socialProofBadge.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Social proof badge deleted successfully' });
  } catch (error) {
    console.error('Error deleting social proof badge:', error);
    return NextResponse.json(
      { error: 'Failed to delete social proof badge' },
      { status: 500 }
    );
  }
}
