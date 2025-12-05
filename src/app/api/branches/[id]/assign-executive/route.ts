import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { JWTService } from '@/lib/jwt';

const prisma = new PrismaClient();

/**
 * POST /api/branches/[id]/assign-executive
 * Assign an executive to a branch (marks as onboarded by that executive)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = JWTService.verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const branchId = params.id;
    const body = await request.json();
    const { executiveId } = body;

    if (!executiveId) {
      return NextResponse.json(
        { error: 'Executive ID is required' },
        { status: 400 }
      );
    }

    // Verify the branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        brand: true,
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (
      payload.role !== 'SUPER_ADMIN' &&
      payload.role !== 'BRAND_MANAGER' &&
      payload.brandId !== branch.brandId
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Verify the executive exists and has EXECUTIVE role
    const executive = await prisma.user.findUnique({
      where: { id: executiveId },
    });

    if (!executive) {
      return NextResponse.json(
        { error: 'Executive not found' },
        { status: 404 }
      );
    }

    if (executive.role !== 'EXECUTIVE') {
      return NextResponse.json(
        { error: 'User is not an executive' },
        { status: 400 }
      );
    }

    // Update the branch with executive assignment
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        onboardedBy: executiveId,
        onboardedAt: new Date(),
      },
      include: {
        onboardingExecutive: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create notification for the executive
    await prisma.notification.create({
      data: {
        userId: executiveId,
        type: 'SYSTEM_ALERT',
        title: 'New Branch Assigned',
        message: `You have been assigned to onboard ${branch.name} for ${branch.brand.name}`,
        metadata: {
          branchId: branch.id,
          branchName: branch.name,
          brandId: branch.brandId,
          brandName: branch.brand.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Executive assigned successfully',
      data: {
        branch: {
          id: updatedBranch.id,
          name: updatedBranch.name,
          onboardedAt: updatedBranch.onboardedAt,
          executive: updatedBranch.onboardingExecutive
            ? {
                id: updatedBranch.onboardingExecutive.id,
                name: `${updatedBranch.onboardingExecutive.firstName} ${updatedBranch.onboardingExecutive.lastName}`,
                email: updatedBranch.onboardingExecutive.email,
              }
            : null,
        },
      },
    });
  } catch (error) {
    console.error('Error assigning executive:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/branches/[id]/assign-executive
 * Remove executive assignment from a branch
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = JWTService.verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const branchId = params.id;

    // Verify the branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (
      payload.role !== 'SUPER_ADMIN' &&
      payload.role !== 'BRAND_MANAGER' &&
      payload.brandId !== branch.brandId
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Remove executive assignment
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        onboardedBy: null,
        onboardedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Executive assignment removed',
      data: {
        branch: {
          id: updatedBranch.id,
          name: updatedBranch.name,
        },
      },
    });
  } catch (error) {
    console.error('Error removing executive assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
