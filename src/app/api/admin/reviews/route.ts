/**
 * Admin Reviews Management API
 * GET /api/admin/reviews - Get all reviews (with moderation status)
 * PATCH /api/admin/reviews - Approve/reject reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const updateReviewSchema = z.object({
  reviewId: z.string(),
  action: z.enum(['approve', 'reject', 'respond']),
  response: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    const accessToken = request.cookies.get('accessToken')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'BRAND_MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected'
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');

    const where: any = {};

    // Filter by user's brand if not super admin
    if (user.role !== 'SUPER_ADMIN') {
      where.brandId = user.brandId;
    } else if (brandId != null) {
      where.brandId = brandId;
    }

    if (branchId) where.branchId = branchId;

    if (status === 'pending') {
      where.isPublished = false;
    } else if (status === 'approved') {
      where.isPublished = true;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        branch: {
          select: { id: true, name: true, slug: true },
        },
        brand: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Get counts
    const baseWhere = user.role !== 'SUPER_ADMIN' ? { brandId: user.brandId } : {};
    const [pendingCount, approvedCount, totalCount] = await Promise.all([
      prisma.review.count({ where: { ...baseWhere, isPublished: false } }),
      prisma.review.count({ where: { ...baseWhere, isPublished: true } }),
      prisma.review.count({ where: baseWhere }),
    ]);

    return NextResponse.json({
      reviews,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user || !['SUPER_ADMIN', 'BRAND_MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, action, response } = updateReviewSchema.parse(body);

    // Get review and check authorization
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && user.brandId !== review.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let updateData: any = {};

    switch (action) {
      case 'approve':
        updateData = { isPublished: true };
        break;
      case 'reject':
        updateData = { isPublished: false };
        break;
      case 'respond':
        if (!response) {
          return NextResponse.json(
            { error: 'Response text is required' },
            { status: 400 }
          );
        }
        // Store response in metadata or a separate field
        updateData = {
          metadata: {
            response: {
              content: response,
              date: new Date().toISOString(),
              respondedBy: user.id,
            },
          },
        };
        break;
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
