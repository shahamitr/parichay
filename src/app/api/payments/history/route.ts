/**
 * Payment History API
 * GET /api/payments/history
 * Returns payment history for the authenticated user/brand
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query based on user role
    let subscriptionIds: string[] = [];

    if (user.role === 'SUPER_ADMIN') {
      // Super admin can see all payments or filter by brand
      if (brandId != null) {
        const brand = await prisma.brand.findUnique({
          where: { id: brandId },
          select: { subscriptionId: true },
        });
        if (brand?.subscriptionId) {
          subscriptionIds = [brand.subscriptionId];
        }
      }
    } else if (user.brandId) {
      // Regular users can only see their brand's payments
      const brand = await prisma.brand.findUnique({
        where: { id: user.brandId },
        select: { subscriptionId: true },
      });
      if (brand?.subscriptionId) {
        subscriptionIds = [brand.subscriptionId];
      }
    }

    const where = subscriptionIds.length > 0
      ? { subscriptionId: { in: subscriptionIds } }
      : user.role === 'SUPER_ADMIN' ? {} : { subscriptionId: 'none' };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          subscription: {
            include: {
              plan: {
                select: { name: true, duration: true },
              },
              brand: {
                select: { id: true, name: true },
              },
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              pdfUrl: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    // Calculate totals
    const totals = await prisma.payment.aggregate({
      where: { ...where, status: 'COMPLETED' },
      _sum: { amount: true },
      _count: { id: true },
    });

    return NextResponse.json({
      payments: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        paymentGateway: p.paymentGateway,
        createdAt: p.createdAt,
        plan: p.subscription?.plan?.name,
        duration: p.subscription?.plan?.duration,
        brand: p.subscription?.brand?.name,
        invoice: p.invoice,
        metadata: p.metadata,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      summary: {
        totalPaid: totals._sum.amount || 0,
        totalTransactions: totals._count.id,
      },
    });
  } catch (error) {
    console.error('Payment history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
