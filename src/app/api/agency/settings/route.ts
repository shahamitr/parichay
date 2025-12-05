// @ts-nocheck
/**
 * Agency Settings API
 * GET /api/agency/settings - Get agency settings
 * PUT /api/agency/settings - Update agency settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const settingsSchema = z.object({
  brandName: z.string().min(2).optional(),
  tagline: z.string().optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  showPoweredBy: z.boolean().optional(),
  customDomain: z.string().optional(),
});

// GET - Get agency settings
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    if (!user.tenantId || user.role !== 'TENANT_ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Tenant admin required.' },
        { status: 403 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        brandName: true,
        tagline: true,
        supportEmail: true,
        supportPhone: true,
        website: true,
        logo: true,
        favicon: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        showPoweredBy: true,
        domain: true,
        customDomain: true,
        plan: true,
        clientLimit: true,
        pricePerClient: true,
        status: true,
        trialEndsAt: true,
        createdAt: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings: tenant });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

// PUT - Update agency settings
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    if (!user.tenantId || user.role !== 'TENANT_ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Tenant admin required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // Update tenant settings
    const updatedTenant = await prisma.tenant.update({
      where: { id: user.tenantId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        slug: true,
        brandName: true,
        tagline: true,
        supportEmail: true,
        supportPhone: true,
        website: true,
        logo: true,
        favicon: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        showPoweredBy: true,
        domain: true,
        customDomain: true,
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedTenant,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Update settings error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
