import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { brandUpdateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

// GET /api/brands/[id] - Get brand details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        branches: {
          select: {
            id: true,
            name: true,
            slug: true,
            micrositeConfig: true,
          },
          where: { isActive: true },
          orderBy: { createdAt: 'asc' }
        },
        subscription: {
          select: {
            status: true,
            endDate: true,
            plan: {
              select: { name: true }
            }
          }
        },
        _count: {
          select: { branches: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      (user.brandId === brand.id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ brand });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/brands/[id] - Update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get current brand to check permissions
    const currentBrand = await prisma.brand.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!currentBrand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      (user.role === 'BRAND_MANAGER' && user.brandId === id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = brandUpdateSchema.parse(body);

    // Ensure customDomain is undefined (not empty string) to avoid unique constraint issues
    if ('customDomain' in validatedData) {
      validatedData.customDomain = validatedData.customDomain && validatedData.customDomain.trim() !== ''
        ? validatedData.customDomain.trim()
        : undefined;
    }

    // Handle slug update if name changed
    let updateData: any = { ...validatedData };
    if (validatedData.name) {
      const baseSlug = generateSlug(validatedData.name);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness (excluding current brand)
      while (await prisma.brand.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { branches: true }
        }
      }
    });

    return NextResponse.json({ brand });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/brands/[id] - Delete brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check permissions (only Super Admin can delete)
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if brand exists and has branches
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { branches: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    if (brand._count.branches > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with existing branches' },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
