import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const createItemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().min(0),
  currency: z.string().default('INR'),
  imageUrl: z.string().url().optional(),
  availability: z.enum(['in_stock', 'out_of_stock', 'preorder']).default('in_stock'),
  retailerId: z.string().optional(),
  url: z.string().url().optional(),
});

// GET - List items in a catalogue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const catalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!catalogue) {
      return NextResponse.json(
        { error: 'WhatsApp catalogue not found' },
        { status: 404 }
      );
    }

    const items = await prisma.whatsAppCatalogueItem.findMany({
      where: { catalogueId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching catalogue items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalogue items' },
      { status: 500 }
    );
  }
}

// POST - Add item to catalogue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const catalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { id },
      include: {
        branch: {
          select: { brandId: true },
        },
      },
    });

    if (!catalogue) {
      return NextResponse.json(
        { error: 'WhatsApp catalogue not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === catalogue.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createItemSchema.parse(body);

    const item = await prisma.whatsAppCatalogueItem.create({
      data: {
        ...validatedData,
        catalogueId: id,
      },
    });

    // Update item count
    await prisma.whatsAppCatalogue.update({
      where: { id },
      data: {
        itemCount: { increment: 1 },
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating catalogue item:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create catalogue item' },
      { status: 500 }
    );
  }
}
