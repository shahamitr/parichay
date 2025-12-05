import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET() {
  try {
    // Check Redis connection
    const redis = getRedisClient();
    if (!redis) {
      throw new Error('Redis not configured');
    }
    await redis.ping();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'redis',
      message: 'Redis connection successful',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'redis',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
