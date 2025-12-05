/**
 * Analytics Dashboard API
 * GET /api/analytics/dashboard - Get comprehensive analytics data
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';

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

    // Get all analytics events
    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate metrics
    const pageViews = events.filter((e) => e.eventType === 'PAGE_VIEW').length;
    const clicks = events.filter((e) => e.eventType === 'CLICK').length;
    const qrScans = events.filter((e) => e.eventType === 'QR_SCAN').length;
    const leadSubmits = events.filter((e) => e.eventType === 'LEAD_SUBMIT').length;

    // Group events by date for charts
    const eventsByDate: Record<string, any> = {};
    events.forEach((event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      if (!eventsByDate[date]) {
        eventsByDate[date] = {
          date,
          pageViews: 0,
          clicks: 0,
          qrScans: 0,
          leadSubmits: 0,
        };
      }
      if (event.eventType === 'PAGE_VIEW') eventsByDate[date].pageViews++;
      if (event.eventType === 'CLICK') eventsByDate[date].clicks++;
      if (event.eventType === 'QR_SCAN') eventsByDate[date].qrScans++;
      if (event.eventType === 'LEAD_SUBMIT') eventsByDate[date].leadSubmits++;
    });

    const chartData = Object.values(eventsByDate).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    // Get click breakdown by action type
    const clickBreakdown: Record<string, number> = {};
    events
      .filter((e) => e.eventType === 'CLICK')
      .forEach((event) => {
        const action = (event.metadata as any)?.action || 'unknown';
        clickBreakdown[action] = (clickBreakdown[action] || 0) + 1;
      });

    // Get top locations
    const locationCounts: Record<string, number> = {};
    events.forEach((event) => {
      const location = event.location as { country?: string; city?: string } | null;
      if (location?.country) {
        const key = location.city
          ? `${location.city}, ${location.country}`
          : location.country;
        locationCounts[key] = (locationCounts[key] || 0) + 1;
      }
    });

    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }));

    return NextResponse.json({
      summary: {
        pageViews,
        clicks,
        qrScans,
        leadSubmits,
        totalEvents: events.length,
      },
      chartData,
      clickBreakdown,
      topLocations,
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
