/**
 * Analytics Data Aggregator
 * Aggregates and processes analytics data for dashboards
 */

import { prisma } from '@/lib/prisma';

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: number }>;
  osBreakdown: Array<{ os: string; count: number; percentage: number }>;
  hourlyTraffic: Array<{ hour: number; count: number }>;
  dailyTraffic: Array<{ date: string; views: number; visitors: number }>;
  conversionFunnel: Array<{ step: string; count: number; dropoff: number }>;
  heatmapData: Array<{ x: number; y: number; value: number }>;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Get analytics summary for a brand/branch
 */
export async function getAnalyticsSummary(
  brandId: string,
  branchId?: string,
  dateRange?: DateRange
): Promise<AnalyticsSummary> {
  const where: any = { brandId };

  if (branchId) {
    where.branchId = branchId;
  }

  if (dateRange) {
    where.createdAt = {
      gte: dateRange.startDate,
      lte: dateRange.endDate,
    };
  }

  // Get all events
  const events = await prisma.analyticsEvent.findMany({
    where,
    select: {
      eventType: true,
      sessionId: true,
      metadata: true,
      createdAt: true,
      referrer: true,
      userAgent: true,
    },
  });

  // Calculate metrics
  const pageViews = events.filter(e => e.eventType === 'PAGE_VIEW');
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;

  // Average time on page
  const timeEvents = events.filter(e => e.eventType === 'TIME_ON_PAGE');
  const avgTime = timeEvents.length > 0
    ? timeEvents.reduce((sum, e) => sum + ((e.metadata as any)?.seconds || 0), 0) / timeEvents.length
    : 0;

  // Bounce rate (sessions with only 1 page view)
  const sessionPageViews = new Map<string, number>();
  pageViews.forEach(e => {
    sessionPageViews.set(e.sessionId, (sessionPageViews.get(e.sessionId) || 0) + 1);
  });
  const bouncedSessions = Array.from(sessionPageViews.values()).filter(count => count === 1).length;
  const bounceRate = uniqueSessions > 0 ? (bouncedSessions / uniqueSessions) * 100 : 0;

  // Top pages
  const pageCount = new Map<string, number>();
  pageViews.forEach(e => {
    const url = (e.metadata as any)?.url || 'Unknown';
    pageCount.set(url, (pageCount.get(url) || 0) + 1);
  });
  const topPages = Array.from(pageCount.entries())
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top referrers
  const referrerCount = new Map<string, number>();
  events.forEach(e => {
    if (e.referrer && e.referrer !== '') {
      const domain = new URL(e.referrer).hostname;
      referrerCount.set(domain, (referrerCount.get(domain) || 0) + 1);
    }
  });
  const topReferrers = Array.from(referrerCount.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Device breakdown
  const deviceCount = new Map<string, number>();
  events.forEach(e => {
    const device = (e.metadata as any)?.deviceInfo?.deviceType || 'Unknown';
    deviceCount.set(device, (deviceCount.get(device) || 0) + 1);
  });
  const totalDevices = Array.from(deviceCount.values()).reduce((a, b) => a + b, 0);
  const deviceBreakdown = Array.from(deviceCount.entries())
    .map(([device, count]) => ({
      device,
      count,
      percentage: totalDevices > 0 ? (count / totalDevices) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Browser breakdown
  const browserCount = new Map<string, number>();
  events.forEach(e => {
    const browser = (e.metadata as any)?.deviceInfo?.browser || 'Unknown';
    browserCount.set(browser, (browserCount.get(browser) || 0) + 1);
  });
  const totalBrowsers = Array.from(browserCount.values()).reduce((a, b) => a + b, 0);
  const browserBreakdown = Array.from(browserCount.entries())
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalBrowsers > 0 ? (count / totalBrowsers) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // OS breakdown
  const osCount = new Map<string, number>();
  events.forEach(e => {
    const os = (e.metadata as any)?.deviceInfo?.os || 'Unknown';
    osCount.set(os, (osCount.get(os) || 0) + 1);
  });
  const totalOS = Array.from(osCount.values()).reduce((a, b) => a + b, 0);
  const osBreakdown = Array.from(osCount.entries())
    .map(([os, count]) => ({
      os,
      count,
      percentage: totalOS > 0 ? (count / totalOS) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Hourly traffic
  const hourlyCount = new Map<number, number>();
  events.forEach(e => {
    const hour = new Date(e.createdAt).getHours();
    hourlyCount.set(hour, (hourlyCount.get(hour) || 0) + 1);
  });
  const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourlyCount.get(hour) || 0,
  }));

  // Daily traffic
  const dailyViews = new Map<string, number>();
  const dailyVisitors = new Map<string, Set<string>>();

  events.forEach(e => {
    const date = new Date(e.createdAt).toISOString().split('T')[0];

    if (e.eventType === 'PAGE_VIEW') {
      dailyViews.set(date, (dailyViews.get(date) || 0) + 1);
    }

    if (!dailyVisitors.has(date)) {
      dailyVisitors.set(date, new Set());
    }
    dailyVisitors.get(date)!.add(e.sessionId);
  });

  const dailyTraffic = Array.from(dailyViews.entries())
    .map(([date, views]) => ({
      date,
      views,
      visitors: dailyVisitors.get(date)?.size || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Conversion funnel
  const funnelSteps = [
    { step: 'Page View', eventType: 'PAGE_VIEW' },
    { step: 'Scroll 50%', eventType: 'SCROLL_DEPTH' },
    { step: 'Button Click', eventType: 'BUTTON_CLICK' },
    { step: 'Form Submit', eventType: 'FORM_SUBMIT' },
  ];

  const conversionFunnel = funnelSteps.map((step, index) => {
    const count = events.filter(e => {
      if (step.eventType === 'SCROLL_DEPTH') {
        return e.eventType === step.eventType && (e.metadata as any)?.depth >= 50;
      }
      return e.eventType === step.eventType;
    }).length;

    const previousCount = index > 0 ? conversionFunnel[index - 1].count : count;
    const dropoff = previousCount > 0 ? ((previousCount - count) / previousCount) * 100 : 0;

    return {
      step: step.step,
      count,
      dropoff,
    };
  });

  // Heatmap data (clicks)
  const clickEvents = events.filter(e => e.eventType === 'CLICK');
  const heatmapData = clickEvents
    .map(e => {
      const location = (e.metadata as any)?.locationInfo;
      return location ? { x: location.x, y: location.y, value: 1 } : null;
    })
    .filter(Boolean) as Array<{ x: number; y: number; value: number }>;

  return {
    totalViews: pageViews.length,
    uniqueVisitors: uniqueSessions,
    avgTimeOnPage: Math.round(avgTime),
    bounceRate: Math.round(bounceRate * 10) / 10,
    topPages,
    topReferrers,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    hourlyTraffic,
    dailyTraffic,
    conversionFunnel,
    heatmapData,
  };
}

/**
 * Get real-time analytics (last 30 minutes)
 */
export async function getRealTimeAnalytics(brandId: string, branchId?: string) {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const where: any = {
    brandId,
    createdAt: { gte: thirtyMinutesAgo },
  };

  if (branchId) {
    where.branchId = branchId;
  }

  const events = await prisma.analyticsEvent.findMany({
    where,
    select: {
      eventType: true,
      sessionId: true,
      createdAt: true,
      metadata: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const activeVisitors = new Set(
    events
      .filter(e => new Date(e.createdAt) > new Date(Date.now() - 5 * 60 * 1000))
      .map(e => e.sessionId)
  ).size;

  const recentEvents = events.slice(0, 20).map(e => ({
    type: e.eventType,
    time: e.createdAt,
    page: (e.metadata as any)?.url || (e.metadata as any)?.pageUrl,
  }));

  return {
    activeVisitors,
    totalEvents: events.length,
    recentEvents,
  };
}
