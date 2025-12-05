// @ts-nocheck
/**
 * Advanced Analytics API
 * GET /api/analytics/advanced - Get comprehensive analytics data
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { getAnalyticsSummary, getRealTimeAnalytics } from '@/lib/analytics/aggregator';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const realtime = searchParams.get('realtime') === 'true';

    // Check authorization
    if (!user.brandId) {
      return NextResponse.json({ error: 'No brand associated' }, { status: 403 });
    }

    // Get real-time analytics
    if (realtime) {
      const realtimeData = await getRealTimeAnalytics(
        user.brandId,
        branchId || undefined
      );
      return NextResponse.json(realtimeData);
    }

    // Get analytics summary
    const dateRange = startDate && endDate
      ? {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }
      : undefined;

    const summary = await getAnalyticsSummary(
      user.brandId,
      branchId || undefined,
      dateRange
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Advanced analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
