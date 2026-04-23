import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { industryCategories } from '@/data/categories';

/**
 * GET - Fetch all categories from database (admin only)
 * Falls back to static data if database is empty
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is super admin
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Super Admin access required' },
        { status: 403 }
      );
    }

    // Fetch from database
    const dbCategories = await prisma.industryCategory.findMany({
      orderBy: { name: 'asc' },
    });

    // If database has categories, return them
    if (dbCategories.length > 0) {
      return NextResponse.json({
        success: true,
        categories: dbCategories,
        source: 'database',
      });
    }

    // Otherwise return static data (for development/initial setup)
    return NextResponse.json({
      success: true,
      categories: industryCategories,
      source: 'static',
      message: 'Database categories not found. Run seed to populate.',
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST - Seed categories from static data to database (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Super Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Seed action - populate database from static data
    if (action === 'seed') {
      const existingCount = await prisma.industryCategory.count();

      if (existingCount > 0) {
        return NextResponse.json({
          success: false,
          error: 'Categories already exist in database. Use action=reseed to replace.',
          existingCount,
        }, { status: 400 });
      }

      // Insert all categories from static data
      const created = await prisma.industryCategory.createMany({
        data: industryCategories.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          enabled: cat.enabled,
          features: cat.features,
          benefits: cat.benefits,
          useCases: cat.useCases,
          colorScheme: cat.colorScheme,
        })),
      });

      return NextResponse.json({
        success: true,
        message: `Seeded ${created.count} categories to database`,
        count: created.count,
      });
    }

    // Reseed action - clear and repopulate
    if (action === 'reseed') {
      // Delete existing categories
      await prisma.industryCategory.deleteMany({});

      // Insert fresh data
      const created = await prisma.industryCategory.createMany({
        data: industryCategories.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          enabled: cat.enabled,
          features: cat.features,
          benefits: cat.benefits,
          useCases: cat.useCases,
          colorScheme: cat.colorScheme,
        })),
      });

      return NextResponse.json({
        success: true,
        message: `Reseeded ${created.count} categories to database`,
        count: created.count,
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use action=seed or action=reseed',
    }, { status: 400 });
  } catch (error) {
    console.error('Error in categories action:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
