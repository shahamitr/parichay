/**
 * Individual Subscription Plan API Routes
 * GET /api/subscription-plans/[id] - Get a specific subscription plan
 * PUT /api/subscription-plans/[id] - Update a subscription plan (Super Admin only)
 * DELETE /api/subscription-plans/[id] - Deactivate a subscription plan (Super Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  duration: z.enum(['MONTHLY', 'YEARLY']).optional(),
  features: z.object({
    maxBranches: z.number().int().positive(),
    customDomain: z.boolean(),
    analytics: z.boolean(),
    qrCodes: z.boolean(),
    leadCapture: z.boolean(),
    prioritySupport: z.boolean().optional(),
  }).optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/subscription-plans/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/subscription-plans/[id]
 */
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

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only super admins can update subscription plans' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updatePlanSchema.parse(body);

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ plan });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/subscription-plans/[id]
 * Soft delete by setting isActive to false
 */
export async function DELETE(
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

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only super admins can delete subscription plans' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ plan });
  } catch (error) {
    return handleApiError(error);
  }
}
