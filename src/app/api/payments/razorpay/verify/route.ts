/**
 * Razorpay Payment Verification & Subscription Activation
 * POST /api/payments/razorpay/verify
 *
 * Complete end-to-end flow:
 * 1. Verify Razorpay payment signature (anti-tampering)
 * 2. Verify amount matches (with voucher discount support)
 * 3. Create/update Subscription
 * 4. Create Payment record
 * 5. Generate Invoice
 * 6. Link to Brand
 * 7. Log audit event
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { verifyRazorpayPaymentSignature, fetchRazorpayOrder } from '@/lib/razorpay';
import { generateLicenseKey, calculateEndDate, generateInvoiceNumber } from '@/lib/subscription-utils';
import { logAuditEvent, AuditEventType, getIpAddress } from '@/lib/audit-trail';
import { z } from 'zod';
import logger from '@/lib/logger';

const verifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentId, signature } = verifyPaymentSchema.parse(body);

    // 1. Verify Razorpay payment signature
    const isValid = verifyRazorpayPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      logger.warn({ userId: user.id, orderId, paymentId }, 'Invalid Razorpay payment signature');
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Fetch order details from Razorpay
    const order = await fetchRazorpayOrder(orderId);
    const metadata = order.notes || {};
    const { planId, brandId, voucherId, discount: discountStr, originalAmount: origStr } = metadata;

    if (!planId || !brandId) {
      return NextResponse.json({ error: 'Invalid order metadata' }, { status: 400 });
    }

    // 3. Get plan and validate
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
    }

    // 4. Verify amount (accounting for voucher discounts)
    const discount = parseFloat(discountStr) || 0;
    const expectedAmount = Math.round((plan.price - discount) * 100); // in paise
    if (order.amount !== expectedAmount) {
      logger.error({ expected: expectedAmount, actual: order.amount, planId, discount }, 'Payment amount mismatch');
      return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 });
    }

    // 5. Check if brand exists and user has access
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 6. Create subscription + payment + invoice in a transaction
    const now = new Date();
    const startDate = now;
    const endDate = calculateEndDate(startDate, plan.duration);
    const licenseKey = generateLicenseKey();
    const invoiceNumber = generateInvoiceNumber();
    const paidAmount = order.amount / 100; // Convert paise to rupees

    const result = await prisma.$transaction(async (tx) => {
      // Check if brand already has an active subscription (upgrade case)
      let subscription;
      const existingSub = brand.subscriptionId
        ? await tx.subscription.findUnique({ where: { id: brand.subscriptionId } })
        : null;

      if (existingSub && existingSub.status === 'ACTIVE') {
        // Upgrade existing subscription
        subscription = await tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            planId: plan.id,
            status: 'ACTIVE',
            startDate,
            endDate,
            isTrial: false,
            trialEndsAt: null,
            autoRenew: true,
            paymentGateway: 'RAZORPAY',
            externalSubscriptionId: orderId,
          },
        });
      } else {
        // Create new subscription
        subscription = await tx.subscription.create({
          data: {
            planId: plan.id,
            status: 'ACTIVE',
            startDate,
            endDate,
            autoRenew: true,
            licenseKey,
            isTrial: false,
            paymentGateway: 'RAZORPAY',
            externalSubscriptionId: orderId,
          },
        });

        // Link subscription to brand
        await tx.brand.update({
          where: { id: brandId },
          data: { subscriptionId: subscription.id },
        });
      }

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: paidAmount,
          currency: order.currency || 'INR',
          status: 'COMPLETED',
          paymentGateway: 'RAZORPAY',
          externalPaymentId: paymentId,
          metadata: {
            razorpayOrderId: orderId,
            planName: plan.name,
            planDuration: plan.duration,
            brandName: brand.name,
            discount,
            voucherId: voucherId || null,
          },
        },
      });

      // Generate invoice
      const taxRate = 0.18;
      const subtotal = Math.round((paidAmount / (1 + taxRate)) * 100) / 100;
      const taxAmount = Math.round((paidAmount - subtotal) * 100) / 100;

      const invoice = await tx.invoice.create({
        data: {
          subscriptionId: subscription.id,
          paymentId: payment.id,
          invoiceNumber,
          amount: paidAmount,
          currency: order.currency || 'INR',
          status: 'PAID',
          dueDate: startDate,
          paidAt: now,
          metadata: {
            planName: plan.name,
            planDuration: plan.duration,
            subtotal,
            taxRate,
            taxAmount,
            discount,
            brandName: brand.name,
            licenseKey: subscription.licenseKey || licenseKey,
          },
        },
      });

      // Increment voucher usage if applied
      if (voucherId) {
        await tx.voucher.update({
          where: { id: voucherId },
          data: { usedCount: { increment: 1 } },
        }).catch(() => { /* Voucher may not exist anymore */ });
      }

      // Create notification for the user
      await tx.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM_ALERT',
          title: 'Subscription Activated! 🎉',
          message: `Your ${plan.name} (${plan.duration}) subscription is now active. Valid until ${endDate.toLocaleDateString()}.`,
          metadata: {
            subscriptionId: subscription.id,
            invoiceNumber,
          },
        },
      });

      return { subscription, payment, invoice };
    });

    // 7. Audit log
    await logAuditEvent({
      eventType: AuditEventType.PAYMENT_PROCESSED,
      userId: user.id,
      resourceId: result.subscription.id,
      resourceType: 'Subscription',
      ipAddress: getIpAddress(request.headers),
      metadata: {
        paymentId,
        orderId,
        amount: paidAmount,
        planName: plan.name,
        invoiceNumber,
        brandId,
      },
    });

    logger.info({
      userId: user.id,
      brandId,
      planId: plan.id,
      amount: paidAmount,
      invoiceNumber,
    }, 'Subscription payment verified and activated');

    return NextResponse.json({
      success: true,
      subscription: {
        id: result.subscription.id,
        status: 'ACTIVE',
        plan: plan.name,
        licenseKey: result.subscription.licenseKey || licenseKey,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      payment: {
        id: result.payment.id,
        amount: paidAmount,
        currency: order.currency || 'INR',
      },
      invoice: {
        id: result.invoice.id,
        invoiceNumber,
        downloadUrl: `/api/invoices/${result.invoice.id}/download`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }
    logger.error({ error }, 'Payment verification error');
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
