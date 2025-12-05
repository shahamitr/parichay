/**
 * UPI Payment Verification API
 * POST /api/payments/upi/verify
 * Verifies UPI payment status
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const verifyUPIPaymentSchema = z.object({
  transactionId: z.string(),
  upiTransactionId: z.string().optional(), // UTR number from UPI app
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, upiTransactionId } = verifyUPIPaymentSchema.parse(body);

    // Find the pending payment
    const payment = await prisma.payment.findFirst({
      where: {
        externalPaymentId: transactionId,
        status: 'PENDING',
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const metadata = payment.metadata as any;

    // Verify user owns this payment
    if (user.role !== 'SUPER_ADMIN' && metadata.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // In production, you would verify with Razorpay/bank API
    // For now, we'll mark as completed if UTR is provided
    if (upiTransactionId != null) {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          metadata: {
            ...metadata,
            upiTransactionId,
            verifiedAt: new Date().toISOString(),
          },
        },
      });

      // Update subscription status
      if (payment.subscription) {
        await prisma.subscription.update({
          where: { id: payment.subscription.id },
          data: { status: 'ACTIVE' },
        });

        // Link subscription to brand
        await prisma.brand.update({
          where: { id: metadata.brandId },
          data: { subscriptionId: payment.subscription.id },
        });

        // Generate invoice
        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        await prisma.invoice.create({
          data: {
            subscriptionId: payment.subscription.id,
            paymentId: payment.id,
            invoiceNumber,
            amount: payment.amount,
            currency: payment.currency,
            status: 'PAID',
            dueDate: new Date(),
            paidAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        message: 'Payment verified successfully',
        subscription: payment.subscription ? {
          id: payment.subscription.id,
          plan: payment.subscription.plan.name,
          endDate: payment.subscription.endDate,
          licenseKey: payment.subscription.licenseKey,
        } : null,
      });
    }

    // Return current status
    return NextResponse.json({
      success: true,
      status: payment.status,
      message: 'Payment is pending verification',
    });
  } catch (error: any) {
    console.error('UPI payment verification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
