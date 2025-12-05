// @ts-nocheck
/**
 * Stripe Payment Intent Creation
 * POST /api/payments/stripe/create-intent
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { createStripePaymentIntent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createIntentSchema = z.object({
  planId: z.string(),
  brandId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, brandId } = createIntentSchema.parse(body);

    // Verify user has access to the brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied to this brand' },
        { status: 403 }
      );
    }

    // Get subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Subscription plan not found or inactive' },
        { status: 404 }
      );
    }

    // Create payment intent
    const paymentIntent = await createStripePaymentIntent(
      plan.price,
      'inr',
      {
        planId: plan.id,
        planName: plan.name,
        brandId: brand.id,
        brandName: brand.name,
        userId: user.id,
      }
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: plan.price,
      currency: 'INR',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
