/**
 * Response Time Badge API
 * GET /api/brands/[id]/response-badge — Get the response time badge for a brand
 *
 * Used by the microsite renderer to show "Usually responds within 1 hour" badge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getResponseBadge } from '@/lib/response-time';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: brandId } = await params;

    const badge = await getResponseBadge(brandId);

    if (!badge) {
      return NextResponse.json({ badge: null });
    }

    return NextResponse.json({
      badge: {
        label: badge.label,
        emoji: badge.emoji,
        tier: badge.tier,
        avgMinutes: badge.minutes,
      },
    });
  } catch (error) {
    return NextResponse.json({ badge: null });
  }
}
