/**
 * Subscription Invoices API
 * GET /api/subscriptions/[id]/invoices - Get all invoices for a subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this subscription
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== subscription.brand?.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to subscription' },
        { status: 403 }
      );
    }

    // Get all invoices for this subscription
    const invoices = await prisma.invoice.findMany({
      where: {
        subscriptionId: id,
      },
      include: {
        payment: {
          select: {
            id: true,
            paymentGateway: true,
            externalPaymentId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    return handleApiError(error);
  }
}
