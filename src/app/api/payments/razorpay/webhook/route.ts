/**
 * Razorpay Webhook Handler
 * POST /api/payments/razorpay/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature(body, signature, webhookSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity);
        break;

      default:
        logger.info({ eventType: event.event }, 'Unhandled Razorpay event type');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error({ error }, 'Razorpay webhook error');
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Update payment status if it exists
    const existingPayment = await prisma.payment.findFirst({
      where: { externalPaymentId: payment.id },
    });

    if (existingPayment && existingPayment.status !== 'COMPLETED') {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { status: 'COMPLETED' },
      });

      // Update invoice status
      const invoice = await prisma.invoice.findFirst({
        where: { paymentId: existingPayment.id },
      });

      if (invoice && invoice.status !== 'PAID') {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        });
      }
    }

    logger.info({ paymentId: payment.id }, 'Payment captured');
  } catch (error) {

    logger.error({ error, paymentId: payment.id }, 'Error processing payment captured');
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    // Find subscription by order ID
    const subscription = await prisma.subscription.findFirst({
      where: { externalSubscriptionId: payment.order_id },
    });

    if (subscription != null) {
      // Create failed payment record
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: 'FAILED',
          paymentGateway: 'RAZORPAY',
          externalPaymentId: payment.id,
          metadata: payment.notes as any,
        },
      });
    }

    logger.warn({ paymentId: payment.id }, 'Payment failed');
  } catch (error) {

    logger.error({ error, paymentId: payment.id }, 'Error processing payment failure');
  }
}

async function handleRefundCreated(refund: any) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { externalPaymentId: refund.payment_id },
    });

    if (payment != null) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      });

      // Update subscription status
      await prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: 'CANCELLED' },
      });

      // Update invoice status
      const invoice = await prisma.invoice.findFirst({
        where: { paymentId: payment.id },
      });

      if (invoice != null) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'CANCELLED' },
        });
      }
    }

    logger.info({ refundId: refund.id }, 'Refund processed');
  } catch (error) {

    logger.error({ error, refundId: refund.id }, 'Error processing refund');
  }
}
