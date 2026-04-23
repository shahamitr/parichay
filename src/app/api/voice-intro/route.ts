import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const createVoiceIntroSchema = z.object({
  audioUrl: z.string().url(),
  duration: z.number().min(0),
  transcript: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  branchId: z.string(),
});

// GET - Get voice intro for a branch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    if (!branchId) {
      return NextResponse.json(
        { error: 'branchId is required' },
        { status: 400 }
      );
    }

    const voiceIntro = await prisma.voiceIntro.findUnique({
      where: { branchId },
      include: {
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ voiceIntro });
  } catch (error) {
    console.error('Error fetching voice intro:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice intro' },
      { status: 500 }
    );
  }
}

// POST - Create or update voice intro (upsert since 1:1 with branch)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createVoiceIntroSchema.parse(body);

    // Verify branch exists and user has access
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId },
      select: { id: true, brandId: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Verify user has access to the brand
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      user.brandId === branch.brandId ||
      user.branches?.some((b: any) => b.id === branch.id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Upsert voice intro (create or update)
    const voiceIntro = await prisma.voiceIntro.upsert({
      where: { branchId: validatedData.branchId },
      create: {
        audioUrl: validatedData.audioUrl,
        duration: validatedData.duration,
        transcript: validatedData.transcript,
        isActive: validatedData.isActive ?? true,
        branchId: validatedData.branchId,
      },
      update: {
        audioUrl: validatedData.audioUrl,
        duration: validatedData.duration,
        transcript: validatedData.transcript,
        isActive: validatedData.isActive,
      },
      include: {
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ voiceIntro }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating voice intro:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create/update voice intro' },
      { status: 500 }
    );
  }
}
