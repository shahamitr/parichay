/**
 * Action Analytics API
 * GET /api/analytics/actions — Get breakdown of tracked actions (calls, WhatsApp, directions, etc.)
 *
 * Returns counts and trends for each action type.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') || user.brandId;
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
    }

    // Calculate date range
    const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[period] || 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Get action events for current period
    const actionTypes = ['ACTION_CALL', 'ACTION_WHATSAPP', 'ACTION_DIRECTIONS', 'ACTION_EMAIL', 'ACTION_SHARE', 'ACTION_BOOKING', 'ACTION_DOWNLOAD'];

    const [currentEvents, previousEvents] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: {
          brandId,
          eventType: { in: actionTypes as any },
          createdAt: { gte: startDate },
        },
        select: { eventType: true, createdAt: true },
      }),
      prisma.analyticsEvent.findMany({
        where: {
          brandId,
          eventType: { in: actionTypes as any },
          createdAt: { gte: prevStartDate, lt: startDate },
        },
        select: { eventType: true },
      }),
    ]);

    // Count by type
    const currentCounts: Record<string, number> = {};
    const previousCounts: Record<string, number> = {};

    for (const type of actionTypes) {
      currentCounts[type] = currentEvents.filter((e) => e.eventType === type).length;
      previousCounts[type] = previousEvents.filter((e) => e.eventType === type).length;
    }

    // Build response with trends
    const actions = actionTypes.map((type) => {
      const current = currentCounts[type] || 0;
      const previous = previousCounts[type] || 0;
      const trend = previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;

      return {
        action: type.replace('ACTION_', '').toLowerCase(),
        label: formatActionLabel(type),
        count: current,
        previousCount: previous,
        trend, // percentage change
        trendDirection: trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat',
      };
    });

    // Daily breakdown for chart
    const dailyData: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dailyData[date.toISOString().split('T')[0]] = 0;
    }
    for (const event of currentEvents) {
      const date = event.createdAt.toISOString().split('T')[0];
      if (dailyData[date] !== undefined) dailyData[date]++;
    }

    return NextResponse.json({
      success: true,
      period,
      totalActions: currentEvents.length,
      actions: actions.filter((a) => a.count > 0 || a.previousCount > 0),
      dailyBreakdown: Object.entries(dailyData).map(([date, count]) => ({ date, count })),
    });
  } catch (error) {
    console.error('Actions analytics error:', error);
    return NextResponse.json({ error: 'Failed to load actions data' }, { status: 500 });
  }
}

function formatActionLabel(type: string): string {
  const labels: Record<string, string> = {
    ACTION_CALL: 'Phone Calls',
    ACTION_WHATSAPP: 'WhatsApp Messages',
    ACTION_DIRECTIONS: 'Get Directions',
    ACTION_EMAIL: 'Email Clicks',
    ACTION_SHARE: 'Profile Shares',
    ACTION_BOOKING: 'Bookings',
    ACTION_DOWNLOAD: 'vCard Downloads',
  };
  return labels[type] || type;
}
