import { NextRequest, NextResponse } from 'next/server';
import { getUsageStats, getSubscriptionLimits } from '@/lib/subscription-limits';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { error: 'brandId is required' },
        { status: 400 }
      );
    }

    const [usage, limits] = await Promise.all([
      getUsageStats(brandId),
      getSubscriptionLimits(brandId),
    ]);

    return NextResponse.json({
      usage,
      limits,
    });
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    );
  }
}
