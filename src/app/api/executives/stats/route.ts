import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { JWTService } from '@/lib/jwt';

const prisma = new PrismaClient();

/**
 * GET /api/executives/stats
 * Get statistics for all executives or a specific executive
 * Query params:
 * - executiveId (optional): Get stats for specific executive
 * - startDate (optional): Filter from date
 * - endDate (optional): Filter to date
 * - brandId (optional): Filter by brand
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = JWTService.verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN and BRAND_MANAGER can view executive stats
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'BRAND_MANAGER') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const executiveId = searchParams.get('executiveId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const brandId = searchParams.get('brandId') || payload.brandId;

    // Build where clause for filtering
    const whereClause: any = {
      onboardedBy: executiveId || { not: null },
    };

    if (startDate != null) {
      whereClause.onboardedAt = {
        ...whereClause.onboardedAt,
        gte: new Date(startDate),
      };
    }

    if (endDate != null) {
      whereClause.onboardedAt = {
        ...whereClause.onboardedAt,
        lte: new Date(endDate),
      };
    }

    if (brandId != null) {
      whereClause.brandId = brandId;
    }

    // If specific executive requested
    if (executiveId != null) {
      const executive = await prisma.user.findUnique({
        where: { id: executiveId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!executive) {
        return NextResponse.json(
          { error: 'Executive not found' },
          { status: 404 }
        );
      }

      if (executive.role !== 'EXECUTIVE') {
        return NextResponse.json(
          { error: 'User is not an executive' },
          { status: 400 }
        );
      }

      // Get onboarded branches count
      const totalOnboarded = await prisma.branch.count({
        where: whereClause,
      });

      // Get onboarded branches by month
      const branches = await prisma.branch.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          onboardedAt: true,
          isActive: true,
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          onboardedAt: 'desc',
        },
      });

      // Group by month
      const byMonth: Record<string, number> = {};
      branches.forEach((branch) => {
        if (branch.onboardedAt) {
          const monthKey = branch.onboardedAt.toISOString().substring(0, 7); // YYYY-MM
          byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
        }
      });

      // Get active vs inactive count
      const activeCount = branches.filter((b) => b.isActive).length;
      const inactiveCount = branches.filter((b) => !b.isActive).length;

      return NextResponse.json({
        success: true,
        data: {
          executive: {
            id: executive.id,
            name: `${executive.firstName} ${executive.lastName}`,
            email: executive.email,
            joinedAt: executive.createdAt,
          },
          stats: {
            totalOnboarded,
            activeCount,
            inactiveCount,
            byMonth,
          },
          recentBranches: branches.slice(0, 10).map((b) => ({
            id: b.id,
            name: b.name,
            brandName: b.brand.name,
            onboardedAt: b.onboardedAt,
            isActive: b.isActive,
          })),
        },
      });
    }

    // Get all executives with their stats
    const executives = await prisma.user.findMany({
      where: {
        role: 'EXECUTIVE',
        ...(brandId ? { brandId } : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        onboardedBranches: {
          where: {
            onboardedAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          },
          select: {
            id: true,
            name: true,
            onboardedAt: true,
            isActive: true,
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats for each executive
    const executiveStats = executives.map((exec) => {
      const totalOnboarded = exec.onboardedBranches.length;
      const activeCount = exec.onboardedBranches.filter((b) => b.isActive).length;
      const inactiveCount = exec.onboardedBranches.filter((b) => !b.isActive).length;

      // Get this month's count
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthCount = exec.onboardedBranches.filter(
        (b) => b.onboardedAt && b.onboardedAt >= thisMonthStart
      ).length;

      // Get last month's count
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      const lastMonthCount = exec.onboardedBranches.filter(
        (b) =>
          b.onboardedAt &&
          b.onboardedAt >= lastMonthStart &&
          b.onboardedAt <= lastMonthEnd
      ).length;

      return {
        id: exec.id,
        name: `${exec.firstName} ${exec.lastName}`,
        email: exec.email,
        phone: exec.phone,
        isActive: exec.isActive,
        joinedAt: exec.createdAt,
        stats: {
          totalOnboarded,
          activeCount,
          inactiveCount,
          thisMonthCount,
          lastMonthCount,
        },
      };
    });

    // Sort by total onboarded (descending)
    executiveStats.sort((a, b) => b.stats.totalOnboarded - a.stats.totalOnboarded);

    // Calculate overall stats
    const overallStats = {
      totalExecutives: executives.length,
      activeExecutives: executives.filter((e) => e.isActive).length,
      totalBranchesOnboarded: executiveStats.reduce(
        (sum, e) => sum + e.stats.totalOnboarded,
        0
      ),
      thisMonthTotal: executiveStats.reduce(
        (sum, e) => sum + e.stats.thisMonthCount,
        0
      ),
      lastMonthTotal: executiveStats.reduce(
        (sum, e) => sum + e.stats.lastMonthCount,
        0
      ),
    };

    return NextResponse.json({
      success: true,
      data: {
        overallStats,
        executives: executiveStats,
      },
    });
  } catch (error) {
    console.error('Error fetching executive stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
