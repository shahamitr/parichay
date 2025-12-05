/**
 * UPI Payment Creation API
 * POST /api/payments/upi/create
 * Creates a UPI payment request using Razorpay
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const createUPIPaymentSchema = z.object({
  planId: z.string(),
  brandId: z.string(),
  upiId: z.string().regex(/^[\w.-]+@[\w]+$/, 'Invalid UPI ID format'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, brandId, upiId } = createUPIPaymentSchema.parse(body);

    // Verify user has access to the brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    }

    // For UPI, we'll use Razorpay's UPI intent or generate a UPI deep link
    // This creates a payment link that can be used with any UPI app

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const merchantUpiId = process.env.MERCHANT_UPI_ID || 'parichay@upi';
    const merchantName = 'Parichay';

    // Generate UPI deep link
    const upiLink = generateUPILink({
      payeeVpa: merchantUpiId,
      payeeName: merchantName,
      amount: plan.price,
      transactionRef: transactionId,
      transactionNote: `${plan.name} Subscription`,
    });

    // Store pending payment record
    const pendingPayment = await prisma.payment.create({
      data: {
        amount: plan.price,
        currency: 'INR',
        status: 'PENDING',
        paymentGateway: 'RAZORPAY',
        externalPaymentId: transactionId,
        metadata: {
          type: 'upi',
          upiId,
          planId,
          brandId,
          userId: user.id,
        },
        subscription: {
          create: {
            planId: plan.id,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: calculateEndDate(new Date(), plan.duration),
            autoRenew: false,
            licenseKey: generateLicenseKey(),
            paymentGateway: 'RAZORPAY',
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactionId,
      upiLink,
      qrData: upiLink, // Can be used to generate QR code
      amount: plan.price,
      paymentId: pendingPayment.id,
      message: 'Complete payment using your UPI app',
    });
  } catch (error: any) {
    console.error('UPI payment creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create UPI payment' },
      { status: 500 }
    );
  }
}

// Helper function to generate UPI deep link
function generateUPILink(params: {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  transactionNote: string;
}): string {
  const { payeeVpa, payeeName, amount, transactionRef, transactionNote } = params;

  const upiParams = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: amount.toString(),
    tr: transactionRef,
    tn: transactionNote,
    cu: 'INR',
  });

  return `upi://pay?${upiParams.toString()}`;
}

// Helper function to calculate subscription end date
function calculateEndDate(startDate: Date, duration: string): Date {
  const endDate = new Date(startDate);
  if (duration === 'YEARLY') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  return endDate;
}

// Helper function to generate license key
function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  const parts: string[] = [];

  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(segment);
  }

  return parts.join('-');
}
