/**
 * QR Code Download API
 * GET /api/qrcodes/[id]/download - Download QR code in specified format
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { generateQRCode, generateQRCodeBuffer } from '@/lib/qrcode-generator';
import PDFDocument from 'pdfkit';

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
        (qrCode.branchId && user.branches?.some((b) => b.id === qrCode.branchId));

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

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${sanitizedName}_qrcode.png"`,
        },
      });
    } else if (format === 'pdf') {
      // Generate PDF with QR code
      const pdfBuffer = await generateQRCodePDF(qrCode, brandColors);

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${sanitizedName}_qrcode.pdf"`,
        },
      });
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

/**
 * Generate a PDF containing the QR code with branding
 */
async function generateQRCodePDF(
  qrCode: any,
  brandColors?: { primary: string; secondary: string }
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate QR code as PNG buffer
      const qrBuffer = await generateQRCodeBuffer(qrCode.url, {
        brandColors,
        size: 400,
      });

      // Create PDF document (A4 size)
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Get brand info
      const brand = qrCode.branch?.brand || qrCode.brand;
      const brandName = brand?.name || 'Parichay';
      const branchName = qrCode.branch?.name || '';
      const primaryColor = brandColors?.primary || '#3B82F6';

      // Header
      doc.fontSize(24)
        .fillColor(primaryColor)
        .text(brandName, { align: 'center' });

      if (branchName) {
        doc.fontSize(14)
          .fillColor('#666666')
          .text(branchName, { align: 'center' });
      }

      doc.moveDown(2);

      // QR Code title
      doc.fontSize(16)
        .fillColor('#333333')
        .text('Scan to Connect', { align: 'center' });

      doc.moveDown(1);

      // Add QR code image centered
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const qrSize = 300;
      const xPosition = (pageWidth - qrSize) / 2 + doc.page.margins.left;

      doc.image(qrBuffer, xPosition, doc.y, {
        width: qrSize,
        height: qrSize,
      });

      doc.moveDown(1);
      doc.y += qrSize + 20;

      // URL below QR code
      doc.fontSize(10)
        .fillColor('#666666')
        .text(qrCode.url, { align: 'center' });

      doc.moveDown(2);

      // Instructions
      doc.fontSize(12)
        .fillColor('#333333')
        .text('How to use:', { align: 'center' });

      doc.moveDown(0.5);

      doc.fontSize(10)
        .fillColor('#666666')
        .text('1. Open your phone camera or QR scanner', { align: 'center' })
        .text('2. Point at the QR code above', { align: 'center' })
        .text('3. Tap the notification to visit', { align: 'center' });

      doc.moveDown(2);

      // Footer
      doc.fontSize(8)
        .fillColor('#999999')
        .text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' })
        .text('Powered by Parichay', { align: 'center' });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
