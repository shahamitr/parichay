/**
 * Razorpay Order Creation with Voucher Support
 * POST /api/payments/razorpay/create-order
 *
 * REQUIRES REQUEST SIGNING for payment integrity.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { createRazorpayOrder } from '@/lib/razorpay';
import { verifySignedRequest, extractSigningFields } from '@/lib/request-signing';
import { logAuditEvent, AuditEventType, getIpAddress, logSuspiciousActivity } from '@/lib/audit-trail';
import { z } from 'zod';

const createOrderSchema = z.object({
  planId: z.string(),
  brandId: z.string(),
  voucherCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Verify request signature (payment = critical operation)
    const { payload, nonce, signature } = extractSigningFields(body);
    if (nonce && signature) {
      const sigResult = await verifySignedRequest(
        payload as Record<string, unknown>,
        nonce,
        signature,
        user.id
      );
      if (!sigResult.valid) {
        await logSuspiciousActivity({
          userId: user.id,
          description: `Payment order with invalid signature: ${sigResult.reason}`,
          severity: 'critical',
          ipAddress: getIpAddress(request.headers),
        });
        return NextResponse.json({ error: 'Invalid request signature' }, { status: 403 });
      }
    }

    const dataToValidate = nonce ? payload : body;
    const { planId, brandId, voucherCode } = createOrderSchema.parse(dataToValidate);

    // Verify brand access
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get plan
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    }

    let finalAmount = plan.price;
    let discount = 0;
    let voucherId: string | null = null;

    // Apply voucher if provided
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode.toUpperCase().trim() },
      });

      if (voucher && voucher.isActive) {
        const now = new Date();
        const isValid =
          (!voucher.validUntil || now <= new Date(voucher.validUntil)) &&
          (!voucher.maxUses || voucher.usedCount < voucher.maxUses);

        if (isValid) {
          // Check plan applicability
          const applicablePlans = voucher.applicablePlans as string[] | null;
          const planApplicable = !applicablePlans || applicablePlans.length === 0 || applicablePlans.includes(planId);

          if (planApplicable && (!voucher.minOrderAmount || plan.price >= voucher.minOrderAmount)) {
            if (voucher.discountType === 'PERCENTAGE') {
              discount = (plan.price * voucher.discountValue) / 100;
              if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                discount = voucher.maxDiscount;
              }
            } else {
              discount = voucher.discountValue;
            }
            discount = Math.min(discount, plan.price);
            finalAmount = Math.round((plan.price - discount) * 100) / 100;
            voucherId = voucher.id;
          }
        }
      }
    }

    // Create Razorpay order with discounted amount
    const order = await createRazorpayOrder(
      finalAmount,
      'INR',
      {
        planId: plan.id,
        planName: plan.name,
        brandId: brand.id,
        brandName: brand.name,
        userId: user.userId,
        voucherId: voucherId || undefined,
        originalAmount: plan.price,
        discount,
      }
    );

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmount,
      originalAmount: plan.price,
      discount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      voucherApplied: !!voucherId,
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
