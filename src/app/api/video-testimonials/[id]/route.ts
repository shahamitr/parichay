import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const updateVideoTestimonialSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  customerName: z.string().min(1).max(100).optional(),
  customerTitle: z.string().max(100).optional().nullable(),
  customerAvatar: z.string().url().optional().nullable(),
  duration: z.number().min(0).optional().nullable(),
  isPublished: z.boolean().optional(),
  order: z.number().optional(),
});

// GET - Get single video testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonial = await prisma.videoTestimonial.findUnique({
      where: { id },
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Video testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Error fetching video testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video testimonial' },
      { status: 500 }
    );
  }
}

// PUT - Update video testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingTestimonial = await prisma.videoTestimonial.findUnique({
      where: { id },
      select: { brandId: true },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Video testimonial not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== existingTestimonial.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateVideoTestimonialSchema.parse(body);

    const testimonial = await prisma.videoTestimonial.update({
      where: { id },
      data: validatedData,
      include: {
        branch: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Error updating video testimonial:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update video testimonial' },
      { status: 500 }
    );
  }
}

// DELETE - Delete video testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingTestimonial = await prisma.videoTestimonial.findUnique({
      where: { id },
      select: { brandId: true },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Video testimonial not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== existingTestimonial.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.videoTestimonial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Video testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting video testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete video testimonial' },
      { status: 500 }
    );
  }
}

// PATCH - Increment view count (public endpoint)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'incrementView') {
      const testimonial = await prisma.videoTestimonial.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
        },
        select: { viewCount: true },
      });

      return NextResponse.json({ viewCount: testimonial.viewCount });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating video testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update video testimonial' },
      { status: 500 }
    );
  }
}
