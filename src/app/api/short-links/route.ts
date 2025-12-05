/**
 * Short Links API
 * POST /api/short-links - Create short link
 * GET /api/short-links - List short links
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const createShortLinkSchema = z.object({
  branchId: z.string().optional(),
  brandId: z.string().optional(),
  targetUrl: z.string().url(),
  expiresAt: z.string().datetime().optional(),
});

// Generate random short code
function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createShortLinkSchema.parse(body);
    const { branchId, brandId, targetUrl, expiresAt } = validatedData;

    // Generate unique short code
    let code = generateShortCode(6);
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.shortLink.findUnique({
        where: { code },
      });
      if (!existing) break;
      code = generateShortCode(6);
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Failed to generate unique code' },
        { status: 500 }
      );
    }

    // Create short link
    const shortLink = await prisma.shortLink.create({
      data: {
        id: `sl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        code,
        targetUrl,
        branchId: branchId || null,
        brandId: brandId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/s/${code}`;

    return NextResponse.json({
      ...shortLink,
      shortUrl,
    });
  } catch (error) {
    console.error('Short link creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create short link' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');

    const where: any = { isActive: true };

    if (branchId != null) {
      where.branchId = branchId;
    } else if (brandId != null) {
      where.brandId = brandId;
    } else if (user.role !== 'SUPER_ADMIN') {
      // Regular users can only see their own links
      where.OR = [
        { brandId: user.brandId },
        { branchId: { in: user.branches?.map((b: any) => b.id) } },
      ];
    }

    const shortLinks = await prisma.shortLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const linksWithUrls = shortLinks.map((link) => ({
      ...link,
      shortUrl: `${baseUrl}/s/${link.code}`,
    }));

    return NextResponse.json(linksWithUrls);
  } catch (error) {
    console.error('Short links fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch short links' },
      { status: 500 }
    );
  }
}
