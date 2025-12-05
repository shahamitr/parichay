/**
 * Offers/Discounts API
 * GET /api/offers - Get active offers for a branch
 * POST /api/offers - Create a new offer (authenticated)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const createOfferSchema = z.object({
  branchId: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().max(1000),
  discountType: z.enum(['percentage', 'fixed', 'bogo', 'free_shipping', 'custom']),
  discountValue: z.number().optional(),
  originalPrice: z.number().optional(),
  discountedPrice: z.number().optional(),
  code: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  validFrom: z.string(),
  validUntil: z.string(),
  termsAndConditions: z.string().optional(),
  maxRedemptions: z.number().optional(),
  featured: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    if (!branchId && !brandId) {
      return NextResponse.json(
        { error: 'branchId or brandId is required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const where: any = {};

    if (branchId) where.branchId = branchId;
    if (brandId) where.brandId = brandId;

    if (activeOnly != null) {
      where.isActive = true;
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    const offers = await prisma.offer.findMany({
      where,
      orderBy: [
        // { featured: 'desc' }, // TODO: Add featured field to Offer model
        { endDate: 'asc' },
      ],
      include: {
        branch: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOfferSchema.parse(body);

    // Check if branch exists and user has access
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== branch.brandId &&
      !(user.branches || []).some((b) => b.id === validatedData.branchId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { validFrom, validUntil, currentRedemptions, ...offerData } = validatedData as any;
    const offer = await prisma.offer.create({
      data: {
        ...offerData,
        brandId: branch.brandId,
        startDate: new Date(validFrom || offerData.startDate),
        endDate: new Date(validUntil || offerData.endDate),
        usageCount: 0, // Use usageCount instead of currentRedemptions
        isActive: true,
      },
    });

    return NextResponse.json({ offer });
  } catch (error) {
    console.error('Error creating offer:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid offer data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
