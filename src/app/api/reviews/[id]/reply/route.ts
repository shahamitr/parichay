/**
 * Business Owner Reply to Review API
 * POST /api/reviews/[id]/reply - Post a reply to a review
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const replySchema = z.object({
  reply: z.string().min(1, 'Reply cannot be empty').max(2000, 'Reply is too long'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reply } = replySchema.parse(body);

    // Fetch the review with brand info
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        brand: {
          select: { id: true, userId: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify the user owns the brand or is a SUPER_ADMIN
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== review.brandId) {
      return NextResponse.json(
        { error: 'You do not have permission to reply to this review' },
        { status: 403 }
      );
    }

    // Update review with business reply
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        businessReply: reply,
        repliedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reply posted successfully',
      review: {
        id: updatedReview.id,
        businessReply: updatedReview.businessReply,
        repliedAt: updatedReview.repliedAt,
      },
    });
  } catch (error) {
    console.error('Error posting review reply:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid reply data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to post reply' },
      { status: 500 }
    );
  }
}
