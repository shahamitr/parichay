import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { industryCategories } from '@/data/categories';

/**
 * GET - Fetch all categories (public)
 * Returns database categories or falls back to static data
 */
export async function GET() {
  try {
    // Try database first
    const dbCategories = await prisma.industryCategory.findMany({
      where: { enabled: true },
      orderBy: { name: 'asc' },
    });

    // If we have database categories, return them
    if (dbCategories.length > 0) {
      return NextResponse.json({
        success: true,
        data: dbCategories,
        source: 'database',
      });
    }

    // Fall back to static data (for initial setup or development)
    return NextResponse.json({
      success: true,
      data: industryCategories.filter(c => c.enabled),
      source: 'static',
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    // In case of database error, return static data
    return NextResponse.json({
      success: true,
      data: industryCategories.filter(c => c.enabled),
      source: 'static-fallback',
    });
  }
}

/**
 * POST - Create a new category (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Super Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, icon, enabled, features, benefits, useCases, colorScheme } = body;

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingCategory = await prisma.industryCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    const category = await prisma.industryCategory.create({
      data: {
        name,
        slug,
        description: description || '',
        icon: icon || 'briefcase',
        enabled: enabled !== undefined ? enabled : true,
        features: features || [],
        benefits: benefits || [],
        useCases: useCases || [],
        colorScheme: colorScheme || { primary: '#000000', secondary: '#333333', accent: '#666666' },
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
