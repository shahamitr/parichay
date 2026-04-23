import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  generateBusinessCardPDF,
  generateBusinessCardSVG,
  generateBusinessCardFilename,
  BusinessCardData,
} from '@/lib/business-card-generator';
import { generateVCard, generateVCardFilename, VCardData } from '@/lib/vcard-generator';

/**
 * GET /api/branches/[id]/business-card
 * Generate business card in various formats (vcard, pdf, svg, image)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'vcard';

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
            colorTheme: true,
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

    // Prepare data for card generation
    const cardData: BusinessCardData = {
      branch: {
        id: branch.id,
        name: branch.name,
        contact: branch.contact as any,
        address: branch.address as any,
        socialMedia: branch.socialMedia as any,
      },
      brand: {
        name: branch.brand.name,
        logo: branch.brand.logo,
        tagline: branch.brand.tagline,
        colorTheme: branch.brand.colorTheme as any,
      },
      micrositeUrl,
    };

    // Track download event
    const trackDownload = async (downloadFormat: string) => {
      try {
        await prisma.analyticsEvent.create({
          data: {
            branchId: branch.id,
            brandId: branch.brandId,
            eventType: 'BUSINESS_CARD_DOWNLOAD',
            metadata: {
              format: downloadFormat,
              branchName: branch.name,
              brandName: branch.brand.name,
              userAgent: request.headers.get('user-agent') || 'unknown',
            },
          },
        });
      } catch (analyticsError) {
        console.error('Error tracking business card download:', analyticsError);
      }
    };

    // Generate based on format
    switch (format) {
      case 'pdf': {
        await trackDownload('pdf');
        const pdfBuffer = await generateBusinessCardPDF(cardData);
        const filename = generateBusinessCardFilename(branch.name, 'pdf');

        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      case 'svg': {
        await trackDownload('svg');
        const svgContent = await generateBusinessCardSVG(cardData);
        const filename = generateBusinessCardFilename(branch.name, 'svg');

        return new NextResponse(svgContent, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      case 'image': {
        // Return SVG data that can be converted to PNG client-side
        await trackDownload('image');
        const svgContent = await generateBusinessCardSVG(cardData);

        return NextResponse.json({
          success: true,
          svg: svgContent,
          filename: generateBusinessCardFilename(branch.name, 'png'),
          width: 1200,
          height: 630,
        });
      }

      case 'vcard':
      default: {
        await trackDownload('vcard');

        // Prepare vCard data
        const vCardData: VCardData = {
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

        const vCardContent = generateVCard(vCardData);
        const filename = generateVCardFilename(branch.name);

        return new NextResponse(vCardContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating business card:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
