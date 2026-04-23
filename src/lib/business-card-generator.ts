/**
 * Business Card Generator
 * Generates business cards in PDF and image formats
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export interface BusinessCardData {
  branch: {
    id: string;
    name: string;
    contact: {
      phone?: string;
      phones?: string[];
      whatsapp?: string;
      email?: string;
      emails?: string[];
    };
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  brand: {
    name: string;
    logo?: string | null;
    tagline?: string | null;
    colorTheme?: {
      primary?: string;
      secondary?: string;
    } | null;
  };
  micrositeUrl: string;
}

/**
 * Generate PDF Business Card
 * Creates a professional PDF business card with QR code
 */
export async function generateBusinessCardPDF(data: BusinessCardData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const { branch, brand, micrositeUrl } = data;
      const contact = branch.contact || {};
      const address = branch.address;
      const socialMedia = branch.socialMedia;
      const colorTheme = brand.colorTheme as any;
      const primaryColor = colorTheme?.primary || '#3B82F6';

      // Create PDF document (business card size: 3.5" x 2" = 252 x 144 points)
      const doc = new PDFDocument({
        size: [504, 288], // 2x size for better quality
        margin: 24,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Background gradient effect (simulated with rectangles)
      doc.rect(0, 0, 504, 288).fill('#FFFFFF');

      // Top accent bar
      doc.rect(0, 0, 504, 8).fill(primaryColor);

      // Left section (2/3 width)
      const leftWidth = 320;

      // Brand/Business name
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#1F2937')
         .text(brand.name, 24, 32, { width: leftWidth });

      // Branch name (if different)
      if (branch.name !== brand.name) {
        doc.font('Helvetica')
           .fontSize(14)
           .fillColor('#6B7280')
           .text(branch.name, 24, 60, { width: leftWidth });
      }

      // Tagline
      if (brand.tagline) {
        doc.font('Helvetica-Oblique')
           .fontSize(11)
           .fillColor('#9CA3AF')
           .text(brand.tagline, 24, branch.name !== brand.name ? 80 : 60, { width: leftWidth });
      }

      // Contact information
      let yPos = 110;

      // Phone
      const phone = contact.phone || (contact.phones && contact.phones[0]);
      if (phone) {
        doc.font('Helvetica-Bold')
           .fontSize(10)
           .fillColor(primaryColor)
           .text('Phone', 24, yPos);
        doc.font('Helvetica')
           .fontSize(11)
           .fillColor('#374151')
           .text(phone, 24, yPos + 12);
        yPos += 36;
      }

      // Email
      const email = contact.email || (contact.emails && contact.emails[0]);
      if (email) {
        doc.font('Helvetica-Bold')
           .fontSize(10)
           .fillColor(primaryColor)
           .text('Email', 24, yPos);
        doc.font('Helvetica')
           .fontSize(11)
           .fillColor('#374151')
           .text(email, 24, yPos + 12, { width: leftWidth });
        yPos += 36;
      }

      // Address
      if (address && (address.city || address.street)) {
        doc.font('Helvetica-Bold')
           .fontSize(10)
           .fillColor(primaryColor)
           .text('Address', 24, yPos);
        const addressText = [
          address.street,
          [address.city, address.state].filter(Boolean).join(', '),
          address.zipCode,
        ].filter(Boolean).join('\n');
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#374151')
           .text(addressText, 24, yPos + 12, { width: leftWidth, lineGap: 2 });
      }

      // Right section - QR Code
      const qrSize = 120;
      const qrX = 504 - qrSize - 24;
      const qrY = 40;

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(micrositeUrl, {
        width: qrSize * 2,
        margin: 1,
        color: {
          dark: primaryColor,
          light: '#FFFFFF',
        },
      });

      // Add QR code to PDF
      doc.image(qrDataUrl, qrX, qrY, { width: qrSize, height: qrSize });

      // QR code label
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#9CA3AF')
         .text('Scan to visit', qrX, qrY + qrSize + 8, {
           width: qrSize,
           align: 'center'
         });

      // Social media icons (as text)
      if (socialMedia) {
        const socialY = 200;
        const socialLinks = [];
        if (socialMedia.instagram) socialLinks.push('@Instagram');
        if (socialMedia.facebook) socialLinks.push('@Facebook');
        if (socialMedia.linkedin) socialLinks.push('@LinkedIn');
        if (socialMedia.twitter) socialLinks.push('@Twitter');

        if (socialLinks.length > 0) {
          doc.font('Helvetica')
             .fontSize(8)
             .fillColor('#9CA3AF')
             .text(socialLinks.slice(0, 3).join('  |  '), qrX - 20, socialY, {
               width: qrSize + 40,
               align: 'center'
             });
        }
      }

      // Bottom accent
      doc.rect(0, 280, 504, 8).fill(primaryColor);

      // Footer with microsite URL
      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#6B7280')
         .text(micrositeUrl, 24, 264, { width: 300 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate Business Card Image (SVG format that can be converted to PNG client-side)
 * Returns SVG string that can be rendered and downloaded as PNG
 */
export async function generateBusinessCardSVG(data: BusinessCardData): Promise<string> {
  const { branch, brand, micrositeUrl } = data;
  const contact = branch.contact || {};
  const address = branch.address;
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(micrositeUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: primaryColor,
      light: '#FFFFFF',
    },
  });

  const phone = contact.phone || (contact.phones && contact.phones[0]);
  const email = contact.email || (contact.emails && contact.emails[0]);
  const addressLine = address
    ? [address.city, address.state].filter(Boolean).join(', ')
    : '';

  // Create SVG business card (1200x630 - social share size)
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F9FAFB;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Top accent bar -->
  <rect width="1200" height="12" fill="url(#accentGrad)"/>

  <!-- Bottom accent bar -->
  <rect y="618" width="1200" height="12" fill="url(#accentGrad)"/>

  <!-- Left side content -->
  <g transform="translate(60, 60)">
    <!-- Brand name -->
    <text font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1F2937">
      ${escapeXml(brand.name)}
    </text>

    <!-- Branch name -->
    ${branch.name !== brand.name ? `
    <text y="60" font-family="Arial, sans-serif" font-size="28" fill="#6B7280">
      ${escapeXml(branch.name)}
    </text>
    ` : ''}

    <!-- Tagline -->
    ${brand.tagline ? `
    <text y="${branch.name !== brand.name ? 100 : 60}" font-family="Arial, sans-serif" font-size="22" fill="#9CA3AF" font-style="italic">
      ${escapeXml(brand.tagline)}
    </text>
    ` : ''}

    <!-- Contact info -->
    <g transform="translate(0, ${branch.name !== brand.name ? 160 : 120})">
      ${phone ? `
      <g>
        <text font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${primaryColor}">Phone</text>
        <text y="28" font-family="Arial, sans-serif" font-size="24" fill="#374151">${escapeXml(phone)}</text>
      </g>
      ` : ''}

      ${email ? `
      <g transform="translate(0, ${phone ? 80 : 0})">
        <text font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${primaryColor}">Email</text>
        <text y="28" font-family="Arial, sans-serif" font-size="24" fill="#374151">${escapeXml(email)}</text>
      </g>
      ` : ''}

      ${addressLine ? `
      <g transform="translate(0, ${(phone ? 80 : 0) + (email ? 80 : 0)})">
        <text font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${primaryColor}">Location</text>
        <text y="28" font-family="Arial, sans-serif" font-size="24" fill="#374151">${escapeXml(addressLine)}</text>
      </g>
      ` : ''}
    </g>
  </g>

  <!-- Right side - QR Code -->
  <g transform="translate(860, 100)">
    <rect x="-20" y="-20" width="280" height="320" rx="16" fill="#F3F4F6"/>
    <image href="${qrDataUrl}" x="0" y="0" width="240" height="240"/>
    <text x="120" y="280" font-family="Arial, sans-serif" font-size="18" fill="#6B7280" text-anchor="middle">
      Scan to connect
    </text>
  </g>

  <!-- Footer URL -->
  <text x="60" y="590" font-family="Arial, sans-serif" font-size="16" fill="#9CA3AF">
    ${escapeXml(micrositeUrl)}
  </text>
</svg>`;

  return svg.trim();
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate business card filename
 */
export function generateBusinessCardFilename(branchName: string, format: 'pdf' | 'png' | 'svg'): string {
  const sanitized = branchName.replace(/[^a-zA-Z0-9]/g, '_');
  return `${sanitized}_business_card.${format}`;
}
