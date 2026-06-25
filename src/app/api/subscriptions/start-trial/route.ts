import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { generateLicenseKey } from '@/lib/subscription-utils';

/**
 * POST /api/subscriptions/start-trial — Start a 14-day free trial.
 * No payment required. One trial per brand.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { brandId, planId } = body;

    if (!brandId || !planId) {
      return NextResponse.json({ error: 'brandId and planId are required' }, { status: 400 });
    }

    // Verify brand ownership
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: { subscription: true },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if brand already has/had a trial
    if (brand.subscription) {
      if (brand.subscription.isTrial) {
        return NextResponse.json({ error: 'Trial is already active for this brand' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Brand already has an active subscription' }, { status: 409 });
    }

    // Check if any previous subscription was a trial (prevent re-trial)
    const previousTrial = await prisma.subscription.findFirst({
      where: {
        brand: { id: brandId },
        isTrial: true,
      },
    });

    if (previousTrial) {
      return NextResponse.json({ error: 'Free trial has already been used for this brand' }, { status: 409 });
    }

    // Verify plan exists
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create 14-day trial subscription
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.create({
      data: {
        planId: plan.id,
        status: 'ACTIVE',
        startDate: now,
        endDate: trialEnd,
        isTrial: true,
        trialEndsAt: trialEnd,
        autoRenew: false,
        licenseKey: generateLicenseKey(),
        paymentGateway: 'RAZORPAY', // Default, will be set on actual payment
        brand: { connect: { id: brandId } },
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        isTrial: true,
        trialEndsAt: trialEnd.toISOString(),
        plan: plan.name,
      },
      message: `14-day free trial started! Your trial ends on ${trialEnd.toLocaleDateString()}.`,
    });
  } catch (error) {
    console.error('Start trial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
