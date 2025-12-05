/**
 * Invoice API Routes
 * GET /api/invoices/[id] - Get invoice details
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

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
            brand: {
              select: {
                id: true,
                name: true,
                ownerId: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check access
    if (user.role !== 'SUPER_ADMIN' && invoice.subscription.brand?.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    return handleApiError(error);
  }
}
