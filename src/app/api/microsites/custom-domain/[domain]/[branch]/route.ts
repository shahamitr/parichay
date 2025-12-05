import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; branch: string } }
) {
  try {
    const { domain, branch: branchSlug } = params;

    // Find brand by custom domain
    const brand = await prisma.brand.findFirst({
      where: {
        customDomain: domain,
      },
      include: {
        branches: {
          where: {
            slug: branchSlug,
            isActive: true,
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found for this domain' },
        { status: 404 }
      );
    }

    if (brand.branches.length === 0) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    const branch = brand.branches[0];

    // Return microsite data
    return NextResponse.json({
      success: true,
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        tagline: brand.tagline,
        colorTheme: brand.colorTheme,
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
      customDomain: domain,
    });
  } catch (error) {
    console.error('Custom domain microsite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
