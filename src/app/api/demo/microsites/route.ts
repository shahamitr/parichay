import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { industryCategories } from '@/data/categories';
import { getCategoryFromDemoSlug } from '@/lib/demo-utils';

interface DemoMicrositeListItem {
  brandId: string;
  brandName: string;
  brandSlug: string;
  branchSlug: string;
  industryCategory: string;
  colorTheme: { primary: string; secondary: string; accent: string };
  demoUrl: string;
}

/**
 * GET /api/demo/microsites
 *
 * Returns the list of demo microsites (brands whose slug starts with `demo-`).
 * Supports an optional `?category={slug}` query param to filter by industry.
 * Invalid category values return an empty array (not an error).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get('category');

    // If a category filter is provided, validate it against known categories.
    // Unknown categories simply yield an empty result set.
    if (categoryFilter) {
      const known = industryCategories.some((c) => c.slug === categoryFilter);
      if (!known) {
        return NextResponse.json({ success: true, data: [] as DemoMicrositeListItem[] });
      }
    }

    // Build the slug filter — either a specific demo brand or all demo- brands.
    const slugFilter = categoryFilter
      ? `demo-${categoryFilter}`
      : undefined;

    const demoBrands = await prisma.brand.findMany({
      where: {
        slug: slugFilter ? slugFilter : { startsWith: 'demo-' },
      },
      include: {
        branches: {
          where: { isActive: true },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });

    const data: DemoMicrositeListItem[] = demoBrands
      .filter((brand) => brand.branches.length > 0)
      .map((brand) => {
        const branch = brand.branches[0];
        const categorySlug = getCategoryFromDemoSlug(brand.slug) ?? '';
        const colorTheme = brand.colorTheme as {
          primary: string;
          secondary: string;
          accent: string;
        };

        return {
          brandId: brand.id,
          brandName: brand.name,
          brandSlug: brand.slug,
          branchSlug: branch.slug,
          industryCategory: categorySlug,
          colorTheme,
          demoUrl: `/${brand.slug}/${branch.slug}`,
        };
      });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching demo microsites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch demo microsites' },
      { status: 500 },
    );
  }
}
