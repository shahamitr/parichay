/**
 * Admin How It Works API
 * GET /api/admin/how-it-works - List all steps
 * POST /api/admin/how-it-works - Create step
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// List steps
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const steps = await prisma.howItWorksStep.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, steps });
  } catch (error) {
    console.error('Error fetching how it works steps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create step
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

    const step = await prisma.howItWorksStep.create({
      data: {
        title,
        description,
        icon,
        gradient: gradient || 'from-primary-500 to-primary-600',
        displayOrder: displayOrder || 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, step }, { status: 201 });
  } catch (error) {
    console.error('Error creating how it works step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
