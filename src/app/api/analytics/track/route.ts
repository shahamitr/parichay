// @ts-nocheck
/**
 * Enhanced Analytics Tracking API
 * POST /api/analytics/track - Track analytics events
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const trackEventSchema = z.object({
  eventType: z.string(),
  eventData: z.record(z.any()).optional(),
  elementId: z.string().optional(),
  elementType: z.string().optional(),
  elementText: z.string().optional(),
  pageUrl: z.string(),
  referrer: z.string().optional(),
  sessionId: z.string(),
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
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = trackEventSchema.parse(body);

    // Extract brand and branch from URL
    const url = new URL(validatedData.pageUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);

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
        eventType: validatedData.eventType,
        brandId,
        branchId,
        sessionId: validatedData.sessionId,
        ipAddress: ip,
        userAgent: validatedData.deviceInfo?.userAgent,
        referrer: validatedData.referrer,
        metadata: {
          ...validatedData.eventData,
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
    console.error('Analytics tracking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid tracking data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
