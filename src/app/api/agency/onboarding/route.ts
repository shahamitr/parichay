// @ts-nocheck
/**
 * Agency Onboarding API
 * POST /api/agency/onboarding - Create new agency tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-utils';
import { createTenant } from '@/lib/tenant/tenant-service';
import { prisma } from '@/lib/prisma';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  brandName: z.string().min(2, 'Brand name must be at least 2 characters'),
  tagline: z.string().optional(),
  supportEmail: z.string().email('Invalid email address'),
  supportPhone: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  plan: z.enum(['AGENCY_STARTER', 'AGENCY_PRO', 'AGENCY_ENTERPRISE']),
  customDomain: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    // Check if user already has a tenant
    if (user.tenantId) {
      return NextResponse.json(
        { error: 'User already belongs to an agency' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    // Check if slug is available
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'This slug is already taken' },
        { status: 409 }
      );
    }

    // Determine plan limits and pricing
    const planConfig = {
      AGENCY_STARTER: { clientLimit: 10, pricePerClient: 10.00, monthlyFee: 99.00 },
      AGENCY_PRO: { clientLimit: 50, pricePerClient: 10.00, monthlyFee: 299.00 },
      AGENCY_ENTERPRISE: { clientLimit: 999, pricePerClient: 8.00, monthlyFee: 999.00 },
    };

    const config = planConfig[validatedData.plan];

    // Create tenant
    const tenant = await createTenant(
      {
        ...validatedData,
        clientLimit: config.clientLimit,
        pricePerClient: config.pricePerClient,
        domain: `${validatedData.slug}.parichay.io`,
        showPoweredBy: validatedData.plan === 'AGENCY_STARTER',
      },
      user.id
    );

    // Update user role to TENANT_ADMIN
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'TENANT_ADMIN',
        tenantId: tenant.id,
      },
    });

    // Create initial billing record
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    await prisma.tenantBilling.create({
      data: {
        tenantId: tenant.id,
        periodStart,
        periodEnd,
        clientCount: 0,
        baseFee: config.monthlyFee,
        clientFees: 0,
        total: config.monthlyFee,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        brandName: tenant.brandName,
        domain: tenant.domain,
        plan: tenant.plan,
      },
      message: 'Agency created successfully! Welcome to Parichay White-Label Platform.',
    });
  } catch (error) {
    console.error('Onboarding error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create agency' },
      { status: 500 }
    );
  }
}
