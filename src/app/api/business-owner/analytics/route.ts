import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '7d';

    // Mock analytics data - in production, calculate from database
    const analyticsData = {
      overview: {
        totalViews: 1247,
        uniqueVisitors: 892,
        totalLeads: 89,
        conversionRate: 7.1,
        avgSessionDuration: 142, // seconds
        bounceRate: 34.2
      },
      trends: {
        viewsChange: 23.5,
        leadsChange: 15.8,
        conversionChange: -2.1
      },
      topSources: [
        { source: 'Direct', visits: 456, percentage: 36.6 },
        { source: 'Google Search', visits: 312, percentage: 25.0 },
        { source: 'Social Media', visits: 234, percentage: 18.8 },
        { source: 'QR Code', visits: 156, percentage: 12.5 },
        { source: 'Referral', visits: 89, percentage: 7.1 }
      ],
      topPages: [
        { page: '/profile', views: 567, uniqueViews: 423 },
        { page: '/services', views: 234, uniqueViews: 198 },
        { page: '/contact', views: 189, uniqueViews: 156 },
        { page: '/portfolio', views: 145, uniqueViews: 123 },
        { page: '/about', views: 112, uniqueViews: 98 }
      ],
      geographicData: [
        { location: 'New York, NY', visits: 234, percentage: 18.8 },
        { location: 'Los Angeles, CA', visits: 189, percentage: 15.2 },
        { location: 'Chicago, IL', visits: 156, percentage: 12.5 },
        { location: 'Houston, TX', visits: 123, percentage: 9.9 },
        { location: 'Phoenix, AZ', visits: 98, percentage: 7.9 }
      ],
      deviceData: [
        { device: 'Mobile', visits: 623, percentage: 50.0 },
        { device: 'Desktop', visits: 436, percentage: 35.0 },
        { device: 'Tablet', visits: 188, percentage: 15.0 }
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        visits: Math.floor(Math.random() * 100) + 10
      }))
    };

    return NextResponse.json({
      data: analyticsData,
      dateRange,
      success: true
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch analytics data',
      success: false
    }, { status: 500 });
  }
}