/**
 * Client Logos Admin API
 * GET /api/admin/client-logos - List all client logos
 * POST /api/admin/client-logos - Create a new client logo
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const createLogoSchema = z.object({
  name: z.string().min(1).max(100),
  logoUrl: z.string().url(),
  websiteUrl: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only SUPER_ADMIN can manage landing page content
    if (authResult.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const logos = await prisma.landingClientLogo.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ logos });
  } catch (error) {
    console.error('Error fetching client logos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client logos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authResult.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createLogoSchema.parse(body);

    const logo = await prisma.landingClientLogo.create({
      data: validatedData,
    });

    return NextResponse.json({ logo }, { status: 201 });
  } catch (error) {
    console.error('Error creating client logo:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create client logo' },
      { status: 500 }
    );
  }
}
