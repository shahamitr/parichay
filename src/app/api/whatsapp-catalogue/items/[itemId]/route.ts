import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const updateItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().min(0).optional(),
  currency: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  availability: z.enum(['in_stock', 'out_of_stock', 'preorder']).optional(),
  retailerId: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
});

// GET - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    const item = await prisma.whatsAppCatalogueItem.findUnique({
      where: { id: itemId },
      include: {
        catalogue: {
          select: { id: true, businessName: true, phoneNumber: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Catalogue item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error fetching catalogue item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalogue item' },
      { status: 500 }
    );
  }
}

// PUT - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingItem = await prisma.whatsAppCatalogueItem.findUnique({
      where: { id: itemId },
      include: {
        catalogue: {
          include: {
            branch: {
              select: { brandId: true },
            },
          },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Catalogue item not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === existingItem.catalogue.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateItemSchema.parse(body);

    const item = await prisma.whatsAppCatalogueItem.update({
      where: { id: itemId },
      data: validatedData,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating catalogue item:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update catalogue item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingItem = await prisma.whatsAppCatalogueItem.findUnique({
      where: { id: itemId },
      include: {
        catalogue: {
          include: {
            branch: {
              select: { brandId: true },
            },
          },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Catalogue item not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === existingItem.catalogue.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.whatsAppCatalogueItem.delete({
      where: { id: itemId },
    });

    // Update item count
    await prisma.whatsAppCatalogue.update({
      where: { id: existingItem.catalogueId },
      data: {
        itemCount: { decrement: 1 },
      },
    });

    return NextResponse.json({ message: 'Catalogue item deleted successfully' });
  } catch (error) {
    console.error('Error deleting catalogue item:', error);
    return NextResponse.json(
      { error: 'Failed to delete catalogue item' },
      { status: 500 }
    );
  }
}
