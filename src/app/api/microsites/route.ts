import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { micrositeConfigSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/auth-utils';
import { AppError } from '@/lib/errors';

// GET /api/microsites - Get microsite by brand and branch slugs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandSlug = searchParams.get('brand');
    const branchSlug = searchParams.get('branch');

    if (!brandSlug || !branchSlug) {
      return NextResponse.json(
        { error: 'Brand and branch slugs are required' },
        { status: 400 }
      );
    }

    // Find the brand by slug
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
      include: {
        branches: {
          where: { slug: branchSlug, isActive: true },
        },
      },
    });

    if (!brand || brand.branches.length === 0) {
      return NextResponse.json(
        { error: 'Microsite not found' },
        { status: 404 }
      );
    }

    const branch = brand.branches[0];

    // Return microsite data
    const micrositeData = {
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        tagline: brand.tagline,
        colorTheme: brand.colorTheme,
        customDomain: brand.customDomain,
      },
      branch: {
        id: branch.id,
        name: branch.name,
        slug: branch.slug,
        address: branch.address,
        contact: branch.contact,
        socialMedia: branch.socialMedia,
        businessHours: branch.businessHours,
        micrositeConfig: branch.micrositeConfig,
      },
    };

    return NextResponse.json({
      success: true,
      data: micrositeData,
    });
  } catch (error) {
    console.error('Error fetching microsite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/microsites - Create new microsite configuration
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { branchId, config } = body;

    if (!branchId) {
      return NextResponse.json(
        { error: 'Branch ID is required' },
        { status: 400 }
      );
    }

    // Validate microsite configuration
    const validatedConfig = micrositeConfigSchema.parse(config);

    // Check if user has access to this branch
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        OR: [
          { brand: { ownerId: user.id } },
          { admins: { some: { id: user.id } } },
        ],
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found or access denied' },
        { status: 404 }
      );
    }

    // Update branch with microsite configuration
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        micrositeConfig: validatedConfig,
      },
    });

    return NextResponse.json({
      success: true,
      config: updatedBranch.micrositeConfig,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('Error creating microsite configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}