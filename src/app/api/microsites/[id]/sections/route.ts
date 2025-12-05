import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { SectionOrderItem, SectionId } from '@/types/microsite';

// Default section order
const DEFAULT_SECTION_ORDER: SectionOrderItem[] = [
  { id: 'hero', enabled: true },
  { id: 'about', enabled: true },
  { id: 'services', enabled: true },
  { id: 'gallery', enabled: true },
  { id: 'contact', enabled: true },
  { id: 'trustIndicators', enabled: false },
  { id: 'payment', enabled: true },
  { id: 'feedback', enabled: true },
  { id: 'videos', enabled: false },
  { id: 'testimonials', enabled: false },
  { id: 'impact', enabled: false },
  { id: 'portfolio', enabled: false },
  { id: 'aboutFounder', enabled: false },
  { id: 'offers', enabled: false },
  { id: 'cta', enabled: false },
];

// GET /api/microsites/[id]/sections - Get section order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params;

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { micrositeConfig: true },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    const config = branch.micrositeConfig as any;
    const sectionOrder = config?.sectionOrder || DEFAULT_SECTION_ORDER;

    return NextResponse.json({
      success: true,
      data: {
        sectionOrder,
        availableSections: DEFAULT_SECTION_ORDER.map(s => s.id),
      },
    });
  } catch (error) {
    console.error('Error fetching section order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/microsites/[id]/sections - Update section order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: branchId } = await params;
    const body = await request.json();
    const { sectionOrder } = body as { sectionOrder: SectionOrderItem[] };

    // Validate section order
    if (!Array.isArray(sectionOrder)) {
      return NextResponse.json(
        { error: 'Invalid section order format' },
        { status: 400 }
      );
    }

    const validSectionIds = DEFAULT_SECTION_ORDER.map(s => s.id);
    for (const item of sectionOrder) {
      if (!validSectionIds.includes(item.id)) {
        return NextResponse.json(
          { error: `Invalid section ID: ${item.id}` },
          { status: 400 }
        );
      }
      if (typeof item.enabled !== 'boolean') {
        return NextResponse.json(
          { error: `Invalid enabled value for section: ${item.id}` },
          { status: 400 }
        );
      }
    }

    // Check if user has access to this branch
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        OR: [
          { brand: { ownerId: user.id } },
          { admins: { some: { id: user.id } } },
        ],
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found or access denied' },
        { status: 404 }
      );
    }

    // Update microsite config with new section order
    const currentConfig = (branch.micrositeConfig as any) || {};
    const updatedConfig = {
      ...currentConfig,
      sectionOrder,
    };

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        micrositeConfig: updatedConfig,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sectionOrder: (updatedBranch.micrositeConfig as any).sectionOrder,
      },
    });
  } catch (error) {
    console.error('Error updating section order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/microsites/[id]/sections - Toggle single section
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: branchId } = await params;
    const body = await request.json();
    const { sectionId, enabled } = body as { sectionId: SectionId; enabled: boolean };

    // Validate
    const validSectionIds = DEFAULT_SECTION_ORDER.map(s => s.id);
    if (!validSectionIds.includes(sectionId)) {
      return NextResponse.json(
        { error: `Invalid section ID: ${sectionId}` },
        { status: 400 }
      );
    }

    // Check if user has access to this branch
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        OR: [
          { brand: { ownerId: user.id } },
          { admins: { some: { id: user.id } } },
        ],
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found or access denied' },
        { status: 404 }
      );
    }

    // Update section enabled status
    const currentConfig = (branch.micrositeConfig as any) || {};
    let sectionOrder: SectionOrderItem[] = currentConfig.sectionOrder || [...DEFAULT_SECTION_ORDER];

    const sectionIndex = sectionOrder.findIndex(s => s.id === sectionId);
    if (sectionIndex >= 0) {
      sectionOrder[sectionIndex].enabled = enabled;
    } else {
      sectionOrder.push({ id: sectionId, enabled });
    }

    const updatedConfig = {
      ...currentConfig,
      sectionOrder,
    };

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        micrositeConfig: updatedConfig,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sectionId,
        enabled,
        sectionOrder: (updatedBranch.micrositeConfig as any).sectionOrder,
      },
    });
  } catch (error) {
    console.error('Error toggling section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
