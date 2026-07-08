/**
 * Customer Q&A API
 * GET /api/questions?branchId=xxx — Get questions for a branch
 * POST /api/questions — Submit a new question (public, bot-protected)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateFormSubmission } from '@/lib/bot-protection';
import { rateLimiters } from '@/lib/rate-limiter';
import { z } from 'zod';

// GET — Fetch published Q&A for a branch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    if (!branchId) {
      return NextResponse.json({ error: 'branchId required' }, { status: 400 });
    }

    // For now, use the lead table with source='question' as a simple Q&A store
    // In future, a dedicated QA model would be ideal
    const questions = await prisma.lead.findMany({
      where: {
        branchId,
        source: 'question',
        status: { in: ['QUALIFIED', 'CONVERTED'] }, // Only show answered questions
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        message: true,
        createdAt: true,
        metadata: true,
      },
    });

    // Format for frontend
    const formattedQuestions = questions.map((q) => {
      const meta = q.metadata as Record<string, unknown> | null;
      return {
        id: q.id,
        question: q.message || '',
        answer: (meta?.answer as string) || null,
        askerName: q.name,
        createdAt: q.createdAt.toISOString(),
        answeredAt: (meta?.answeredAt as string) || undefined,
      };
    });

    return NextResponse.json({ questions: formattedQuestions });
  } catch (error) {
    console.error('Q&A fetch error:', error);
    return NextResponse.json({ questions: [] });
  }
}

// POST — Submit a new question
const questionSchema = z.object({
  branchId: z.string().min(1),
  question: z.string().min(10).max(500),
  askerName: z.string().min(2).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limit
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rl = await rateLimiters.formSubmission.checkLimit(`question:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ success: true, message: 'Question submitted!' });
    }

    // Bot protection
    const botCheck = validateFormSubmission(request, body);
    if (!botCheck.allowed) {
      return NextResponse.json({ success: true, message: 'Question submitted!' });
    }

    const data = questionSchema.parse(body);

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
      select: { id: true, brandId: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Store as lead with source='question'
    await prisma.lead.create({
      data: {
        name: data.askerName,
        message: data.question,
        source: 'question',
        status: 'NEW',
        branchId: data.branchId,
        brandId: branch.brandId,
        metadata: { type: 'customer_question' },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your question has been submitted! You\'ll be notified when it\'s answered.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please enter a valid question (at least 10 characters).' }, { status: 400 });
    }
    console.error('Question submission error:', error);
    return NextResponse.json({ error: 'Failed to submit question' }, { status: 500 });
  }
}
