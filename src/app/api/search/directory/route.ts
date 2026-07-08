/**
 * Public Business Directory API
 * GET /api/search/directory — Public listing of all active businesses
 *
 * Used for the public directory page and SEO crawling.
 * No authentication required.
 * Supports: pagination, category filter, city filter, "open now" filter.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '24'));
    const city = searchParams.get('city') || '';
    const category = searchParams.get('category') || '';
    const openNow = searchParams.get('openNow') === 'true';
    const sortBy = searchParams.get('sort') || 'rating'; // rating, newest, name
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
      visibility: 'public',
      brand: { slug: { not: { startsWith: 'demo-' } } }, // Exclude demo brands from directory
    };

    // City filter (search in address JSON)
    if (city) {
      where.address = { path: '$.city', string_contains: city };
    }

    // Category filter
    if (category) {
      where.OR = [
        { businessType: category },
        { serviceCategories: { path: '$', array_contains: category } },
      ];
    }

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'name') orderBy = { name: 'asc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          address: true,
          contact: true,
          businessHours: true,
          businessType: true,
          serviceCategories: true,
          isVerified: true,
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              tagline: true,
            },
          },
          _count: { select: { reviews: true } },
          reviews: {
            where: { isPublished: true },
            select: { rating: true },
            take: 100,
          },
        },
      }),
      prisma.branch.count({ where }),
    ]);

    // Format results with computed fields
    const results = branches.map((branch) => {
      const avgRating = branch.reviews.length > 0
        ? Math.round((branch.reviews.reduce((s, r) => s + r.rating, 0) / branch.reviews.length) * 10) / 10
        : 0;

      const address = branch.address as any;
      const businessHours = branch.businessHours as any;

      // Check if currently open
      let isOpen = false;
      if (businessHours) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const now = new Date();
        const today = days[now.getDay()];
        const todayHours = businessHours[today];
        if (todayHours && !todayHours.closed && todayHours.open && todayHours.close) {
          const [openH, openM] = todayHours.open.split(':').map(Number);
          const [closeH, closeM] = todayHours.close.split(':').map(Number);
          if (!isNaN(openH) && !isNaN(closeH)) {
            const currentMin = now.getHours() * 60 + now.getMinutes();
            isOpen = currentMin >= (openH * 60 + (openM || 0)) && currentMin <= (closeH * 60 + (closeM || 0));
          }
        }
      }

      return {
        id: branch.id,
        name: branch.brand.name,
        branchName: branch.name,
        slug: branch.brand.slug,
        branchSlug: branch.slug,
        logo: branch.brand.logo,
        tagline: branch.brand.tagline,
        city: address?.city || '',
        state: address?.state || '',
        businessType: branch.businessType,
        categories: branch.serviceCategories || [],
        isVerified: branch.isVerified,
        isOpen,
        rating: avgRating,
        reviewCount: branch._count.reviews,
        url: `/${branch.brand.slug}/${branch.slug}`,
      };
    });

    // Filter by "open now" if requested (post-query filter)
    const filtered = openNow ? results.filter((r) => r.isOpen) : results;

    // Sort by rating for 'rating' sort (post-query for aggregated field)
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return NextResponse.json({
      success: true,
      results: filtered,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Directory API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load directory', results: [], pagination: { page: 1, limit: 24, total: 0, totalPages: 0, hasMore: false } },
      { status: 500 }
    );
  }
}
