import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const updateCatalogueSchema = z.object({
  phoneNumber: z.string().min(10).max(15).optional(),
  businessName: z.string().min(1).max(200).optional(),
});

// GET - Get catalogue by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const catalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
        },
        branch: {
          select: { id: true, name: true, brandId: true },
        },
      },
    });

    if (!catalogue) {
      return NextResponse.json(
        { error: 'WhatsApp catalogue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ catalogue });
  } catch (error) {
    console.error('Error fetching WhatsApp catalogue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WhatsApp catalogue' },
      { status: 500 }
    );
  }
}

// PUT - Update catalogue settings
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

    const existingCatalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { id },
      include: {
        branch: {
          select: { brandId: true },
        },
      },
    });

    if (!existingCatalogue) {
      return NextResponse.json(
        { error: 'WhatsApp catalogue not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === existingCatalogue.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateCatalogueSchema.parse(body);

    const catalogue = await prisma.whatsAppCatalogue.update({
      where: { id },
      data: validatedData,
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
        },
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ catalogue });
  } catch (error) {
    console.error('Error updating WhatsApp catalogue:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update WhatsApp catalogue' },
      { status: 500 }
    );
  }
}

// DELETE - Delete catalogue and all items
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingCatalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { id },
      include: {
        branch: {
          select: { brandId: true },
        },
      },
    });

    if (!existingCatalogue) {
      return NextResponse.json(
        { error: 'WhatsApp catalogue not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === existingCatalogue.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete catalogue (items will be cascade deleted)
    await prisma.whatsAppCatalogue.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'WhatsApp catalogue deleted successfully' });
  } catch (error) {
    console.error('Error deleting WhatsApp catalogue:', error);
    return NextResponse.json(
      { error: 'Failed to delete WhatsApp catalogue' },
      { status: 500 }
    );
  }
}
