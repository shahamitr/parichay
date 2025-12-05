import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branchId, brandId, rating, feedback, name, photo } = body;

    // Get branch to get brandId if not provided
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { brandId: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Create review in the reviews table
    const review = await prisma.review.create({
      data: {
        reviewerName: name,
        rating: rating,
        comment: feedback,
        reviewerAvatar: photo || null,
        branchId,
        brandId: brandId || branch.brandId,
        isPublished: false, // Requires moderation
        source: 'direct',
        helpfulCount: 0,
      },
    });

    // Track analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'LEAD_SUBMIT',
        branchId,
        brandId: brandId || branch.brandId,
        metadata: {
          type: 'review_submitted',
          reviewId: review.id,
          rating,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! It will be visible after moderation.',
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
