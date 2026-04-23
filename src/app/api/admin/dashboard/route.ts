import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard data to prevent chart rendering issues
    const mockStats = {
      totalBrands: 15,
      totalBranches: 42,
      totalLeads: 1247,
      totalViews: 8934,
      leadsChange: 12.5,
      viewsChange: 8.3,
      leadsToday: 23,
      qrCodes: 156,
      shortLinks: 89
    };

    const mockChartData = [
      { name: 'Mon', views: 120, leads: 15 },
      { name: 'Tue', views: 180, leads: 22 },
      { name: 'Wed', views: 150, leads: 18 },
      { name: 'Thu', views: 220, leads: 28 },
      { name: 'Fri', views: 280, leads: 35 },
      { name: 'Sat', views: 200, leads: 25 },
      { name: 'Sun', views: 160, leads: 20 }
    ];

    const mockRecentLeads = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        createdAt: new Date().toISOString(),
        branchName: 'Main Office',
        brandName: 'TechCorp'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        branchName: 'Downtown',
        brandName: 'Creative Studio'
      },
      {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        branchName: 'Bandra',
        brandName: 'Spice Garden'
      }
    ];

    return NextResponse.json({
      success: true,
      stats: mockStats,
      chartData: mockChartData,
      recentLeads: mockRecentLeads
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        stats: {
          totalBrands: 0,
          totalBranches: 0,
          totalLeads: 0,
          totalViews: 0,
          leadsChange: 0,
          viewsChange: 0,
          leadsToday: 0,
          qrCodes: 0,
          shortLinks: 0
        },
        chartData: [],
        recentLeads: []
      },
      { status: 500 }
    );
  }
}