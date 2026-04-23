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

const createBadgeSchema = z.object({
  type: badgeTypeEnum,
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().optional().default(0),
  expiresAt: z.union([z.string().datetime(), z.literal(''), z.null()]).optional().transform(v => v === '' ? null : v),
  metadata: z.record(z.any()).optional(),
  branchId: z.string().optional(),
  brandId: z.string(),
});

// GET - List social proof badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where: any = {};

    if (branchId) {
      where.branchId = branchId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (activeOnly) {
      where.isActive = true;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    const badges = await prisma.socialProofBadge.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ badges });
  } catch (error) {
    console.error('Error fetching social proof badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social proof badges' },
      { status: 500 }
    );
  }
}

// POST - Create social proof badge
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBadgeSchema.parse(body);

    // Verify user has access to the brand
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== validatedData.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If branchId is provided, verify it belongs to the brand
    if (validatedData.branchId) {
      const branch = await prisma.branch.findUnique({
        where: { id: validatedData.branchId },
        select: { brandId: true },
      });

      if (!branch || branch.brandId !== validatedData.brandId) {
        return NextResponse.json(
          { error: 'Branch does not belong to the specified brand' },
          { status: 400 }
        );
      }
    }

    // Get the max display order
    const maxOrder = await prisma.socialProofBadge.aggregate({
      where: validatedData.branchId
        ? { branchId: validatedData.branchId }
        : { brandId: validatedData.brandId },
      _max: { displayOrder: true },
    });

    const badge = await prisma.socialProofBadge.create({
      data: {
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        icon: validatedData.icon,
        color: validatedData.color,
        isActive: validatedData.isActive ?? true,
        displayOrder: validatedData.displayOrder || (maxOrder._max.displayOrder ?? 0) + 1,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        metadata: validatedData.metadata,
        branchId: validatedData.branchId,
        brandId: validatedData.brandId,
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

    return NextResponse.json({ badge }, { status: 201 });
  } catch (error) {
    console.error('Error creating social proof badge:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create social proof badge' },
      { status: 500 }
    );
  }
}
