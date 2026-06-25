import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [
      totalBrands,
      totalBranches,
      totalLeads,
      totalViews,
      qrCodes,
      shortLinks,
      recentLeadsData
    ] = await Promise.all([
      prisma.brand.count(),
      prisma.branch.count(),
      prisma.lead.count(),
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.qRCode.count(),
      prisma.shortLink.count(),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          branch: {
            include: {
              brand: true
            }
          }
        }
      })
    ]);

    const stats = {
      totalBrands,
      totalBranches,
      totalLeads,
      totalViews,
      leadsChange: 0, // calculate appropriately later
      viewsChange: 0,
      leadsToday: 0,
      qrCodes,
      shortLinks
    };

    const chartData = [
      { name: 'Mon', views: 0, leads: 0 },
      { name: 'Tue', views: 0, leads: 0 },
      { name: 'Wed', views: 0, leads: 0 },
      { name: 'Thu', views: 0, leads: 0 },
      { name: 'Fri', views: 0, leads: 0 },
      { name: 'Sat', views: 0, leads: 0 },
      { name: 'Sun', views: 0, leads: 0 }
    ];

    const recentLeads = recentLeadsData.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      createdAt: lead.createdAt.toISOString(),
      branchName: lead.branch?.name || 'Unknown',
      brandName: lead.branch?.brand?.name || 'Unknown'
    }));

    return NextResponse.json({
      success: true,
      stats,
      chartData,
      recentLeads
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