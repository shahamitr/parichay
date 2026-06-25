import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { z } from 'zod';

const createVoucherSchema = z.object({
  code: z.string().min(3).max(50).transform(v => v.toUpperCase().trim()),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FLAT']).default('PERCENTAGE'),
  discountValue: z.number().positive(),
  maxUses: z.number().int().positive().optional().nullable(),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional().nullable(),
  applicablePlans: z.array(z.string()).optional().nullable(),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/vouchers — List all vouchers (Super Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { redemptions: true } },
      },
    });

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error('List vouchers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/vouchers — Create a new voucher (Super Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createVoucherSchema.parse(body);

    // Check for duplicate code
    const existing = await prisma.voucher.findUnique({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json({ error: 'A voucher with this code already exists' }, { status: 409 });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses || null,
        minOrderAmount: data.minOrderAmount || null,
        maxDiscount: data.maxDiscount || null,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        applicablePlans: data.applicablePlans || null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ voucher }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error('Create voucher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
