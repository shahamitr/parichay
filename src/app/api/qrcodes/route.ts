/**
 * QR Code Generation API
 * POST /api/qrcodes - Generate QR code for a branch
 * GET /api/qrcodes - List QR codes for a brand/branch
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { generateQRCode, validateQRCodeUrl } from '@/lib/qrcode-generator';
import { z } from 'zod';

const createQRCodeSchema = z.object({
  branchId: z.string().optional(),
  brandId: z.string().optional(),
  format: z.enum(['png', 'svg', 'dataurl']).default('png'),
  size: z.number().min(128).max(2048).optional().default(512),
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createQRCodeSchema.parse(body);
    const { branchId, brandId, format, size } = validatedData;

    // Validate that either branchId or brandId is provided
    if (!branchId && !brandId) {
      return NextResponse.json(
        { error: 'Either branchId or brandId is required' },
        { status: 400 }
      );
    }

    // Fetch branch or brand data
    let url: string;
    let brandColors: { primary: string; secondary?: string } | undefined;
    let entityId: string;
    let entityType: 'branch' | 'brand';

    if (branchId != null) {
      const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: { brand: true },
      });

      if (!branch) {
        return NextResponse.json(
          { error: 'Branch not found' },
          { status: 404 }
        );
      }

      // Check authorization
      if (
        user.role !== 'SUPER_ADMIN' &&
        user.brandId !== branch.brandId &&
        !(user.branches || []).some((b) => b.id === branchId)
      ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Construct microsite URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onetouchbizcard.in';
      url = `${baseUrl}/${branch.brand.slug}/${branch.slug}`;

      brandColors = {
        primary: (branch.brand?.colorTheme as any).primary,
        secondary: (branch.brand?.colorTheme as any).secondary,
      };

      entityId = branchId;
      entityType = 'branch';
    } else if (brandId != null) {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
      });

      if (!brand) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        );
      }

      // Check authorization
      if (user.role !== 'SUPER_ADMIN' && user.brandId !== brandId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Construct brand URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onetouchbizcard.in';
      url = `${baseUrl}/${brand.slug}`;

      brandColors = {
        primary: (brand.colorTheme as any).primary,
        secondary: (brand.colorTheme as any).secondary,
      };

      entityId = brandId;
      entityType = 'brand';
    } else {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Validate URL
    if (!validateQRCodeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL generated' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodeResult = await generateQRCode({
      url,
      format,
      brandColors,
      size,
    });

    // Save QR code to database
    const qrCode = await prisma.qRCode.create({
      data: {
        url,
        qrData: qrCodeResult.data,
        format: qrCodeResult.format,
        branchId: entityType === 'branch' ? entityId : null,
        brandId: entityType === 'brand' ? entityId : null,
      },
    });

    return NextResponse.json({
      id: qrCode.id,
      url: qrCode.url,
      qrData: qrCode.qrData,
      format: qrCode.format,
      scanCount: qrCode.scanCount,
      createdAt: qrCode.createdAt,
    });
  } catch (error) {
    console.error('QR code generation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');

    // Build query based on user role and filters
    const where: any = {};

    if (user.role === 'SUPER_ADMIN') {
      // Super admin can see all QR codes
      if (branchId) where.branchId = branchId;
      if (brandId) where.brandId = brandId;
    } else if (user.role === 'BRAND_MANAGER') {
      // Brand manager can see QR codes for their brand
      where.brandId = user.brandId;
      if (branchId) where.branchId = branchId;
    } else {
      // Branch admin can only see QR codes for their branches
      const userBranches = user.branches || [];
      where.branchId = {
        in: userBranches.map((b) => b.id),
      };
      if (branchId && userBranches.some((b) => b.id === branchId)) {
        where.branchId = branchId;
      }
    }

    const qrCodes = await prisma.qRCode.findMany({
      where,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ qrCodes });
  } catch (error) {
    console.error('QR code fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}
