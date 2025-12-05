import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { brandCreateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

// GET /api/brands - List all brands (Super Admin) or user's brand
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let brands: any;
    if (user.role === 'SUPER_ADMIN') {
      brands = await prisma.brand.findMany({
        include: {
          _count: {
            select: { branches: true },
          },
          branches: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
            take: 1,
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
          },
          subscription: {
            select: {
              status: true,
              endDate: true,
              plan: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.brandId) {
      brands = await prisma.brand.findMany({
        where: { id: user.brandId },
        include: {
          _count: {
            select: { branches: true },
          },
          branches: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
            take: 1,
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
          },
          subscription: {
            select: {
              status: true,
              endDate: true,
              plan: {
                select: { name: true },
              },
            },
          },
        },
      });
    } else {
      brands = [];
    }

    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/brands - Create new brand
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'BRAND_MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = brandCreateSchema.parse(body);

    // Generate slug from name
    const baseSlug = generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    while (await prisma.brand.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Ensure customDomain is undefined (not empty string) to avoid unique constraint issues
    const customDomain = validatedData.customDomain && validatedData.customDomain.trim() !== ''
      ? validatedData.customDomain.trim()
      : undefined;

    const result = await prisma.$transaction(async (tx) => {
      const brand = await tx.brand.create({
        data: {
          ...validatedData,
          slug,
          ownerId: user.id,
          customDomain, // Override with cleaned value
          colorTheme: validatedData.colorTheme || {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#F59E0B',
          },
          // Remove initialBranch from brand creation data as it's not a field on Brand
          initialBranch: undefined,
        } as any, // Type assertion needed because we're stripping initialBranch
        include: {
          _count: {
            select: { branches: true },
          },
        },
      });

      // Create initial branch if provided
      if (validatedData.initialBranch) {
        const branchSlug = generateSlug(validatedData.initialBranch.name);

        const branch = await tx.branch.create({
          data: {
            name: validatedData.initialBranch.name,
            slug: branchSlug,
            brandId: brand.id,
            address: validatedData.initialBranch.address,
            contact: {
              phone: validatedData.initialBranch.phone,
              email: validatedData.initialBranch.email,
            },
            isActive: true,
            micrositeConfig: {
              templateId: 'modern-business',
              sections: {
                hero: { enabled: true, title: brand.name, subtitle: validatedData.tagline || '' },
                about: { enabled: true, content: `Welcome to ${brand.name}` },
                services: { enabled: true, items: [] },
                contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'phone'] } }
              },
              seoSettings: {
                title: brand.name,
                description: validatedData.tagline || '',
                keywords: []
              }
            }
          }
        });
      }

      // Update user's brandId if they don't have one
      if (!user.brandId) {
        await tx.user.update({
          where: { id: user.id },
          data: { brandId: brand.id },
        });
      }

      return brand;
    });

    return NextResponse.json({ brand: result }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating brand:', error);

    // Handle Zod validation errors
    if (error.errors) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
