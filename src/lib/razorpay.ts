/**
 * Razorpay payment gateway integration
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialization to avoid errors during build
let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export const razorpay = {
  get orders() { return getRazorpay().orders; },
  get payments() { return getRazorpay().payments; },
};

/**
 * Create a Razorpay order for subscription
 */
export async function createRazorpayOrder(
  amount: number,
  currency: string = 'INR',
  metadata: Record<string, string> = {}
): Promise<any> {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      notes: metadata,
    });

    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw new Error('Failed to create Razorpay order');
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Razorpay signature verification failed:', error);
    return false;
  }
}

/**
 * Fetch payment details
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<any> {
  try {
    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    console.error('Failed to fetch Razorpay payment:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Fetch order details
 */
export async function fetchRazorpayOrder(orderId: string): Promise<any> {
  try {
    return await razorpay.orders.fetch(orderId);
  } catch (error) {
    console.error('Failed to fetch Razorpay order:', error);
    throw new Error('Failed to fetch order details');
  }
}

/**
 * Create refund
 */
export async function createRazorpayRefund(
  paymentId: string,
  amount?: number
): Promise<any> {
  try {
    const refundData: any = {
      payment_id: paymentId,
    };

    if (amount != null) {
      refundData.amount = Math.round(amount * 100);
    }

    return await razorpay.payments.refund(paymentId, refundData);
  } catch (error) {
    console.error('Razorpay refund creation failed:', error);
    throw new Error('Failed to create refund');
  }
}

/**
 * Verify webhook signature
 */
export function verifyRazorpayWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Razorpay webhook signature verification failed:', error);
    return false;
  }
}
