/**
 * Short Link Redirect Handler
 * GET /s/[code] - Redirect to target URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Find short link
    const shortLink = await prisma.shortLink.findUnique({
      where: { code },
    });

    if (!shortLink) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if expired
    if (shortLink.expiresAt && new Date() > shortLink.expiresAt) {
      return NextResponse.json(
        { error: 'This link has expired' },
        { status: 410 }
      );
    }

    // Check if active
    if (!shortLink.isActive) {
      return NextResponse.json(
        { error: 'This link is no longer active' },
        { status: 410 }
      );
    }

    // Increment click count
    await prisma.shortLink.update({
      where: { code },
      data: { clicks: { increment: 1 } },
    });

    // Track analytics
    if (shortLink.branchId || shortLink.brandId) {
      try {
        await prisma.analyticsEvent.create({
          data: {
            eventType: 'SHORT_LINK_CLICK',
            branchId: shortLink.branchId,
            brandId: shortLink.brandId,
            metadata: {
              code,
              targetUrl: shortLink.targetUrl,
            },
          },
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    }

    // Redirect to target URL
    return NextResponse.redirect(shortLink.targetUrl);
  } catch (error) {
    console.error('Short link redirect error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
