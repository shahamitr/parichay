/**
 * My Business Analytics API
 * GET /api/my-business/analytics — Simple analytics for business owners
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

    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      select: { id: true },
    });

    if (!brand) {
      return NextResponse.json({ stats: null });
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      viewsThisWeek,
      viewsLastMonth,
      leadsThisWeek,
      callsThisWeek,
      whatsappThisWeek,
      totalLeads,
    ] = await Promise.all([
      prisma.analyticsEvent.count({ where: { brandId: brand.id, eventType: 'PAGE_VIEW', createdAt: { gte: weekAgo } } }),
      prisma.analyticsEvent.count({ where: { brandId: brand.id, eventType: 'PAGE_VIEW', createdAt: { gte: monthAgo } } }),
      prisma.lead.count({ where: { brandId: brand.id, createdAt: { gte: weekAgo } } }),
      prisma.analyticsEvent.count({ where: { brandId: brand.id, eventType: 'ACTION_CALL', createdAt: { gte: weekAgo } } }),
      prisma.analyticsEvent.count({ where: { brandId: brand.id, eventType: 'ACTION_WHATSAPP', createdAt: { gte: weekAgo } } }),
      prisma.lead.count({ where: { brandId: brand.id } }),
    ]);

    return NextResponse.json({
      stats: {
        viewsThisWeek,
        viewsLastMonth,
        leadsThisWeek,
        callsThisWeek,
        whatsappThisWeek,
        totalLeads,
      },
    });
  } catch (error) {
    console.error('My analytics error:', error);
    return NextResponse.json({ stats: null }, { status: 500 });
  }
}
