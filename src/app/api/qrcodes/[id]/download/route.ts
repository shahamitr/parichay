/**
 * QR Code Download API
 * GET /api/qrcodes/[id]/download - Download QR code in specified format
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { generateQRCode, generateQRCodeBuffer } from '@/lib/qrcode-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'png';

    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
      include: {
        branch: {
          include: {
            brand: true,
          },
        },
        brand: true,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Check authorization
    if (user.role !== 'SUPER_ADMIN') {
      const hasAccess =
        (qrCode.brandId && user.brandId === qrCode.brandId) ||
        (qrCode.branchId && user.branches.some((b) => b.id === qrCode.branchId));

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Get brand colors
    const brand = qrCode.branch?.brand || qrCode.brand;
    const brandColors = brand
      ? {
          primary: (brand.colorTheme as any).primary,
          secondary: (brand.colorTheme as any).secondary,
        }
      : undefined;

    // Generate filename
    const entityName = qrCode.branch?.name || qrCode.brand?.name || 'qrcode';
    const sanitizedName = entityName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if (format === 'svg') {
      // Generate SVG
      const result = await generateQRCode({
        url: qrCode.url,
        format: 'svg',
        brandColors,
        size: 512,
      });

      return new NextResponse(result.data, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="${sanitizedName}_qrcode.svg"`,
        },
      });
    } else if (format === 'png') {
      // Generate PNG buffer
      const buffer = await generateQRCodeBuffer(qrCode.url, {
        brandColors,
        size: 1024, // Higher resolution for download
      });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${sanitizedName}_qrcode.png"`,
        },
      });
    } else if (format === 'pdf') {
      // For PDF, we'll use the existing data URL
      // In a real implementation, you'd generate a proper PDF with PDFKit
      return NextResponse.json(
        { error: 'PDF format not yet implemented' },
        { status: 501 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Supported: png, svg, pdf' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('QR code download error:', error);
    return NextResponse.json(
      { error: 'Failed to download QR code' },
      { status: 500 }
    );
  }
}
