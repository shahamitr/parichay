// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'today';
    const brandId = searchParams.get('brandId');

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    // Build where clause
    const where: any = {
      createdAt: {
        gte: startDate,
      },
    };

    if (brandId) {
      where.brandId = brandId;
    }

    // Get real-time stats - with fallback for missing analytics table
    let totalViews = 0;
    let uniqueVisitors = 0;
    let qrScans = 0;
    let leads = 0;

    try {
      [totalViews, qrScans, leads] = await Promise.all([
        // Total page views
        prisma.analyticsEvent?.count({
          where: {
            ...where,
            eventType: 'PAGE_VIEW',
          },
        }).catch(() => 0) || Promise.resolve(0),
        // QR code scans
        prisma.analyticsEvent?.count({
          where: {
            ...where,
            eventType: 'QR_SCAN',
          },
        }).catch(() => 0) || Promise.resolve(0),
        // New leads
        prisma.lead?.count({
          where: {
            createdAt: {
              gte: startDate,
            },
            ...(brandId ? { branch: { brandId } } : {}),
          },
        }).catch(() => 0) || Promise.resolve(0),
      ]);

      // Unique visitors - fetch and count unique sessionIds from metadata in JavaScript
      const sessionEvents = await prisma.analyticsEvent?.findMany({
        where: {
          ...where,
          eventType: 'PAGE_VIEW',
        },
        select: { metadata: true },
      }).catch(() => []) || [];

      const uniqueSessions = new Set(
        sessionEvents
          .map((e: any) => e.metadata?.sessionId)
          .filter(Boolean)
      );
      uniqueVisitors = uniqueSessions.size;
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Use default values if analytics table doesn't exist
    }

    // Get hourly breakdown for today - fetch and aggregate in JavaScript
    const hourlyEvents = await prisma.analyticsEvent?.findMany({
      where: {
        ...where,
        eventType: 'PAGE_VIEW',
      },
      select: { createdAt: true },
    }).catch(() => []) || [];

    // Process hourly data
    const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => {
      const hourStart = new Date(startDate);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hour + 1, 0, 0, 0);

      const count = hourlyEvents?.filter((item: any) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= hourStart && itemDate < hourEnd;
      }).length || 0;

      return {
        hour: `${hour}:00`,
        views: count,
      };
    });

    // Get top pages - fetch and aggregate in JavaScript
    const pageEvents = await prisma.analyticsEvent?.findMany({
      where: {
        ...where,
        eventType: 'PAGE_VIEW',
      },
      select: { metadata: true },
    }).catch(() => []) || [];

    // Count page views
    const pageViewsMap = new Map<string, number>();
    pageEvents.forEach((event: any) => {
      const page = event.metadata?.page || 'Unknown';
      pageViewsMap.set(page, (pageViewsMap.get(page) || 0) + 1);
    });

    // Sort and get top 5
    const topPages = Array.from(pageViewsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }));

    return NextResponse.json({
      stats: {
        totalViews,
        uniqueVisitors,
        qrScans,
        leads,
      },
      hourlyBreakdown,
      topPages,
      period,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Realtime analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch realtime analytics' },
      { status: 500 }
    );
  }
}

