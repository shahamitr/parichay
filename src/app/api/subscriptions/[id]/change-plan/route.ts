/**
 * Subscription Plan Change API
 * POST /api/subscriptions/[id]/change-plan - Upgrade or downgrade subscription plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth-utils';
import { calculateEndDate } from '@/lib/subscription-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { newPlanId } = body;

    if (!newPlanId) {
      return NextResponse.json(
        { error: 'New plan ID is required' },
        { status: 400 }
      );
    }

    // Get current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        brand: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this subscription
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== subscription.brand?.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to subscription' },
        { status: 403 }
      );
    }

    // Get new plan
    const newPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: newPlanId },
    });

    if (!newPlan || !newPlan.isActive) {
      return NextResponse.json(
        { error: 'New plan not found or inactive' },
        { status: 404 }
      );
    }

    // Check if it's the same plan
    if (subscription.planId === newPlanId) {
      return NextResponse.json(
        { error: 'Already subscribed to this plan' },
        { status: 400 }
      );
    }

    const now = new Date();
    const isUpgrade = newPlan.price > subscription.plan.price;
    const isDowngrade = newPlan.price < subscription.plan.price;

    // For upgrades, apply immediately
    // For downgrades, schedule for end of current period
    let effectiveDate = now;
    let newEndDate = subscription.endDate;

    if (isUpgrade) {
      // Immediate upgrade - calculate prorated end date
      const remainingDays = Math.ceil(
        (new Date(subscription.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalDays = subscription.plan.duration === 'MONTHLY' ? 30 : 365;
      const remainingValue = (subscription.plan.price / totalDays) * remainingDays;
      const newPlanDailyRate = newPlan.price / (newPlan.duration === 'MONTHLY' ? 30 : 365);
      const additionalDays = Math.floor(remainingValue / newPlanDailyRate);

      newEndDate = calculateEndDate(now, newPlan.duration);
      // Add the prorated days
      newEndDate = new Date(newEndDate.getTime() + additionalDays * 24 * 60 * 60 * 1000);
    } else if (isDowngrade) {
      // Downgrade at end of current period
      effectiveDate = new Date(subscription.endDate);
      newEndDate = calculateEndDate(effectiveDate, newPlan.duration);
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        planId: newPlanId,
        endDate: newEndDate,
        updatedAt: now,
      },
      include: {
        plan: true,
        brand: true,
      },
    });

    // Create notification
    if (user.id) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM_ALERT',
          title: isUpgrade ? 'Subscription Upgraded' : 'Subscription Downgraded',
          message: `Your subscription has been ${isUpgrade ? 'upgraded' : 'scheduled for downgrade'} to ${newPlan.name}. ${
            isDowngrade ? 'Changes will take effect at the end of your current billing period.' : ''
          }`,
          metadata: {
            subscriptionId: id,
            oldPlanId: subscription.planId,
            newPlanId: newPlanId,
            effectiveDate: effectiveDate.toISOString(),
          },
        },
      });
    }

    return NextResponse.json({
      subscription: updatedSubscription,
      message: isUpgrade
        ? 'Subscription upgraded successfully'
        : 'Subscription will be downgraded at the end of current billing period',
      effectiveDate,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
