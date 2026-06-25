import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const validateSchema = z.object({
  code: z.string().min(1).max(50),
  planId: z.string().optional(),
  amount: z.number().positive().optional(),
});

/**
 * POST /api/vouchers/validate — Validate a voucher code and return discount info.
 * Used on the checkout page before payment.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, planId, amount } = validateSchema.parse(body);

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!voucher) {
      return NextResponse.json({ valid: false, error: 'Invalid voucher code' }, { status: 404 });
    }

    // Check if active
    if (!voucher.isActive) {
      return NextResponse.json({ valid: false, error: 'This voucher is no longer active' });
    }

    // Check validity dates
    const now = new Date();
    if (voucher.validFrom && now < new Date(voucher.validFrom)) {
      return NextResponse.json({ valid: false, error: 'This voucher is not yet active' });
    }
    if (voucher.validUntil && now > new Date(voucher.validUntil)) {
      return NextResponse.json({ valid: false, error: 'This voucher has expired' });
    }

    // Check usage limit
    if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) {
      return NextResponse.json({ valid: false, error: 'This voucher has reached its usage limit' });
    }

    // Check if user already used this voucher
    const existingRedemption = await prisma.voucherRedemption.findFirst({
      where: { voucherId: voucher.id, userId: user.id },
    });
    if (existingRedemption) {
      return NextResponse.json({ valid: false, error: 'You have already used this voucher' });
    }

    // Check applicable plans
    if (planId && voucher.applicablePlans) {
      const plans = voucher.applicablePlans as string[];
      if (plans.length > 0 && !plans.includes(planId)) {
        return NextResponse.json({ valid: false, error: 'This voucher is not applicable to the selected plan' });
      }
    }

    // Check minimum order amount
    if (voucher.minOrderAmount && amount && amount < voucher.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount is ₹${voucher.minOrderAmount}`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (amount) {
      if (voucher.discountType === 'PERCENTAGE') {
        discount = (amount * voucher.discountValue) / 100;
        if (voucher.maxDiscount && discount > voucher.maxDiscount) {
          discount = voucher.maxDiscount;
        }
      } else {
        discount = voucher.discountValue;
      }
      discount = Math.min(discount, amount); // Can't exceed order amount
    }

    return NextResponse.json({
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscount: voucher.maxDiscount,
      },
      discount: Math.round(discount * 100) / 100,
      finalAmount: amount ? Math.round((amount - discount) * 100) / 100 : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 400 });
    }
    console.error('Voucher validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
