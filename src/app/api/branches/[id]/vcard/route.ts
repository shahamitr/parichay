import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVCard, generateVCardFilename } from '@/lib/vcard-generator';

/**
 * GET /api/branches/[id]/vcard
 * Generate and serve vCard for a branch
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch branch data with brand information
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            tagline: true,
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check if branch is active
    if (!branch.isActive) {
      return NextResponse.json(
        { error: 'Branch is not active' },
        { status: 403 }
      );
    }

    // Construct microsite URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const micrositeUrl = `${protocol}://${host}/${branch.brand.slug}/${branch.slug}`;

    // Prepare vCard data
    const vCardData = {
      branch: {
        name: branch.name,
        contact: branch.contact as any,
        address: branch.address as any,
        socialMedia: branch.socialMedia as any,
        businessHours: branch.businessHours as any,
      },
      brand: {
        name: branch.brand.name,
        logo: branch.brand.logo,
        tagline: branch.brand.tagline,
      },
      micrositeUrl,
    };

    // Generate vCard
    const vCardContent = generateVCard(vCardData);
    const filename = generateVCardFilename(branch.name);

    // Track vCard download in analytics
    try {
      await prisma.analyticsEvent.create({
        data: {
          branchId: branch.id,
          brandId: branch.brandId,
          eventType: 'VCARD_DOWNLOAD',
          metadata: {
            branchName: branch.name,
            brandName: branch.brand.name,
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        },
      });
    } catch (analyticsError) {
      // Log error but don't fail the request
      console.error('Error tracking vCard download:', analyticsError);
    }

    // Return vCard with proper headers
    return new NextResponse(vCardContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
