/**
 * My Business Reviews API
 * GET /api/my-business/reviews — Get reviews for the owner's business
 * POST /api/my-business/reviews/[id]/reply — Reply to a review (delegated to /api/reviews/[id]/reply)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // all, published, pending

    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      select: { id: true },
    });

    if (!brand) {
      return NextResponse.json({ reviews: [], total: 0, avgRating: 0 });
    }

    const where: any = { brandId: brand.id };
    if (status === 'published') where.isPublished = true;
    if (status === 'pending') where.isPublished = false;

    const [reviews, total, avgRating] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          rating: true,
          comment: true,
          reviewerName: true,
          reviewerAvatar: true,
          photoUrl: true,
          businessReply: true,
          repliedAt: true,
          isPublished: true,
          createdAt: true,
          branch: { select: { name: true } },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { brandId: brand.id, isPublished: true },
        _avg: { rating: true },
      }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      avgRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
    });
  } catch (error) {
    console.error('My reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
