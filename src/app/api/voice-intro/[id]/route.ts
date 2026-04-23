import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const updateVoiceIntroSchema = z.object({
  audioUrl: z.string().url().optional(),
  duration: z.number().min(0).optional(),
  transcript: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET - Get voice intro by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const voiceIntro = await prisma.voiceIntro.findUnique({
      where: { id },
      include: {
        branch: {
          select: { id: true, name: true, brandId: true },
        },
      },
    });

    if (!voiceIntro) {
      return NextResponse.json(
        { error: 'Voice intro not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ voiceIntro });
  } catch (error) {
    console.error('Error fetching voice intro:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice intro' },
      { status: 500 }
    );
  }
}

// PUT - Update voice intro
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

    const existingVoiceIntro = await prisma.voiceIntro.findUnique({
      where: { id },
      include: {
        branch: {
          select: { brandId: true },
        },
      },
    });

    if (!existingVoiceIntro) {
      return NextResponse.json(
        { error: 'Voice intro not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === existingVoiceIntro.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateVoiceIntroSchema.parse(body);

    const voiceIntro = await prisma.voiceIntro.update({
      where: { id },
      data: validatedData,
      include: {
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ voiceIntro });
  } catch (error) {
    console.error('Error updating voice intro:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update voice intro' },
      { status: 500 }
    );
  }
}

// DELETE - Delete voice intro
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

    const existingVoiceIntro = await prisma.voiceIntro.findUnique({
      where: { id },
      include: {
        branch: {
          select: { brandId: true },
        },
      },
    });

    if (!existingVoiceIntro) {
      return NextResponse.json(
        { error: 'Voice intro not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === existingVoiceIntro.branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.voiceIntro.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Voice intro deleted successfully' });
  } catch (error) {
    console.error('Error deleting voice intro:', error);
    return NextResponse.json(
      { error: 'Failed to delete voice intro' },
      { status: 500 }
    );
  }
}

// PATCH - Increment play count (public endpoint)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'incrementPlay') {
      const voiceIntro = await prisma.voiceIntro.update({
        where: { id },
        data: {
          playCount: { increment: 1 },
        },
        select: { playCount: true },
      });

      return NextResponse.json({ playCount: voiceIntro.playCount });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating voice intro:', error);
    return NextResponse.json(
      { error: 'Failed to update voice intro' },
      { status: 500 }
    );
  }
}
