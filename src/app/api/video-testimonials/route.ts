import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const createVideoTestimonialSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  customerName: z.string().min(1).max(100),
  customerTitle: z.string().max(100).optional(),
  customerAvatar: z.string().url().optional(),
  duration: z.number().min(0).optional(),
  isPublished: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
  branchId: z.string().optional(),
  brandId: z.string(),
});

// GET - List video testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const where: any = {};

    if (branchId) {
      where.branchId = branchId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (publishedOnly) {
      where.isPublished = true;
    }

    const testimonials = await prisma.videoTestimonial.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching video testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video testimonials' },
      { status: 500 }
    );
  }
}

// POST - Create video testimonial
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createVideoTestimonialSchema.parse(body);

    // Verify user has access to the brand
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== validatedData.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If branchId is provided, verify it belongs to the brand
    if (validatedData.branchId) {
      const branch = await prisma.branch.findUnique({
        where: { id: validatedData.branchId },
        select: { brandId: true },
      });

      if (!branch || branch.brandId !== validatedData.brandId) {
        return NextResponse.json(
          { error: 'Branch does not belong to the specified brand' },
          { status: 400 }
        );
      }
    }

    // Get the max order for the branch/brand
    const maxOrder = await prisma.videoTestimonial.aggregate({
      where: validatedData.branchId
        ? { branchId: validatedData.branchId }
        : { brandId: validatedData.brandId },
      _max: { order: true },
    });

    const testimonial = await prisma.videoTestimonial.create({
      data: {
        ...validatedData,
        order: validatedData.order || (maxOrder._max.order ?? 0) + 1,
      },
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error('Error creating video testimonial:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create video testimonial' },
      { status: 500 }
    );
  }
}
