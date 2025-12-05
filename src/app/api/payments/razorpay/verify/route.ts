// @ts-nocheck
/**
 * Razorpay Payment Verification
 * POST /api/payments/razorpay/verify
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { verifyRazorpayPaymentSignature, fetchRazorpayOrder } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey, calculateEndDate, generateInvoiceNumber } from '@/lib/subscription-utils';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
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
    const { orderId, paymentId, signature } = verifyPaymentSchema.parse(body);

    // Verify payment signature
    const isValid = verifyRazorpayPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Fetch order details to get metadata
    const order = await fetchRazorpayOrder(orderId);
    const metadata = order.notes;
    const { planId, brandId } = metadata;

    if (!planId || !brandId) {
      return NextResponse.json(
        { error: 'Invalid order metadata' },
        { status: 400 }
      );
    }

    // Get subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Create or update subscription
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.duration);
    const licenseKey = generateLicenseKey();

    const subscription = await prisma.subscription.create({
      data: {
        planId: plan.id,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: true,
        licenseKey,
        paymentGateway: 'RAZORPAY',
        externalSubscriptionId: orderId,
      },
    });

    // Update brand with subscription
    await prisma.brand.update({
      where: { id: brandId },
      data: { subscriptionId: subscription.id },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: order.amount / 100, // Convert from paise
        currency: order.currency,
        status: 'COMPLETED',
        paymentGateway: 'RAZORPAY',
        externalPaymentId: paymentId,
        metadata: metadata as any,
      },
    });

    // Generate invoice
    const invoiceNumber = generateInvoiceNumber();
    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        paymentId: payment.id,
        invoiceNumber,
        amount: payment.amount,
        currency: payment.currency,
        status: 'PAID',
        dueDate: startDate,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        licenseKey: subscription.licenseKey,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
