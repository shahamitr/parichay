/**
 * QR Code Analytics API
 * GET /api/analytics/qrcode/[id] - Get analytics for a specific QR code
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

    // Get QR code
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

    // Get recent scans (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentScans = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'QR_SCAN',
        metadata: {
          path: ['qrCodeId'],
          equals: id,
        },
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Format scan data
    const formattedScans = recentScans.map((scan) => ({
      timestamp: scan.createdAt.toISOString(),
      location: scan.location as { country?: string; city?: string } | undefined,
      userAgent: scan.userAgent,
    }));

    return NextResponse.json({
      qrCodeId: id,
      scanCount: qrCode.scanCount,
      recentScans: formattedScans,
    });
  } catch (error) {
    console.error('QR code analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
