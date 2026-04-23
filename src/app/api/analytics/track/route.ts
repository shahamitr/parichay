// @ts-nocheck
/**
 * Enhanced Analytics Tracking API
 * POST /api/analytics/track - Track analytics events
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const trackEventSchema = z.object({
  eventType: z.string().default('PAGE_VIEW'),
  eventData: z.record(z.any()).optional(),
  elementId: z.string().optional(),
  elementType: z.string().optional(),
  elementText: z.string().optional(),
  pageUrl: z.string().optional().default('/'),
  referrer: z.string().optional(),
  sessionId: z.string().optional().default(() => `session_${Date.now()}`),
  deviceInfo: z.object({
    userAgent: z.string(),
    platform: z.string(),
    screenWidth: z.number(),
    screenHeight: z.number(),
    viewportWidth: z.number(),
    viewportHeight: z.number(),
    deviceType: z.enum(['mobile', 'tablet', 'desktop']),
    browser: z.string(),
    browserVersion: z.string(),
    os: z.string(),
    osVersion: z.string(),
  }).optional(),
  locationInfo: z.object({
    x: z.number(),
    y: z.number(),
    scrollX: z.number(),
    scrollY: z.number(),
    scrollDepth: z.number(),
  }).optional(),
  timestamp: z.string().optional().default(() => new Date().toISOString()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = trackEventSchema.parse(body);

    // Extract brand and branch from URL (handle relative URLs)
    let pathParts: string[] = [];
    try {
      const pageUrl = validatedData.pageUrl || '/';
      // If it's an absolute URL, parse it; otherwise treat as path
      if (pageUrl.startsWith('http://') || pageUrl.startsWith('https://')) {
        const url = new URL(pageUrl);
        pathParts = url.pathname.split('/').filter(Boolean) || [];
      } else {
        pathParts = pageUrl.split('/').filter(Boolean) || [];
      }
    } catch {
      // Invalid URL, skip brand/branch extraction
      pathParts = [];
    }

    let brandSlug: string | undefined;
    let branchSlug: string | undefined;

    if (pathParts.length >= 2) {
      brandSlug = pathParts[0];
      branchSlug = pathParts[1];
    }

    // Find brand and branch
    let brandId: string | undefined;
    let branchId: string | undefined;

    if (brandSlug) {
      const brand = await prisma.brand.findUnique({
        where: { slug: brandSlug },
        select: { id: true },
      });
      brandId = brand?.id;

      if (brand && branchSlug) {
        const branch = await prisma.branch.findFirst({
          where: {
            slug: branchSlug,
            brandId: brand.id,
          },
          select: { id: true },
        });
        branchId = branch?.id;
      }
    }

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: validatedData.eventType as any, // Cast to any to avoid type issues with older client
        brandId,
        branchId,
        ipAddress: ip,
        userAgent: validatedData.deviceInfo?.userAgent,
        metadata: {
          ...validatedData.eventData,
          sessionId: validatedData.sessionId, // Moved inside metadata
          referrer: validatedData.referrer,
          elementId: validatedData.elementId,
          elementType: validatedData.elementType,
          elementText: validatedData.elementText,
          pageUrl: validatedData.pageUrl,
          deviceInfo: validatedData.deviceInfo,
          locationInfo: validatedData.locationInfo,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Only log non-validation errors to reduce noise
    if (!(error instanceof z.ZodError)) {
      console.error('Analytics tracking error:', error);
    }

    if (error instanceof z.ZodError) {
      // Silently accept invalid tracking data with 200 to prevent client retries
      return NextResponse.json({ success: false, reason: 'validation' });
    }

    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
