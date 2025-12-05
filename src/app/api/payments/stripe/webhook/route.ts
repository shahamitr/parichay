/**
 * Stripe Webhook Handler
 * POST /api/payments/stripe/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { constructStripeWebhookEvent } from '@/lib/stripe';
import { generateLicenseKey, calculateEndDate, generateInvoiceNumber } from '@/lib/subscription-utils';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature and construct event
    const event = constructStripeWebhookEvent(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata;
  const { planId, brandId } = metadata;

  if (!planId || !brandId) {
    console.error('Missing metadata in payment intent');
    return;
  }

  try {
    // Get subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      console.error('Subscription plan not found:', planId);
      return;
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
        paymentGateway: 'STRIPE',
        externalSubscriptionId: paymentIntent.id,
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
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        status: 'COMPLETED',
        paymentGateway: 'STRIPE',
        externalPaymentId: paymentIntent.id,
        metadata: metadata as any,
      },
    });

    // Generate invoice
    const invoiceNumber = generateInvoiceNumber();
    await prisma.invoice.create({
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

    console.log('Payment processed successfully:', paymentIntent.id);
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata;
  const { planId, brandId } = metadata;

  try {
    // Find existing subscription if any
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: { subscription: true },
    });

    if (brand?.subscription) {
      // Create failed payment record
      await prisma.payment.create({
        data: {
          subscriptionId: brand.subscription.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'FAILED',
          paymentGateway: 'STRIPE',
          externalPaymentId: paymentIntent.id,
          metadata: metadata as any,
        },
      });
    }

    console.log('Payment failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error processing payment failure:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { externalPaymentId: charge.payment_intent as string },
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
    }

    console.log('Refund processed:', charge.id);
  } catch (error) {
    console.error('Error processing refund:', error);
  }
}
