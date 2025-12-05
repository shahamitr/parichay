/**
 * Payment Methods API
 * GET /api/subscriptions/[id]/payment-methods - Get all payment methods for a subscription
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

    // For now, return mock data since payment methods are managed by payment gateways
    // In a real implementation, you would fetch this from Stripe/Razorpay APIs
    const paymentMethods = [
      {
        id: 'pm_mock_1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        gateway: subscription.paymentGateway,
      },
    ];

    return NextResponse.json({ paymentMethods });
  } catch (error) {
    return handleApiError(error);
  }
}
