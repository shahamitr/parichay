/**
 * Public Client Logos API
 * GET /api/public/client-logos - Get published client logos for landing page
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const logos = await prisma.landingClientLogo.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
      },
    });

    // Fallback logos if none in database
    if (logos.length === 0) {
      return NextResponse.json({
        success: true,
        logos: [
          { id: '1', name: 'TechStart', logoUrl: null, websiteUrl: null },
          { id: '2', name: 'Creative Minds', logoUrl: null, websiteUrl: null },
          { id: '3', name: 'Growth Partners', logoUrl: null, websiteUrl: null },
          { id: '4', name: 'HealthFirst', logoUrl: null, websiteUrl: null },
          { id: '5', name: 'Prime Properties', logoUrl: null, websiteUrl: null },
        ],
        fromFallback: true,
      });
    }

    return NextResponse.json({
      success: true,
      logos,
    });
  } catch (error) {
    console.error('Error fetching client logos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client logos' },
      { status: 500 }
    );
  }
}
