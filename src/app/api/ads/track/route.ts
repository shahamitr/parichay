import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/ads/track - Track ad impressions and clicks
export async function POST(request: NextRequest) {
  try {
    const { adId, brandId, type, userAgent } = await request.json();
    const viewerIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    if (type === 'impression') {
      await prisma.adImpression.create({
        data: { adId, brandId, viewerIp, userAgent },
      });
      
      await prisma.ad.update({
        where: { id: adId },
        data: { impressions: { increment: 1 } },
      });
    } else if (type === 'click') {
      await prisma.adClick.create({
        data: { adId, brandId, viewerIp, userAgent },
      });
      
      await prisma.ad.update({
        where: { id: adId },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track ad' }, { status: 500 });
  }
}