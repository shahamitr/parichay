/**
 * Individual Subscription API Routes
 * GET /api/subscriptions/[id] - Get subscription details
 * PUT /api/subscriptions/[id] - Update subscription (toggle auto-renew, cancel)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const updateSubscriptionSchema = z.object({
  autoRenew: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'CANCELLED']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Check access
    if (user.role !== 'SUPER_ADMIN' && subscription.brand?.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Check access
    if (user.role !== 'SUPER_ADMIN' && subscription.brand?.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateSubscriptionSchema.parse(body);

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: validatedData,
      include: {
        plan: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ subscription: updatedSubscription });
  } catch (error) {
    return handleApiError(error);
  }
}
