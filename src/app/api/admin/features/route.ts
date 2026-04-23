/**
 * Admin Landing Features API
 * GET /api/admin/features - List all features
 * POST /api/admin/features - Create feature
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// List features
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const features = await prisma.landingFeature.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, features });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create feature
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, icon, gradient, displayOrder, isPublished } = body;

    if (!title || !description || !icon) {
      return NextResponse.json(
        { error: 'Title, description, and icon are required' },
        { status: 400 }
      );
    }

    const feature = await prisma.landingFeature.create({
      data: {
        title,
        description,
        icon,
        gradient: gradient || 'from-primary-500 to-primary-600',
        displayOrder: displayOrder || 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, feature }, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
