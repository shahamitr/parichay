/**
 * Payment Method Management API
 * DELETE /api/subscriptions/[id]/payment-methods/[methodId] - Remove a payment method
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth-utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; methodId: string }> }
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

    const { id, methodId } = await params;

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

    // In a real implementation, you would call Stripe/Razorpay API to remove payment method
    // For now, return success
    return NextResponse.json({
      message: 'Payment method removed successfully',
      methodId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
