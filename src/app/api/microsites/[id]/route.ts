import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { micrositeConfigSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/auth-utils';
import { AppError } from '@/lib/errors';

// GET /api/microsites/[id] - Get microsite configuration by branch ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params;

    const branch = await prisma.branch.findUnique({
      where: { id: branchId, isActive: true },
      include: {
        brand: true,
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Microsite not found' },
        { status: 404 }
      );
    }

    const micrositeData = {
      brand: {
        id: branch.brand.id,
        name: branch.brand.name,
        slug: branch.brand.slug,
        logo: branch.brand.logo,
        tagline: branch.brand.tagline,
        colorTheme: branch.brand.colorTheme,
        customDomain: branch.brand.customDomain,
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
    console.error('Error fetching microsite configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/microsites/[id] - Update microsite configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: branchId } = await params;
    const body = await request.json();

    // Validate microsite configuration
    const validatedConfig = micrositeConfigSchema.parse(body);

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

    // Update branch with new microsite configuration
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

    console.error('Error updating microsite configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/microsites/[id] - Reset microsite configuration to default
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: branchId } = await params;

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

    // Default microsite configuration
    const defaultConfig = {
      templateId: 'default',
      sections: {
        hero: {
          enabled: true,
          title: branch.name,
          subtitle: 'Welcome to our business',
          backgroundImage: undefined,
        },
        about: {
          enabled: true,
          content: 'Tell your customers about your business.',
        },
        services: {
          enabled: true,
          items: [],
        },
        gallery: {
          enabled: false,
          images: [],
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'email', 'phone', 'message'],
          },
        },
      },
      seoSettings: {
        title: branch.name,
        description: `Contact ${branch.name} for all your business needs.`,
        keywords: [branch.name, 'business', 'contact'],
        ogImage: undefined,
      },
    };

    // Reset branch microsite configuration to default
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        micrositeConfig: defaultConfig,
      },
    });

    return NextResponse.json({
      success: true,
      config: updatedBranch.micrositeConfig,
    });
  } catch (error) {
    console.error('Error resetting microsite configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}