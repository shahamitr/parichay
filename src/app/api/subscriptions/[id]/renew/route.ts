/**
 * Subscription Renewal API
 * POST /api/subscriptions/[id]/renew - Renew a subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { calculateEndDate } from '@/lib/subscription-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        brand: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Check access
    if (user.role !== 'SUPER_ADMIN' && subscription.brand?.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Calculate new dates
    const now = new Date();
    const currentEndDate = new Date(subscription.endDate);
    const startDate = currentEndDate > now ? currentEndDate : now;
    const endDate = calculateEndDate(startDate, subscription.plan.duration);

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        startDate,
        endDate,
      },
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
      subscription: updatedSubscription,
      message: 'Subscription renewed successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
