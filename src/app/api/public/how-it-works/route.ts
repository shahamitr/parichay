/**
 * Public How It Works API
 * GET /api/public/how-it-works - Get published steps for landing page
 * OPTIMIZED: Added caching and reduced database queries
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cache, cacheKeys } from '@/lib/cache';

// Default steps fallback
const DEFAULT_STEPS = [
  {
    id: 'default-1',
    title: 'Sign Up Free',
    description: 'Create your account in seconds. No credit card required.',
    icon: 'userPlus',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    id: 'default-2',
    title: 'Customize Your Card',
    description: 'Choose a template, add your info, and personalize your design.',
    icon: 'edit3',
    gradient: 'from-accent-500 to-accent-600',
  },
  {
    id: 'default-3',
    title: 'Share Instantly',
    description: 'Share via QR code, link, or social media with one click.',
    icon: 'share2',
    gradient: 'from-success-500 to-success-600',
  },
  {
    id: 'default-4',
    title: 'Track & Grow',
    description: 'Monitor engagement and grow your professional network.',
    icon: 'trendingUp',
    gradient: 'from-accent-500 to-accent-600',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Check cache first (10 minute TTL for steps)
    const cacheKey = cacheKeys.howItWorks();
    const cachedData = cache.get<{ success: boolean; steps: any[] }>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Optimized query - only select needed fields
    const steps = await prisma.howItWorksStep.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        gradient: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    let response;

    // Return default steps if none in database
    if (steps.length === 0) {
      response = { success: true, steps: DEFAULT_STEPS };
    } else {
      response = { success: true, steps };
    }

    // Cache for 10 minutes (steps don't change often)
    cache.set(cacheKey, response, 600);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching how it works steps:', error);

    // Return default steps on error
    const fallbackResponse = { success: true, steps: DEFAULT_STEPS };

    // Cache fallback for 1 minute only
    cache.set(cacheKey, fallbackResponse, 60);
    return NextResponse.json(fallbackResponse);
  }
}
