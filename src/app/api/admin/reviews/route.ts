/**
 * Admin Review Moderation API
 * GET /api/admin/reviews — Get reviews pending moderation
 * POST /api/admin/reviews — Approve or reject reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

// GET — List reviews for moderation
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending'; // pending, approved, rejected, all
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));

    // Build where clause
    const where: any = {};

    // Non-SUPER_ADMIN can only see their own brand's reviews
    if (user.role !== 'SUPER_ADMIN') {
      if (!user.brandId) return NextResponse.json({ reviews: [], total: 0 });
      where.brandId = user.brandId;
    }

    if (status === 'pending') where.isPublished = false;
    else if (status === 'approved') where.isPublished = true;
    // 'all' — no filter on isPublished

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          branch: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST — Approve/reject reviews
const moderationSchema = z.object({
  reviewIds: z.array(z.string()).min(1),
  action: z.enum(['approve', 'reject', 'delete']),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { reviewIds, action } = moderationSchema.parse(body);

    let affected = 0;

    switch (action) {
      case 'approve':
        const approved = await prisma.review.updateMany({
          where: {
            id: { in: reviewIds },
            ...(user.role !== 'SUPER_ADMIN' ? { brandId: user.brandId || '' } : {}),
          },
          data: { isPublished: true },
        });
        affected = approved.count;
        break;

      case 'reject':
        const rejected = await prisma.review.updateMany({
          where: {
            id: { in: reviewIds },
            ...(user.role !== 'SUPER_ADMIN' ? { brandId: user.brandId || '' } : {}),
          },
          data: { isPublished: false },
        });
        affected = rejected.count;
        break;

      case 'delete':
        // Only SUPER_ADMIN can permanently delete
        if (user.role !== 'SUPER_ADMIN') {
          return NextResponse.json({ error: 'Only admins can delete reviews' }, { status: 403 });
        }
        const deleted = await prisma.review.deleteMany({
          where: { id: { in: reviewIds } },
        });
        affected = deleted.count;
        break;
    }

    return NextResponse.json({
      success: true,
      affected,
      message: `${affected} review(s) ${action}ed`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Moderation failed' }, { status: 500 });
  }
}
