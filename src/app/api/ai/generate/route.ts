// @ts-nocheck
/**
 * AI Content Generation API
 * POST /api/ai/generate - Generate AI content
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-utils';
import { generateAIContent, generateMicrositeContent, improveContent } from '@/lib/ai/ai-content-service';
import { prisma } from '@/lib/prisma';

const generateSchema = z.object({
  type: z.enum(['headline', 'tagline', 'about', 'service', 'seo', 'social', 'email', 'cta', 'microsite', 'improve']),
  context: z.object({
    businessName: z.string(),
    industry: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tone: z.enum(['professional', 'friendly', 'persuasive', 'casual', 'witty']).optional(),
    length: z.enum(['short', 'medium', 'long']).optional(),
    targetAudience: z.string().optional(),
    uniqueSellingPoint: z.string().optional(),
  }),
  variations: z.number().min(1).max(10).optional(),
  serviceName: z.string().optional(),
  platform: z.enum(['facebook', 'instagram', 'linkedin', 'twitter']).optional(),
  emailPurpose: z.string().optional(),
  ctaGoal: z.string().optional(),
  content: z.string().optional(), // For improve type
  improvementType: z.enum(['clarity', 'engagement', 'seo', 'brevity', 'professionalism']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if AI is enabled
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI features are not enabled' },
        { status: 503 }
      );
    }

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    // Parse and validate request
    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    // Check user's AI usage limits
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        brand: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        },
      },
    });

    if (!userWithSubscription?.brand?.subscription) {
      return NextResponse.json(
        { error: 'Active subscription required for AI features' },
        { status: 403 }
      );
    }

    // Get AI usage limits from subscription plan
    const planFeatures = userWithSubscription.brand.subscription.plan.features as any;
    const aiLimit = planFeatures?.aiGenerations || 10; // Default 10 for free plan

    // Check current month usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usageCount = await prisma.analyticsEvent.count({
      where: {
        eventType: 'AI_GENERATION',
        brandId: user.brandId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (usageCount >= aiLimit) {
      return NextResponse.json(
        {
          error: 'AI generation limit reached',
          limit: aiLimit,
          used: usageCount,
          message: 'Upgrade your plan for more AI generations',
        },
        { status: 429 }
      );
    }

    // Generate content based on type
    let result;

    if (validatedData.type === 'microsite') {
      result = await generateMicrositeContent(validatedData.context);
    } else if (validatedData.type === 'improve') {
      if (!validatedData.content || !validatedData.improvementType) {
        return NextResponse.json(
          { error: 'Content and improvement type required' },
          { status: 400 }
        );
      }
      const improved = await improveContent(validatedData.content, validatedData.improvementType);
      result = { variations: [improved] };
    } else {
      result = await generateAIContent({
        type: validatedData.type,
        context: validatedData.context,
        variations: validatedData.variations,
        serviceName: validatedData.serviceName,
        platform: validatedData.platform,
        emailPurpose: validatedData.emailPurpose,
        ctaGoal: validatedData.ctaGoal,
      });
    }

    // Track AI usage
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'AI_GENERATION',
        brandId: user.brandId,
        metadata: {
          type: validatedData.type,
          userId: user.id,
          tokensUsed: result.usage?.totalTokens || 0,
        },
      },
    });

    return NextResponse.json({
      success: true,
      ...result,
      usage: {
        current: usageCount + 1,
        limit: aiLimit,
        remaining: aiLimit - usageCount - 1,
      },
    });
  } catch (error) {
    console.error('AI generation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}

// GET - Check AI availability and usage
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    // Check if AI is enabled
    const aiEnabled = !!process.env.OPENAI_API_KEY;

    if (!aiEnabled) {
      return NextResponse.json({
        available: false,
        message: 'AI features are not configured',
      });
    }

    // Get user's subscription and limits
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        brand: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        },
      },
    });

    const planFeatures = userWithSubscription?.brand?.subscription?.plan.features as any;
    const aiLimit = planFeatures?.aiGenerations || 10;

    // Get current month usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usageCount = await prisma.analyticsEvent.count({
      where: {
        eventType: 'AI_GENERATION',
        brandId: user.brandId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    return NextResponse.json({
      available: true,
      usage: {
        current: usageCount,
        limit: aiLimit,
        remaining: Math.max(0, aiLimit - usageCount),
        resetDate: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1),
      },
      features: {
        headline: true,
        tagline: true,
        about: true,
        service: true,
        seo: true,
        social: true,
        email: true,
        cta: true,
        microsite: true,
        improve: true,
      },
    });
  } catch (error) {
    console.error('AI status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check AI status' },
      { status: 500 }
    );
  }
}
