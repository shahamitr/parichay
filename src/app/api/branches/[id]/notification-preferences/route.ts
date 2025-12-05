import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';

// GET /api/branches/[id]/notification-preferences
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branchId = params.id;

    // Verify user has access to this branch
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        id: true,
        brandId: true,
        micrositeConfig: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check authorization
    const user = authResult.user;
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== branch.brandId &&
      !user.branchIds?.includes(branchId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get notification preferences from micrositeConfig
    const config = branch.micrositeConfig as any;
    const notificationPreferences = config?.notificationPreferences || {
      email: true,
      whatsapp: false,
      inApp: true,
    };

    return NextResponse.json({
      success: true,
      preferences: notificationPreferences,
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/branches/[id]/notification-preferences
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branchId = params.id;
    const body = await request.json();
    const { email, whatsapp, inApp } = body;

    // Validate input
    if (
      typeof email !== 'boolean' ||
      typeof whatsapp !== 'boolean' ||
      typeof inApp !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'Invalid notification preferences' },
        { status: 400 }
      );
    }

    // Verify user has access to this branch
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        id: true,
        brandId: true,
        micrositeConfig: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check authorization
    const user = authResult.user;
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== branch.brandId &&
      !user.branchIds?.includes(branchId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update notification preferences
    const config = branch.micrositeConfig as any;
    const updatedConfig = {
      ...config,
      notificationPreferences: {
        email,
        whatsapp,
        inApp,
      },
    };

    await prisma.branch.update({
      where: { id: branchId },
      data: {
        micrositeConfig: updatedConfig,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: {
        email,
        whatsapp,
        inApp,
      },
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
