// @ts-nocheck
/**
 * Razorpay Order Creation
 * POST /api/payments/razorpay/create-order
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
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
    const { planId, brandId } = createOrderSchema.parse(body);

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

    // Create Razorpay order
    const order = await createRazorpayOrder(
      plan.price,
      'INR',
      {
        planId: plan.id,
        planName: plan.name,
        brandId: brand.id,
        brandName: brand.name,
        userId: user.id,
      }
    );

    return NextResponse.json({
      orderId: order.id,
      amount: plan.price,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
