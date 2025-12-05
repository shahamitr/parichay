// @ts-nocheck
/**
 * Stripe payment gateway integration
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

/**
 * Create a payment intent for subscription
 */
export async function createStripePaymentIntent(
  amount: number,
  currency: string = 'inr',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    throw new Error('Failed to create payment intent');
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createStripeCheckoutSession(
  priceAmount: number,
  currency: string = 'inr',
  successUrl: string,
  cancelUrl: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: metadata.planName || 'Subscription Plan',
              description: metadata.planDescription,
            },
            unit_amount: Math.round(priceAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Retrieve payment intent
 */
export async function retrieveStripePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Failed to retrieve payment intent:', error);
    throw new Error('Failed to retrieve payment intent');
  }
}

/**
 * Construct webhook event from request
 */
export function constructStripeWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Handle refund
 */
export async function createStripeRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  try {
    const refundData: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount != null) {
      refundData.amount = Math.round(amount * 100);
    }

    return await stripe.refunds.create(refundData);
  } catch (error) {
    console.error('Stripe refund creation failed:', error);
    throw new Error('Failed to create refund');
  }
}
