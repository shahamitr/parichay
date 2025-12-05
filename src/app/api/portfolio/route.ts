/**
 * Portfolio API
 * GET /api/portfolio - Get portfolio items for a branch
 * POST /api/portfolio - Create a new portfolio item (authenticated)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const createPortfolioSchema = z.object({
  branchId: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  category: z.string(),
  images: z.array(z.string().url()),
  videoUrl: z.string().url().optional(),
  clientName: z.string().optional(),
  projectDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  link: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!branchId && !brandId) {
      return NextResponse.json(
        { error: 'branchId or brandId is required' },
        { status: 400 }
      );
    }

    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (brandId) where.brandId = brandId;
    if (category) where.category = category;
    // if (featured === 'true') where.featured = true; // TODO: Add featured field to PortfolioItem model

    const [items, categories] = await Promise.all([
      prisma.portfolioItem.findMany({
        where,
        orderBy: [
          // { featured: 'desc' }, // TODO: Add featured field
          { order: 'asc' }, // Use order field instead
          { createdAt: 'desc' },
        ],
        take: limit,
        include: {
          branch: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ]);

    // Get categories - fetch and aggregate in JavaScript
    const allItems = await prisma.portfolioItem.findMany({
      where: branchId ? { branchId } : brandId ? { brandId } : {},
      select: { category: true },
    });

    const categoryMap = new Map<string, number>();
    allItems.forEach(item => {
      if (item.category) {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      }
    });

    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({
      items,
      categories,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPortfolioSchema.parse(body);

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== branch.brandId &&
      !(user.branches || []).some((b) => b.id === validatedData.branchId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { projectDate, ...portfolioData } = validatedData as any;
    const item = await prisma.portfolioItem.create({
      data: {
        ...portfolioData,
        brandId: branch.brandId,
        completedAt: projectDate ? new Date(projectDate) : null, // Use completedAt instead of projectDate
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error creating portfolio item:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid portfolio data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}
