import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    stats: [
      { name: 'Total Views', value: '12,345', change: 12, icon: 'Eye', color: 'blue' },
      { name: 'Total Leads', value: '1,234', change: 8, icon: 'Users', color: 'green' },
      { name: 'Conversion Rate', value: '3.2%', change: 0.5, icon: 'TrendingUp', color: 'purple' },
      { name: 'Avg. Session', value: '2m 34s', change: 15, icon: 'Clock', color: 'orange' },
    ],
    trafficData: [
      { name: 'Mon', views: 1200, visitors: 800 },
      { name: 'Tue', views: 1800, visitors: 1100 },
      { name: 'Wed', views: 2200, visitors: 1400 },
      { name: 'Thu', views: 1900, visitors: 1200 },
      { name: 'Fri', views: 2800, visitors: 1800 },
      { name: 'Sat', views: 2400, visitors: 1600 },
      { name: 'Sun', views: 1600, visitors: 1000 },
    ],
    sourceData: [
      { name: 'Direct', visits: 4200 },
      { name: 'Social', visits: 2800 },
      { name: 'Search', visits: 2400 },
      { name: 'Referral', visits: 1800 },
      { name: 'Email', visits: 1200 },
    ],
    deviceData: [
      { name: 'Mobile', value: 65, color: '#f59e0b' },
      { name: 'Desktop', value: 28, color: '#8b5cf6' },
      { name: 'Tablet', value: 7, color: '#10b981' },
    ],
    topPages: [
      { page: '/home', views: 12450, bounce: '32%' },
      { page: '/products', views: 8320, bounce: '45%' },
      { page: '/about', views: 5120, bounce: '28%' },
      { page: '/contact', views: 3890, bounce: '22%' },
      { page: '/pricing', views: 2540, bounce: '38%' },
    ]
  },
  traffic: {
    pageViews: 45234,
    uniqueVisitors: 12456,
    avgDuration: '3m 42s',
    bounceRate: '42.3%',
    trafficTrends: [
      { date: '2024-01-01', views: 1200, visitors: 800 },
      { date: '2024-01-02', views: 1350, visitors: 900 },
      { date: '2024-01-03', views: 1100, visitors: 750 },
      { date: '2024-01-04', views: 1600, visitors: 1100 },
      { date: '2024-01-05', views: 1800, visitors: 1200 },
      { date: '2024-01-06', views: 2100, visitors: 1400 },
      { date: '2024-01-07', views: 1900, visitors: 1300 },
    ]
  },
  leads: {
    totalLeads: 1234,
    newLeads: 89,
    qualifiedLeads: 156,
    convertedLeads: 67,
    conversionRate: 28.5,
    responseRate: 85.2,
    avgResponseTime: '2.4 hrs',
    leadQualityScore: 7.8,
    leadsData: [
      { name: 'Week 1', leads: 45, converted: 12 },
      { name: 'Week 2', leads: 62, converted: 18 },
      { name: 'Week 3', leads: 58, converted: 15 },
      { name: 'Week 4', leads: 78, converted: 24 },
    ]
  },
  performance: {
    clickRate: 4.8,
    shareRate: 2.3,
    goalCompletion: 67,
    growthRate: 23,
    performanceTrends: [
      { month: 'Jan', score: 72 },
      { month: 'Feb', score: 75 },
      { month: 'Mar', score: 78 },
      { month: 'Apr', score: 74 },
      { month: 'May', score: 82 },
      { month: 'Jun', score: 85 },
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '7d';
    const tab = searchParams.get('tab') || 'overview';

    // In a real app, you would fetch from database based on date range and filters
    // const analytics = await db.analytics.findMany({
    //   where: {
    //     createdAt: {
    //       gte: getDateFromRange(dateRange)
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      data: mockAnalyticsData[tab as keyof typeof mockAnalyticsData] || mockAnalyticsData.overview,
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