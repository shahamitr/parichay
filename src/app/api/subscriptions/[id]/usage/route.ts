/**
 * Subscription Usage Tracking API
 * GET /api/subscriptions/[id]/usage - Get subscription usage statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';

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
          include: {
            branches: {
              select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                createdAt: true,
              },
            },
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

    const features = subscription.plan.features as any;
    const currentBranchCount = subscription.brand?.branches.length || 0;
    const maxBranches = features.maxBranches || 0;

    // Calculate usage statistics
    const usage = {
      branches: {
        current: currentBranchCount,
        max: maxBranches,
        percentage: maxBranches > 0 ? (currentBranchCount / maxBranches) * 100 : 0,
        remaining: Math.max(0, maxBranches - currentBranchCount),
        canCreateMore: currentBranchCount < maxBranches,
      },
      features: {
        customDomain: {
          enabled: features.customDomain || false,
          inUse: !!subscription.brand?.customDomain,
        },
        analytics: {
          enabled: features.analytics || false,
        },
        qrCodes: {
          enabled: features.qrCodes || false,
        },
        leadCapture: {
          enabled: features.leadCapture || false,
        },
        prioritySupport: {
          enabled: features.prioritySupport || false,
        },
      },
      subscription: {
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        daysRemaining: Math.ceil(
          (new Date(subscription.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        autoRenew: subscription.autoRenew,
      },
    };

    return NextResponse.json({ usage });
  } catch (error) {
    return handleApiError(error);
  }
}
