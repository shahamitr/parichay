import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const createCatalogueSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  businessName: z.string().min(1).max(200),
  branchId: z.string(),
});

// GET - Get WhatsApp catalogue for a branch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    if (!branchId) {
      return NextResponse.json(
        { error: 'branchId is required' },
        { status: 400 }
      );
    }

    const catalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { branchId },
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
    console.error('Error fetching WhatsApp catalogue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WhatsApp catalogue' },
      { status: 500 }
    );
  }
}

// POST - Create WhatsApp catalogue
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCatalogueSchema.parse(body);

    // Verify branch exists and user has access
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId },
      select: { id: true, brandId: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Verify user has access to the brand
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === branch.brandId ||
      user.branches?.some((b: any) => b.id === branch.id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if catalogue already exists for this branch
    const existingCatalogue = await prisma.whatsAppCatalogue.findUnique({
      where: { branchId: validatedData.branchId },
    });

    if (existingCatalogue) {
      return NextResponse.json(
        { error: 'WhatsApp catalogue already exists for this branch' },
        { status: 409 }
      );
    }

    const catalogue = await prisma.whatsAppCatalogue.create({
      data: {
        phoneNumber: validatedData.phoneNumber,
        businessName: validatedData.businessName,
        branchId: validatedData.branchId,
        syncStatus: 'SYNCED', // Local catalogue is always synced
      },
      include: {
        items: true,
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ catalogue }, { status: 201 });
  } catch (error) {
    console.error('Error creating WhatsApp catalogue:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create WhatsApp catalogue' },
      { status: 500 }
    );
  }
}
