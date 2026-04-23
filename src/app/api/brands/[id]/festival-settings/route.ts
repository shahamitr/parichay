import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { FestivalSettings } from '@/lib/festival-themes';

/**
 * GET /api/brands/[id]/festival-settings
 * Get festival settings for a brand
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where: any = { id };
    if (user.role !== 'SUPER_ADMIN') {
      where.ownerId = user.id;
    }

    const brand = await prisma.brand.findFirst({
      where,
      select: {
        id: true,
        name: true,
        festivalSettings: true,
      },
    });

    if (!brand) {
      console.log(`Festival settings 404: Brand ${id} not found for user ${user.id}`);
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Return default settings if none exist
    const defaultSettings: FestivalSettings = {
      enabled: false,
      festivalId: '',
      position: 'header',
      showEffects: true,
    };

    return NextResponse.json({
      success: true,
      settings: brand.festivalSettings || defaultSettings,
    });
  } catch (error) {
    console.error('Error fetching festival settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/brands/[id]/festival-settings
 * Update festival settings for a brand
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify brand ownership
    const where: any = { id };
    if (user.role !== 'SUPER_ADMIN') {
      where.ownerId = user.id;
    }

    const brand = await prisma.brand.findFirst({
      where,
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      enabled,
      festivalId,
      customMessage,
      customBannerUrl,
      startDate,
      endDate,
      position,
      showEffects,
    } = body;

    // Validate required fields
    if (enabled && !festivalId) {
      return NextResponse.json(
        { error: 'Festival type is required when enabled' },
        { status: 400 }
      );
    }

    // Validate position
    const validPositions = ['header', 'floating', 'overlay', 'border'];
    if (position && !validPositions.includes(position)) {
      return NextResponse.json(
        { error: 'Invalid position. Must be one of: header, floating, overlay, border' },
        { status: 400 }
      );
    }

    // Build festival settings object
    const festivalSettings: FestivalSettings = {
      enabled: Boolean(enabled),
      festivalId: festivalId || '',
      customMessage: customMessage || undefined,
      customBannerUrl: customBannerUrl || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      position: position || 'header',
      showEffects: showEffects !== false,
    };

    // Update brand
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        festivalSettings: festivalSettings as any,
      },
      select: {
        id: true,
        name: true,
        festivalSettings: true,
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedBrand.festivalSettings,
    });
  } catch (error) {
    console.error('Error updating festival settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
