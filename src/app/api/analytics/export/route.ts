/**
 * Analytics Export API
 * GET /api/analytics/export - Export analytics data as CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { generateCSVString } from '@/lib/csv-export';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventType = searchParams.get('eventType');

    // Build where clause based on user role and filters
    const where: any = {};

    if (user.role === 'SUPER_ADMIN') {
      if (branchId) where.branchId = branchId;
      if (brandId) where.brandId = brandId;
    } else if (user.role === 'BRAND_MANAGER') {
      where.brandId = user.brandId;
      if (branchId) where.branchId = branchId;
    } else {
      where.branchId = {
        in: user.branches?.map((b) => b.id),
      };
      if (branchId && user.branches?.some((b) => b.id === branchId)) {
        where.branchId = branchId;
      }
    }

    // Add date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Add event type filter
    if (eventType != null) {
      where.eventType = eventType;
    }

    // Fetch analytics events
    const events = await prisma.analyticsEvent.findMany({
      where,
      include: {
        branch: {
          select: {
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format data for CSV
    const csvData = events.map((event) => ({
      Date: event.createdAt.toISOString(),
      'Event Type': event.eventType,
      Branch: event.branch?.name || 'N/A',
      Brand: event.brand?.name || 'N/A',
      'User Agent': event.userAgent || 'N/A',
      'IP Address': event.ipAddress || 'N/A',
      Country: (event.location as any)?.country || 'N/A',
      City: (event.location as any)?.city || 'N/A',
      Metadata: JSON.stringify(event.metadata || {}),
    }));

    // Generate CSV
    const csv = generateCSVString(csvData);

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
