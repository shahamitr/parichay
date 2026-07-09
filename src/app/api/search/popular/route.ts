/**
 * Popular Searches API
 * GET /api/search/popular - Returns top searched queries
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fallback static list when insufficient real data exists
const DEFAULT_POPULAR_SEARCHES = [
  'Dentist',
  'Salon',
  'Restaurant',
  'Plumber',
  'Gym',
  'Doctor',
  'Lawyer',
  'Tutor',
  'Photographer',
  'Electrician',
];

export async function GET() {
  try {
    // Attempt to get real aggregated search data
    const searchEvents = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'SEARCH_QUERY',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: {
        metadata: true,
      },
    });

    // Aggregate search queries
    const queryCounts: Record<string, number> = {};
    for (const event of searchEvents) {
      const metadata = event.metadata as { query?: string } | null;
      const query = metadata?.query?.trim().toLowerCase();
      if (query && query.length >= 2) {
        queryCounts[query] = (queryCounts[query] || 0) + 1;
      }
    }

    // Sort by frequency and get top 10
    const sortedQueries = Object.entries(queryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query]) => query.charAt(0).toUpperCase() + query.slice(1));

    // Use real data if we have enough (at least 5 unique queries), otherwise fallback
    const popularSearches =
      sortedQueries.length >= 5 ? sortedQueries : DEFAULT_POPULAR_SEARCHES;

    return NextResponse.json({
      success: true,
      searches: popularSearches,
      isRealData: sortedQueries.length >= 5,
    });
  } catch (error) {
    console.error('Error fetching popular searches:', error);

    // Graceful fallback to static list
    return NextResponse.json({
      success: true,
      searches: DEFAULT_POPULAR_SEARCHES,
      isRealData: false,
    });
  }
}
