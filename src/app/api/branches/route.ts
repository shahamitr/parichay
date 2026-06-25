import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { canAddBranch } from '@/lib/subscription-limits';
import { withApiHandler, apiError } from '@/lib/api-handler';
import { z } from 'zod';

const createBranchSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  brandId: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().optional(),
    email: z.string().email(),
  }),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  businessHours: z.record(z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })).optional(),
  micrositeConfig: z.any().optional(),
});

export const POST = withApiHandler(
  { auth: true, rateLimit: 'api' },
  async (request, _context, user) => {
    const body = await request.json();
    const data = createBranchSchema.parse(body); // Throws ZodError → caught by wrapper

    // Check subscription limits
    const limitCheck = await canAddBranch(data.brandId);
    if (!limitCheck.allowed) {
      return apiError(limitCheck.reason || 'Branch limit reached', 403);
    }

    // Check slug uniqueness within brand
    const existing = await prisma.branch.findFirst({
      where: { brandId: data.brandId, slug: data.slug },
    });

    if (existing != null) {
      return apiError('Branch slug already exists for this brand', 409);
    }

    const defaultMicrositeConfig = {
      templateId: 'modern-business',
      sections: {
        hero: { enabled: true, title: data.name, subtitle: '' },
        about: { enabled: true, content: `Welcome to ${data.name}` },
        services: { enabled: true, items: [] },
        contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'phone'] } },
      },
      seoSettings: { title: data.name, description: '', keywords: [] },
    };

    const branch = await prisma.branch.create({
      data: {
        name: data.name,
        slug: data.slug,
        brandId: data.brandId,
        address: data.address,
        contact: data.contact,
        socialMedia: data.socialMedia || {},
        businessHours: data.businessHours || {},
        micrositeConfig: data.micrositeConfig || defaultMicrositeConfig,
      },
    });

    return NextResponse.json(branch, { status: 201 });
  }
);

export const GET = withApiHandler(
  { auth: true, rateLimit: 'api' },
  async (request, _context, user) => {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return apiError('brandId is required', 400);
    }

    const branches = await prisma.branch.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      include: {
        brand: {
          select: { id: true, name: true, slug: true, colorTheme: true },
        },
        _count: { select: { leads: true } },
      },
    });

    return NextResponse.json(branches);
  }
);
