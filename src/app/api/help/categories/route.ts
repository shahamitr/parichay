/**
 * Help Categories API
 * GET /api/help/categories - List categories
 * POST /api/help/categories - Create category (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// List categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeArticles = searchParams.get('includeArticles') === 'true';
    const published = searchParams.get('published');

    const user = await getAuthenticatedUser(request);
    const isAdmin = user && ['SUPER_ADMIN', 'BRAND_MANAGER', 'ADMIN'].includes(user.role);

    const where: any = {};
    if (!isAdmin) {
      where.isPublished = true;
    } else if (published !== null) {
      where.isPublished = published === 'true';
    }

    const categories = await prisma.helpCategory.findMany({
      where,
      include: includeArticles
        ? {
            articles: {
              where: isAdmin ? {} : { isPublished: true },
              orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
            },
            _count: {
              select: { articles: true },
            },
          }
        : {
            _count: {
              select: { articles: true },
            },
          },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching help categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create category (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || !['SUPER_ADMIN', 'BRAND_MANAGER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon, displayOrder, isPublished } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.helpCategory.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const category = await prisma.helpCategory.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        displayOrder: displayOrder || 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Error creating help category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
