import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { branchUpdateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

// GET /api/branches/[id] - Get branch details
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

    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            colorTheme: true
          }
        },
        leads: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            source: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { leads: true }
        }
      }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.role === 'EXECUTIVE' ||
      (user.role === 'BRAND_MANAGER' && user.brandId === branch.brandId) ||
      (user.role === 'BRANCH_ADMIN' && user.branches?.some(b => b.id === id));

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ branch });
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/branches/[id] - Update branch
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

    // Get current branch to check permissions
    const currentBranch = await prisma.branch.findUnique({
      where: { id },
      select: { brandId: true }
    });

    if (!currentBranch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.role === 'EXECUTIVE' ||
      (user.role === 'BRAND_MANAGER' && user.brandId === currentBranch.brandId) ||
      (user.role === 'BRANCH_ADMIN' && user.branches?.some(b => b.id === id));

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = branchUpdateSchema.parse(body);

    // Handle slug update if name changed
    let updateData: any = { ...validatedData };
    if (validatedData.name) {
      const baseSlug = generateSlug(validatedData.name);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness within brand (excluding current branch)
      while (await prisma.branch.findFirst({
        where: {
          brandId: currentBranch.brandId,
          slug,
          NOT: { id }
        }
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: updateData,
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            colorTheme: true
          }
        }
      }
    });

    return NextResponse.json({ branch });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/branches/[id] - Delete branch
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

    // Get current branch to check permissions
    const currentBranch = await prisma.branch.findUnique({
      where: { id },
      select: { brandId: true }
    });

    if (!currentBranch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check permissions (only Super Admin and Brand Manager can delete)
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      (user.role === 'BRAND_MANAGER' && user.brandId === currentBranch.brandId);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.branch.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}