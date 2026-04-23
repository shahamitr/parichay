/**
 * Help Articles API
 * GET /api/help/articles - List articles
 * POST /api/help/articles - Create article (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// List articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    // For public requests, only show published articles
    const user = await getAuthenticatedUser(request);
    const isAdmin = user && ['SUPER_ADMIN', 'BRAND_MANAGER', 'ADMIN'].includes(user.role);

    if (!isAdmin) {
      where.isPublished = true;
    } else if (published !== null) {
      where.isPublished = published === 'true';
    }

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.helpArticle.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true },
          },
        },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        take: limit,
        skip: offset,
      }),
      prisma.helpArticle.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      articles,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error('Error fetching help articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create article (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || !['SUPER_ADMIN', 'BRAND_MANAGER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, type, categoryId, tags, videoUrl, videoDuration, isPublished, isFeatured, displayOrder } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for duplicate slug
    const existing = await prisma.helpArticle.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'An article with this title already exists' }, { status: 409 });
    }

    const article = await prisma.helpArticle.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        type: type || 'GUIDE',
        categoryId: categoryId || null,
        tags: tags || null,
        videoUrl: videoUrl || null,
        videoDuration: videoDuration || null,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        displayOrder: displayOrder || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error('Error creating help article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
