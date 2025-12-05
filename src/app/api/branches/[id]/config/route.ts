import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

// PUT /api/branches/[id]/config - Update microsite configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
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
      (user.role === 'BRAND_MANAGER' && user.brandId === currentBranch.brandId) ||
      (user.role === 'BRANCH_ADMIN' && user.branches?.some(b => b.id === id));

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { micrositeConfig } = body;

    if (!micrositeConfig) {
      return NextResponse.json(
        { error: 'micrositeConfig is required' },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: { micrositeConfig },
      select: {
        id: true,
        micrositeConfig: true
      }
    });

    return NextResponse.json({
      success: true,
      branch
    });
  } catch (error) {
    console.error('Error updating microsite config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
