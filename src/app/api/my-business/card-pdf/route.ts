/**
 * Business Card PDF Generator
 * GET /api/my-business/card-pdf — Generate print-ready PDF business card (3.5" x 2")
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { decryptPhone } from '@/lib/encryption';
import PDFDocument from 'pdfkit';

// Standard business card: 3.5" x 2" at 72 DPI
const CARD_WIDTH = 3.5 * 72; // 252 points
const CARD_HEIGHT = 2 * 72; // 144 points
const MARGIN = 18;

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get brand + branch info
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      include: {
        branches: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!brand || !brand.branches[0]) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    const branch = brand.branches[0];
    const contact = branch.contact as any;
    const address = branch.address as any;
    const micrositeConfig = branch.micrositeConfig as any;
    const colorTheme = brand.colorTheme as any;

    // Get phone (decrypted)
    const phone = contact?.phone ? (decryptPhone(contact.phone) || contact.phone) : '';
    const email = contact?.email || '';
    const brandColor = colorTheme?.primary || '#1e40af';

    // Extract services from micrositeConfig
    const services: string[] = [];
    if (micrositeConfig?.sections?.services?.items) {
      const items = micrositeConfig.sections.services.items;
      for (let i = 0; i < Math.min(3, items.length); i++) {
        services.push(items[i].name);
      }
    }

    // Build website URL
    const websiteUrl = brand.customDomain
      ? `https://${brand.customDomain}`
      : `${process.env.NEXT_PUBLIC_APP_URL || 'https://parichay.app'}/${brand.slug}/${branch.slug}`;

    // Generate PDF
    const doc = new PDFDocument({
      size: [CARD_WIDTH * 2, CARD_HEIGHT * 2], // Two cards per page (front + back stacked)
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    // === FRONT OF CARD ===
    // Background
    doc.rect(0, 0, CARD_WIDTH * 2, CARD_HEIGHT).fill('#ffffff');

    // Brand color accent bar (left side)
    doc.rect(0, 0, 6, CARD_HEIGHT).fill(brandColor);

    // Business name
    doc.font('Helvetica-Bold')
      .fontSize(14)
      .fillColor(brandColor)
      .text(brand.name, MARGIN + 6, MARGIN + 10, {
        width: CARD_WIDTH * 2 - MARGIN * 2 - 6,
      });

    // Tagline
    if (brand.tagline) {
      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#555555')
        .text(brand.tagline, MARGIN + 6, MARGIN + 30, {
          width: CARD_WIDTH * 2 - MARGIN * 2 - 6,
        });
    }

    // Contact details
    const contactY = CARD_HEIGHT - MARGIN - 40;

    if (phone) {
      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#333333')
        .text(`📞 ${phone}`, MARGIN + 6, contactY);
    }

    if (email) {
      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#333333')
        .text(`✉️ ${email}`, MARGIN + 6, contactY + 12);
    }

    // QR Code placeholder (right side)
    const qrSize = 50;
    const qrX = CARD_WIDTH * 2 - MARGIN - qrSize;
    const qrY = CARD_HEIGHT - MARGIN - qrSize;
    doc.rect(qrX, qrY, qrSize, qrSize)
      .lineWidth(1)
      .strokeColor('#cccccc')
      .stroke();
    doc.font('Helvetica')
      .fontSize(6)
      .fillColor('#999999')
      .text('QR Code', qrX + 10, qrY + 22);

    // === BACK OF CARD ===
    const backY = CARD_HEIGHT;

    // Background
    doc.rect(0, backY, CARD_WIDTH * 2, CARD_HEIGHT).fill(brandColor);

    // Services
    if (services.length > 0) {
      doc.font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#ffffff')
        .text('Our Services', MARGIN, backY + MARGIN);

      services.forEach((service, idx) => {
        doc.font('Helvetica')
          .fontSize(8)
          .fillColor('#ffffffcc')
          .text(`• ${service}`, MARGIN + 4, backY + MARGIN + 16 + idx * 12);
      });
    }

    // Address (bottom of back)
    if (address) {
      const addrText = [address.street, address.city, address.state, address.zipCode]
        .filter(Boolean)
        .join(', ');
      if (addrText) {
        doc.font('Helvetica')
          .fontSize(7)
          .fillColor('#ffffffaa')
          .text(addrText, MARGIN, backY + CARD_HEIGHT - MARGIN - 20, {
            width: CARD_WIDTH * 2 - MARGIN * 2,
          });
      }
    }

    // Website URL
    doc.font('Helvetica-Bold')
      .fontSize(7)
      .fillColor('#ffffff')
      .text(websiteUrl, MARGIN, backY + CARD_HEIGHT - MARGIN - 8, {
        width: CARD_WIDTH * 2 - MARGIN * 2,
      });

    doc.end();
    const pdfBuffer = await pdfPromise;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${brand.slug}-business-card.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Card PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
