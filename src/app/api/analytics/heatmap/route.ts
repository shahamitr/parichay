import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

/**
 * POST /api/analytics/heatmap
 * Record heatmap click and scroll data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branchId, brandId, clicks, scrollDepth, scrollEvents, pageUrl, screenWidth, screenHeight } = body;

    if (!branchId) {
      return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });
    }

    // Store click events
    if (clicks && clicks.length > 0) {
      await prisma.analyticsEvent.create({
        data: {
          branchId,
          brandId,
          eventType: 'HEATMAP_CLICKS' as any,
          metadata: {
            clicks: clicks.map((c: any) => ({
              x: c.x,
              y: c.y,
              element: c.element,
              section: c.section,
            })),
            pageUrl,
            screenWidth,
            screenHeight,
          },
        },
      });
    }

    // Store scroll depth
    if (scrollDepth > 0 || (scrollEvents && scrollEvents.length > 0)) {
      await prisma.analyticsEvent.create({
        data: {
          branchId,
          brandId,
          eventType: 'SCROLL_DEPTH' as any,
          metadata: {
            maxDepth: scrollDepth,
            events: scrollEvents,
            pageUrl,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording heatmap data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/analytics/heatmap
 * Get aggregated heatmap data for a branch
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const period = searchParams.get('period') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Fetch click events
    const clickEvents = await prisma.analyticsEvent.findMany({
      where: {
        branchId: branchId || undefined,
        brandId: brandId || undefined,
        eventType: 'HEATMAP_CLICKS' as any,
        createdAt: { gte: startDate },
      },
      select: {
        metadata: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit to last 1000 events
    });

    // Fetch scroll depth events
    const scrollEvents = await prisma.analyticsEvent.findMany({
      where: {
        branchId: branchId || undefined,
        brandId: brandId || undefined,
        eventType: 'SCROLL_DEPTH' as any,
        createdAt: { gte: startDate },
      },
      select: {
        metadata: true,
      },
    });

    // Aggregate click data into grid
    const gridSize = 50; // 50x50 grid
    const clickGrid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    const elementClicks: Record<string, number> = {};
    const sectionClicks: Record<string, number> = {};
    let totalClicks = 0;

    clickEvents.forEach((event) => {
      const metadata = event.metadata as any;
      if (metadata?.clicks) {
        metadata.clicks.forEach((click: any) => {
          // Map percentage to grid cell
          const gridX = Math.min(Math.floor((click.x / 100) * gridSize), gridSize - 1);
          const gridY = Math.min(Math.floor((click.y / 100) * gridSize), gridSize - 1);

          if (gridX >= 0 && gridY >= 0) {
            clickGrid[gridY][gridX]++;
            totalClicks++;
          }

          // Track element clicks
          if (click.element) {
            elementClicks[click.element] = (elementClicks[click.element] || 0) + 1;
          }

          // Track section clicks
          if (click.section) {
            sectionClicks[click.section] = (sectionClicks[click.section] || 0) + 1;
          }
        });
      }
    });

    // Normalize grid to 0-1 range
    const maxClicks = Math.max(...clickGrid.flat());
    const normalizedGrid = clickGrid.map(row =>
      row.map(count => maxClicks > 0 ? count / maxClicks : 0)
    );

    // Aggregate scroll depth data
    const scrollDepthCounts: Record<number, number> = { 0: 0, 25: 0, 50: 0, 75: 0, 100: 0 };
    let totalScrollSessions = 0;

    scrollEvents.forEach((event) => {
      const metadata = event.metadata as any;
      if (metadata?.maxDepth !== undefined) {
        totalScrollSessions++;
        // Increment all milestones up to and including max depth
        const milestones = [0, 25, 50, 75, 100];
        milestones.forEach(m => {
          if (metadata.maxDepth >= m) {
            scrollDepthCounts[m]++;
          }
        });
      }
    });

    // Calculate scroll depth percentages
    const scrollDepthData = Object.entries(scrollDepthCounts).map(([depth, count]) => ({
      depth: parseInt(depth),
      count,
      percentage: totalScrollSessions > 0 ? Math.round((count / totalScrollSessions) * 100) : 0,
    }));

    // Get top clicked elements
    const topElements = Object.entries(elementClicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([element, count]) => ({ element, count }));

    // Get section engagement
    const sectionEngagement = Object.entries(sectionClicks)
      .sort((a, b) => b[1] - a[1])
      .map(([section, count]) => ({
        section,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }));

    return NextResponse.json({
      success: true,
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      heatmapData: {
        gridSize,
        grid: normalizedGrid,
        totalClicks,
      },
      scrollDepthData,
      topElements,
      sectionEngagement,
      summary: {
        totalClicks,
        totalScrollSessions,
        avgScrollDepth: totalScrollSessions > 0
          ? Math.round(scrollEvents.reduce((sum, e) => sum + ((e.metadata as any)?.maxDepth || 0), 0) / totalScrollSessions)
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
