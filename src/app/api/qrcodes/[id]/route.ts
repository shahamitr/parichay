/**
 * Individual QR Code API
 * GET /api/qrcodes/[id] - Get specific QR code
 * DELETE /api/qrcodes/[id] - Delete QR code
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            slug: true,
            brandId: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Check authorization
    if (user.role !== 'SUPER_ADMIN') {
      const hasAccess =
        (qrCode.brandId && user.brandId === qrCode.brandId) ||
        (qrCode.branchId && user.branches.some((b) => b.id === qrCode.branchId));

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('QR code fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            brandId: true,
          },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Check authorization
    if (user.role !== 'SUPER_ADMIN') {
      const hasAccess =
        (qrCode.brandId && user.brandId === qrCode.brandId) ||
        (qrCode.branchId && user.branches.some((b) => b.id === qrCode.branchId));

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await prisma.qRCode.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('QR code deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR code' },
      { status: 500 }
    );
  }
}
