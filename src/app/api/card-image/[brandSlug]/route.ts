/**
 * Card Image Generation API
 * GET /api/card-image/[brandSlug] — Generate a shareable PNG business card image
 *
 * Returns a beautiful card image for sharing on Instagram stories,
 * WhatsApp status, or printing.
 * Uses SVG-to-PNG approach (no external canvas dependency).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CardData {
  name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  brandColor: string;
  slug: string;
  logo: string | null;
}

function generateCardSVG(card: CardData): string {
  const color = card.brandColor || '#3B82F6';
  const name = escapeXml(card.name);
  const tagline = escapeXml(card.tagline || '');
  const phone = escapeXml(card.phone || '');
  const email = escapeXml(card.email || '');
  const url = escapeXml(`parichay.io/${card.slug}`);

  // Generate QR code placeholder (simple grid pattern representing a QR)
  const qrSize = 80;
  const qrX = 520;
  const qrY = 180;
  let qrPattern = '';
  const seed = hashString(card.slug);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const filled = ((seed + row * 8 + col) % 3) !== 0;
      if (filled) {
        qrPattern += `<rect x="${qrX + col * 10}" y="${qrY + row * 10}" width="9" height="9" fill="${color}" rx="1"/>`;
      }
    }
  }
  // QR corner markers
  qrPattern += `
    <rect x="${qrX}" y="${qrY}" width="25" height="25" fill="${color}" rx="3"/>
    <rect x="${qrX + 3}" y="${qrY + 3}" width="19" height="19" fill="white" rx="2"/>
    <rect x="${qrX + 7}" y="${qrY + 7}" width="11" height="11" fill="${color}" rx="1"/>
    <rect x="${qrX + 55}" y="${qrY}" width="25" height="25" fill="${color}" rx="3"/>
    <rect x="${qrX + 58}" y="${qrY + 3}" width="19" height="19" fill="white" rx="2"/>
    <rect x="${qrX + 62}" y="${qrY + 7}" width="11" height="11" fill="${color}" rx="1"/>
    <rect x="${qrX}" y="${qrY + 55}" width="25" height="25" fill="${color}" rx="3"/>
    <rect x="${qrX + 3}" y="${qrY + 58}" width="19" height="19" fill="white" rx="2"/>
    <rect x="${qrX + 7}" y="${qrY + 62}" width="11" height="11" fill="${color}" rx="1"/>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="400" viewBox="0 0 680 400">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f9fafb"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Card background -->
  <rect width="680" height="400" rx="24" fill="url(#bg-gradient)" filter="url(#shadow)"/>

  <!-- Top color accent bar -->
  <rect width="680" height="8" rx="4" fill="${color}"/>

  <!-- Left side: Brand circle / initials -->
  <circle cx="80" cy="120" r="36" fill="${color}" opacity="0.1"/>
  <text x="80" y="128" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="${color}">
    ${escapeXml(card.name.charAt(0).toUpperCase())}
  </text>

  <!-- Business Name -->
  <text x="140" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#111827">
    ${name.length > 28 ? name.slice(0, 28) + '...' : name}
  </text>

  <!-- Tagline -->
  ${tagline ? `<text x="140" y="138" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#6b7280">${tagline.length > 45 ? tagline.slice(0, 45) + '...' : tagline}</text>` : ''}

  <!-- Divider -->
  <line x1="50" y1="170" x2="480" y2="170" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Contact details -->
  ${phone ? `
  <circle cx="74" cy="205" r="14" fill="${color}" opacity="0.1"/>
  <text x="74" y="209" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${color}">📞</text>
  <text x="98" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#374151">${phone}</text>
  ` : ''}

  ${email ? `
  <circle cx="74" cy="245" r="14" fill="${color}" opacity="0.1"/>
  <text x="74" y="249" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${color}">✉️</text>
  <text x="98" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#374151">${email.length > 30 ? email.slice(0, 30) + '...' : email}</text>
  ` : ''}

  <!-- URL -->
  <circle cx="74" cy="285" r="14" fill="${color}" opacity="0.1"/>
  <text x="74" y="289" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${color}">🔗</text>
  <text x="98" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="${color}" font-weight="500">${url}</text>

  <!-- QR Code area -->
  <rect x="${qrX - 10}" y="${qrY - 10}" width="100" height="100" rx="12" fill="white" stroke="#e5e7eb" stroke-width="1"/>
  ${qrPattern}

  <!-- Scan text -->
  <text x="${qrX + 40}" y="${qrY + 104}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#9ca3af">Scan to connect</text>

  <!-- Footer / Branding -->
  <rect x="0" y="350" width="680" height="50" rx="0" fill="${color}" opacity="0.04"/>
  <text x="340" y="380" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#9ca3af">
    Digital Business Card powered by Parichay
  </text>

  <!-- Decorative element -->
  <circle cx="630" cy="60" r="40" fill="${color}" opacity="0.05"/>
  <circle cx="650" cy="350" r="60" fill="${color}" opacity="0.03"/>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandSlug: string }> }
) {
  try {
    const { brandSlug } = await params;

    // Fetch brand data
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
      select: {
        name: true,
        slug: true,
        tagline: true,
        logo: true,
        colorTheme: true,
        branches: {
          where: { isActive: true },
          take: 1,
          select: {
            contact: true,
          },
        },
        users: {
          take: 1,
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Extract contact info
    const branchContact = brand.branches[0]?.contact as any;
    const ownerUser = brand.users[0];
    const phone = branchContact?.phone || ownerUser?.phone || null;
    const email = branchContact?.email || ownerUser?.email || null;
    const colorTheme = brand.colorTheme as any;

    const cardData: CardData = {
      name: brand.name,
      tagline: brand.tagline,
      phone,
      email,
      brandColor: colorTheme?.primary || '#3B82F6',
      slug: brand.slug,
      logo: brand.logo,
    };

    // Generate SVG
    const svg = generateCardSVG(cardData);

    // Return SVG as image (browsers render it nicely, and it's shareable)
    // For true PNG conversion, we'd need sharp or canvas on the server
    const format = request.nextUrl.searchParams.get('format');

    if (format === 'svg') {
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'Content-Disposition': `inline; filename="${brandSlug}-card.svg"`,
        },
      });
    }

    // Default: Try to convert to PNG using resvg-js (lightweight SVG to PNG)
    try {
      const { Resvg } = await import('@resvg/resvg-js');
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1360 }, // 2x for retina
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'Content-Disposition': `inline; filename="${brandSlug}-card.png"`,
        },
      });
    } catch {
      // Fallback to SVG if resvg-js not available
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'Content-Disposition': `inline; filename="${brandSlug}-card.svg"`,
        },
      });
    }
  } catch (error) {
    console.error('Card image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate card image' },
      { status: 500 }
    );
  }
}
