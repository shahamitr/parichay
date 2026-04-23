import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Mock data for demo - in production, fetch from database based on user session
    const dashboardData = {
      stats: {
        totalViews: 1247,
        totalLeads: 89,
        totalAppointments: 34,
        conversionRate: 7.1,
        avgRating: 4.8,
        totalReviews: 156,
        monthlyGrowth: 23.5,
        activeOffers: 3
      },
      recentActivity: [
        {
          id: '1',
          type: 'lead',
          title: 'New Lead from Website',
          description: 'Sarah Johnson inquired about hair styling services',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'appointment',
          title: 'Appointment Booked',
          description: 'Mike Chen scheduled a consultation for tomorrow',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'review',
          title: 'New 5-Star Review',
          description: 'Emma Davis left a positive review about your service',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ],
      recentLeads: [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 123-4567',
          message: 'Interested in hair styling services for a wedding event',
          source: 'website',
          status: 'new',
          priority: 'high',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 (555) 987-6543',
          message: 'Looking for business consultation services',
          source: 'qr_code',
          status: 'contacted',
          priority: 'medium',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };

    return NextResponse.json({
      data: dashboardData,
      success: true
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch dashboard data',
      success: false
    }, { status: 500 });
  }
}