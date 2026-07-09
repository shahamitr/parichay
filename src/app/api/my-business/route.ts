/**
 * My Business API — Self-serve business management for owners
 * GET /api/my-business — Get the logged-in user's brand + branch data
 * PATCH /api/my-business — Update business info (profile, hours, contact, services)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { decryptPhone, encryptPhone } from '@/lib/encryption';
import { z } from 'zod';

// GET — Fetch owner's business data
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find brand owned by this user
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [
          { ownerId: user.id },
          { users: { some: { id: user.id } } },
        ],
      },
      include: {
        branches: {
          where: { isActive: true },
          take: 5,
          include: {
            _count: { select: { leads: true, reviews: true } },
          },
        },
        subscription: { include: { plan: true } },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'No business found. Create one first.', brand: null }, { status: 200 });
    }

    const primaryBranch = brand.branches[0] || null;

    // Decrypt contact phone for display
    let contact = primaryBranch?.contact as any;
    if (contact?.phone) {
      contact = { ...contact, phone: decryptPhone(contact.phone) || contact.phone };
    }

    return NextResponse.json({
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        tagline: brand.tagline,
        colorTheme: brand.colorTheme,
      },
      branch: primaryBranch ? {
        id: primaryBranch.id,
        name: primaryBranch.name,
        slug: primaryBranch.slug,
        address: primaryBranch.address,
        contact,
        businessHours: primaryBranch.businessHours,
        micrositeConfig: primaryBranch.micrositeConfig,
        isActive: primaryBranch.isActive,
        isVerified: primaryBranch.isVerified,
        leadsCount: primaryBranch._count.leads,
        reviewsCount: primaryBranch._count.reviews,
      } : null,
      subscription: brand.subscription ? {
        plan: brand.subscription.plan.name,
        status: brand.subscription.status,
        endDate: brand.subscription.endDate,
        isTrial: brand.subscription.isTrial,
      } : null,
      profileUrl: primaryBranch ? `/${brand.slug}/${primaryBranch.slug}` : null,
    });
  } catch (error) {
    console.error('My business fetch error:', error);
    return NextResponse.json({ error: 'Failed to load business data' }, { status: 500 });
  }
}

// PATCH — Update business info
const updateSchema = z.object({
  // Brand-level
  name: z.string().min(2).max(100).optional(),
  tagline: z.string().max(200).optional(),
  logo: z.string().url().optional().or(z.literal('')),

  // Branch-level
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }).optional(),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  businessHours: z.record(z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })).optional(),
  services: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
  })).optional(),
}).partial();

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    // Find user's brand
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [
          { ownerId: user.id },
          { users: { some: { id: user.id } } },
        ],
      },
      include: { branches: { where: { isActive: true }, take: 1 } },
    });

    if (!brand) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    // Update brand-level fields
    if (data.name || data.tagline !== undefined || data.logo !== undefined) {
      await prisma.brand.update({
        where: { id: brand.id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.tagline !== undefined && { tagline: data.tagline || null }),
          ...(data.logo !== undefined && { logo: data.logo || null }),
        },
      });
    }

    // Update branch-level fields
    const branch = brand.branches[0];
    if (branch && (data.address || data.contact || data.businessHours || data.services)) {
      const branchUpdate: any = {};

      if (data.address) branchUpdate.address = data.address;
      if (data.contact) {
        branchUpdate.contact = {
          ...data.contact,
          phone: encryptPhone(data.contact.phone) || data.contact.phone,
        };
      }
      if (data.businessHours) branchUpdate.businessHours = data.businessHours;

      if (data.services) {
        // Update services in micrositeConfig
        const config = (branch.micrositeConfig as any) || {};
        config.sections = config.sections || {};
        config.sections.services = {
          ...config.sections.services,
          enabled: true,
          items: data.services,
        };
        branchUpdate.micrositeConfig = config;
      }

      await prisma.branch.update({
        where: { id: branch.id },
        data: branchUpdate,
      });
    }

    return NextResponse.json({ success: true, message: 'Business updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('My business update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
