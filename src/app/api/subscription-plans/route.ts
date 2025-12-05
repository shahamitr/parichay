// @ts-nocheck
/**
 * Subscription Plans API Routes
 * GET /api/subscription-plans - List all active subscription plans
 * POST /api/subscription-plans - Create a new subscription plan (Super Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating subscription plan
const createPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  price: z.number().positive('Price must be positive'),
  duration: z.enum(['MONTHLY', 'YEARLY']),
  features: z.object({
    maxBranches: z.number().int().positive(),
    customDomain: z.boolean(),
    analytics: z.boolean(),
    qrCodes: z.boolean(),
    leadCapture: z.boolean(),
    prioritySupport: z.boolean().optional(),
  }),
});

/**
 * GET /api/subscription-plans
 * List all active subscription plans
 */
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/subscription-plans
 * Create a new subscription plan (Super Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is super admin
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only super admins can create subscription plans' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createPlanSchema.parse(body);

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        duration: validatedData.duration,
        features: validatedData.features,
        isActive: true,
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
