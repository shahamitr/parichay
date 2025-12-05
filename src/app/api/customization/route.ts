/**
 * Brand Customization API
 * Handles saving and loading brand customization settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { BrandCustomization } from '@/types/theme';

/**
 * GET /api/customization?brandId=xxx
 * Load brand customization settings
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        id: true,
        customization: true,
        users: {
          where: { id: authResult.user.id },
          select: { id: true },
        },
      },
    });

    if (!brand || brand.users.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customization: brand.customization || null,
    });
  } catch (error) {
    console.error('Error loading customization:', error);
    return NextResponse.json(
      { error: 'Failed to load customization' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customization
 * Save brand customization settings
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { brandId, customization } = body as {
      brandId: string;
      customization: BrandCustomization;
    };

    if (!brandId || !customization) {
      return NextResponse.json(
        { error: 'Brand ID and customization data are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        id: true,
        users: {
          where: { id: authResult.user.id },
          select: { id: true },
        },
      },
    });

    if (!brand || brand.users.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found or access denied' },
        { status: 404 }
      );
    }

    // Save customization to database
    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        customization: customization as any,
      },
      select: {
        id: true,
        customization: true,
      },
    });

    return NextResponse.json({
      success: true,
      customization: updatedBrand.customization,
    });
  } catch (error) {
    console.error('Error saving customization:', error);
    return NextResponse.json(
      { error: 'Failed to save customization' },
      { status: 500 }
    );
  }
}
