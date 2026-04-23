/**
 * Public Features API
 * GET /api/public/features - Get published features for landing page
 * OPTIMIZED: Added caching and reduced database queries
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cache, cacheKeys } from '@/lib/cache';

// Default features fallback
const DEFAULT_FEATURES = [
  {
    id: 'default-1',
    title: 'Mobile-First Design',
    description: 'Perfectly optimized for all devices. Your card looks stunning on any screen.',
    icon: 'smartphone',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    id: 'default-2',
    title: 'Instant Setup',
    description: 'Create your professional digital business card in under 5 minutes.',
    icon: 'zap',
    gradient: 'from-accent-500 to-accent-600',
  },
  {
    id: 'default-3',
    title: 'Easy Sharing',
    description: 'Share via QR code, link, email, or social media with one tap.',
    icon: 'share2',
    gradient: 'from-success-500 to-success-600',
  },
  {
    id: 'default-4',
    title: 'Analytics Dashboard',
    description: 'Track views, clicks, and engagement with detailed analytics.',
    icon: 'barChart3',
    gradient: 'from-accent-500 to-error-500',
  },
  {
    id: 'default-5',
    title: 'Custom Branding',
    description: 'Personalize colors, fonts, and layouts to match your brand identity.',
    icon: 'palette',
    gradient: 'from-accent-500 to-accent-600',
  },
  {
    id: 'default-6',
    title: 'Dynamic QR Codes',
    description: 'Generate custom QR codes that link directly to your digital card.',
    icon: 'qrCode',
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    id: 'default-7',
    title: 'Custom Domain',
    description: 'Use your own domain name for a professional web presence.',
    icon: 'globe',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    id: 'default-8',
    title: 'Secure & Private',
    description: 'Enterprise-grade security to protect your data and privacy.',
    icon: 'lock',
    gradient: 'from-neutral-600 to-neutral-800',
  },
  {
    id: 'default-9',
    title: 'Lead Capture',
    description: 'Collect inquiries and feedback directly from your digital card.',
    icon: 'messageSquare',
    gradient: 'from-warning-500 to-accent-500',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Check cache first (10 minute TTL for features)
    const cacheKey = cacheKeys.features();
    const cachedData = cache.get<{ success: boolean; features: any[] }>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Optimized query - only select needed fields
    const features = await prisma.landingFeature.findMany({
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

    // Return default features if none in database
    if (features.length === 0) {
      response = { success: true, features: DEFAULT_FEATURES };
    } else {
      response = { success: true, features };
    }

    // Cache for 10 minutes (features don't change often)
    cache.set(cacheKey, response, 600);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching features:', error);

    // Return default features on error
    const fallbackResponse = { success: true, features: DEFAULT_FEATURES };

    // Cache fallback for 1 minute only
    cache.set(cacheKey, fallbackResponse, 60);
    return NextResponse.json(fallbackResponse);
  }
}
