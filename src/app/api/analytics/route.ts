import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || '30d';
        const branchId = searchParams.get('branchId');

        // Determine date range
        const now = new Date();
        let startDate = subDays(now, 30); // Default 30 days

        if (period === '7d') {
            startDate = subDays(now, 7);
        } else if (period === '90d') {
            startDate = subDays(now, 90);
        }

        // Build where clause based on user role and filters
        let whereClause: any = {
            createdAt: {
                gte: startDate,
            },
        };

        if (user.role === 'SUPER_ADMIN') {
            // Super admin sees all, unless filtered by branch
            if (branchId) whereClause.branchId = branchId;
        } else if (user.role === 'BRAND_MANAGER') {
            whereClause.brandId = user.brandId;
            if (branchId) whereClause.branchId = branchId;
        } else if (user.role === 'BRANCH_ADMIN' || user.role === 'EXECUTIVE') {
            // Can only see their own branches
            // For simplicity, if they select a branch they have access to, filter by it.
            // Otherwise, filter by all their branches.
            // This logic might need refinement based on exact requirements, but let's start simple.
            if (branchId) {
                // Verify access to this branch
                const hasAccess = user.branches?.some(b => b.id === branchId);
                if (!hasAccess) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
                whereClause.branchId = branchId;
            } else {
                // Filter by all accessible branches
                const branchIds = user.branches?.map(b => b.id) || [];
                whereClause.branchId = { in: branchIds };
            }
        }

        // 1. Fetch Total Stats
        const [totalViews, totalLeads, totalQrScans, totalClicks] = await Promise.all([
            prisma.analyticsEvent.count({
                where: { ...whereClause, eventType: 'PAGE_VIEW' },
            }),
            prisma.lead.count({
                where: {
                    createdAt: { gte: startDate },
                    branch: user.role === 'SUPER_ADMIN' ? undefined :
                        user.role === 'BRAND_MANAGER' ? { brandId: user.brandId } :
                            { id: { in: user.branches?.map(b => b.id) || [] } }
                }
            }),
            prisma.analyticsEvent.count({
                where: { ...whereClause, eventType: 'QR_SCAN' },
            }),
            prisma.analyticsEvent.count({
                where: { ...whereClause, eventType: 'CLICK' },
            }),
        ]);

        // 2. Fetch Views Over Time (Grouped by Day)
        // Prisma doesn't support date truncation directly in groupBy easily across DBs without raw query.
        // We'll fetch all events and aggregate in JS for simplicity/portability, or use raw query if performance needed.
        // For now, let's fetch strictly necessary fields to aggregate.
        const viewsOverTimeData = await prisma.analyticsEvent.findMany({
            where: { ...whereClause, eventType: 'PAGE_VIEW' },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });

        const viewsMap = new Map<string, number>();
        // Initialize all days with 0
        let currentDate = startDate;
        while (currentDate <= now) {
            viewsMap.set(format(currentDate, 'yyyy-MM-dd'), 0);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        viewsOverTimeData.forEach(event => {
            const dateKey = format(event.createdAt, 'yyyy-MM-dd');
            if (viewsMap.has(dateKey)) {
                viewsMap.set(dateKey, (viewsMap.get(dateKey) || 0) + 1);
            }
        });

        const chartData = {
            labels: Array.from(viewsMap.keys()),
            data: Array.from(viewsMap.values()),
        };

        // 3. Top Performing Branches
        // Fetch all page views and aggregate in JavaScript to avoid groupBy issues with nullable fields
        const branchViewsData = await prisma.analyticsEvent.findMany({
            where: {
                ...whereClause,
                eventType: 'PAGE_VIEW',
                branchId: { not: null } // Only include events with branchId
            },
            select: { branchId: true },
        });

        // Count views per branch
        const branchViewsMap = new Map<string, number>();
        branchViewsData.forEach(event => {
            if (event.branchId) {
                branchViewsMap.set(event.branchId, (branchViewsMap.get(event.branchId) || 0) + 1);
            }
        });

        // Sort and get top 5
        const sortedBranches = Array.from(branchViewsMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Fetch branch names
        const topBranches = await Promise.all(
            sortedBranches.map(async ([branchId, views]) => {
                const branch = await prisma.branch.findUnique({
                    where: { id: branchId },
                    select: { name: true },
                });
                return {
                    name: branch?.name || 'Unknown',
                    views,
                };
            })
        );

        // 4. Recent Leads
        const recentLeads = await prisma.lead.findMany({
            where: {
                createdAt: { gte: startDate },
                branch: user.role === 'SUPER_ADMIN' ? undefined :
                    user.role === 'BRAND_MANAGER' ? { brandId: user.brandId } :
                        { id: { in: user.branches?.map(b => b.id) || [] } }
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                branch: {
                    select: { name: true },
                },
            },
        });

        return NextResponse.json({
            stats: {
                views: totalViews,
                leads: totalLeads,
                qrScans: totalQrScans,
                clicks: totalClicks,
            },
            chartData,
            topBranches,
            recentLeads,
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
