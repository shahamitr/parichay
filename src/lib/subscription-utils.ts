/**
 * Subscription and license management utilities
 */

import { generateRandomString } from './utils';
import crypto from 'crypto';

/**
 * Generate a unique license key
 * Format: XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const part1 = generateRandomString(4);
  const part2 = generateRandomString(4);
  const part3 = generateRandomString(4);
  const part4 = generateRandomString(4);

  return `${part1}-${part2}-${part3}-${part4}`;
}

/**
 * Validate license key format
 */
export function isValidLicenseKey(licenseKey: string): boolean {
  const licenseRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return licenseRegex.test(licenseKey);
}

/**
 * Calculate subscription end date based on duration
 */
export function calculateEndDate(startDate: Date, duration: 'MONTHLY' | 'YEARLY'): Date {
  const endDate = new Date(startDate);

  if (duration === 'MONTHLY') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return endDate;
}

/**
 * Check if subscription is in grace period
 * Grace period is 7 days after expiration
 */
export function isInGracePeriod(endDate: Date): boolean {
  const now = new Date();
  const gracePeriodEnd = new Date(endDate);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);

  return now > endDate && now <= gracePeriodEnd;
}

/**
 * Check if subscription should be suspended
 */
export function shouldSuspendSubscription(endDate: Date): boolean {
  const now = new Date();
  const gracePeriodEnd = new Date(endDate);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);

  return now > gracePeriodEnd;
}

/**
 * Generate invoice number
 * Format: INV-YYYYMMDD-XXXX
 */
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = generateRandomString(4);

  return `INV-${year}${month}${day}-${random}`;
}

/**
 * Verify webhook signature for Stripe
 */
export function verifyStripeSignature(
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
    return false;
  }
}

/**
 * Verify webhook signature for Razorpay
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate tax amount (18% GST for India)
 */
export function calculateTax(amount: number, taxRate: number = 0.18): number {
  return Math.round(amount * taxRate * 100) / 100;
}

/**
 * Calculate total amount with tax
 */
export function calculateTotalWithTax(amount: number, taxRate: number = 0.18): number {
  return amount + calculateTax(amount, taxRate);
}
