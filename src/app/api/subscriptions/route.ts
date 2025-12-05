// @ts-nocheck
/**
 * Subscriptions API Routes
 * GET /api/subscriptions - Get user's subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let subscriptions;

    if (user.role === 'SUPER_ADMIN') {
      // Super admin can see all subscriptions
      subscriptions = await prisma.subscription.findMany({
        include: {
          plan: true,
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          payments: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Regular users see only their brand's subscription
      const brands = await prisma.brand.findMany({
        where: {
          OR: [
            { ownerId: user.id },
            { users: { some: { id: user.id } } },
          ],
        },
        include: {
          subscription: {
            include: {
              plan: true,
              payments: {
                orderBy: {
                  createdAt: 'desc',
                },
                take: 5,
              },
            },
          },
        },
      });

      subscriptions = brands
        .filter(brand => brand.subscription)
        .map(brand => ({
          ...brand.subscription,
          brand: {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
          },
        }));
    }

    return NextResponse.json({ subscriptions });
  } catch (error) {
    return handleApiError(error);
  }
}
