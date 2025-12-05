/**
 * Public Reviews API
 * GET /api/reviews - Get reviews for a branch
 * POST /api/reviews - Submit a new review
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createReviewSchema = z.object({
  branchId: z.string(),
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email().optional(),
  authorCompany: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().min(10).max(2000),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!branchId && !brandId) {
      return NextResponse.json(
        { error: 'branchId or brandId is required' },
        { status: 400 }
      );
    }

    const where: any = {
      isPublished: true,
    };

    if (branchId) where.branchId = branchId;
    if (brandId) where.brandId = brandId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          branch: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      reviews,
      total,
      averageRating: avgRating._avg.rating || 0,
      totalReviews: avgRating._count.rating,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId },
      include: { brand: true },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Create review (pending moderation by default)
    const review = await prisma.review.create({
      data: {
        reviewerName: validatedData.authorName,
        reviewerEmail: validatedData.authorEmail,
        rating: validatedData.rating,
        title: validatedData.title,
        comment: validatedData.content,
        branchId: validatedData.branchId,
        brandId: branch.brandId,
        isPublished: false, // Requires moderation
        helpfulCount: 0,
      },
    });

    // Track analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'LEAD_SUBMIT',
        branchId: branch.id,
        brandId: branch.brandId,
        metadata: {
          type: 'review_submitted',
          reviewId: review.id,
          rating: validatedData.rating,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully. It will be visible after moderation.',
      review: {
        id: review.id,
        rating: review.rating,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
