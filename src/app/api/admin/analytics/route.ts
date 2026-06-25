import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '7d';
    const tab = searchParams.get('tab') || 'overview';

    // Simplified dynamic analytics fetching
    const [totalViews, totalLeads] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.lead.count()
    ]);

    const dynamicData = {
      overview: {
        stats: [
          { name: 'Total Views', value: totalViews.toString(), change: 0, icon: 'Eye', color: 'blue' },
          { name: 'Total Leads', value: totalLeads.toString(), change: 0, icon: 'Users', color: 'green' },
          { name: 'Conversion Rate', value: '0%', change: 0, icon: 'TrendingUp', color: 'purple' },
          { name: 'Avg. Session', value: '0m', change: 0, icon: 'Clock', color: 'orange' },
        ],
        trafficData: [],
        sourceData: [],
        deviceData: [],
        topPages: []
      },
      traffic: {
        pageViews: totalViews,
        uniqueVisitors: 0,
        avgDuration: '0m 0s',
        bounceRate: '0%',
        trafficTrends: []
      },
      leads: {
        totalLeads: totalLeads,
        newLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        responseRate: 0,
        avgResponseTime: '0 hrs',
        leadQualityScore: 0,
        leadsData: []
      },
      performance: {
        clickRate: 0,
        shareRate: 0,
        goalCompletion: 0,
        growthRate: 0,
        performanceTrends: []
      }
    };

    return NextResponse.json({
      success: true,
      data: dynamicData[tab as keyof typeof dynamicData] || dynamicData.overview,
      dateRange,
      tab
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}