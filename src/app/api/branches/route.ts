import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { canAddBranch } from '@/lib/subscription-limits';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createBranchSchema.parse(body);

    // Check subscription limits
    const limitCheck = await canAddBranch(data.brandId);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.reason },
        { status: 403 }
      );
    }

    // Check slug uniqueness within brand
    const existing = await prisma.branch.findFirst({
      where: {
        brandId: data.brandId,
        slug: data.slug,
      },
    });

    if (existing != null) {
      return NextResponse.json(
        { error: 'Branch slug already exists for this brand' },
        { status: 409 }
      );
    }

    // Default microsite config
    const defaultMicrositeConfig = {
      templateId: 'modern-business',
      sections: {
        hero: { enabled: true, title: data.name, subtitle: '' },
        about: { enabled: true, content: `Welcome to ${data.name}` },
        services: { enabled: true, items: [] },
        contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'phone'] } }
      },
      seoSettings: {
        title: data.name,
        description: '',
        keywords: []
      }
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { error: 'brandId is required' },
        { status: 400 }
      );
    }

    const branches = await prisma.branch.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            colorTheme: true,
          },
        },
        _count: {
          select: { leads: true },
        },
      },
    });

    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}
