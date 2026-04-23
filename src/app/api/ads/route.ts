import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ads - Get targeted ads for a brand page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '3');

    const ads = await prisma.ad.findMany({
      where: {
        status: 'ACTIVE',
        category: category || undefined,
        city: city || undefined,
        start_date: { lte: new Date() },
        end_date: { gte: new Date() },
      },
      include: {
        brand: { select: { name: true, logo: true } },
        executive: { select: { name: true } },
      },
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ ads });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

// POST /api/ads - Create new ad
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const ad = await prisma.ad.create({
      data: {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
      },
    });

    return NextResponse.json({ ad });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}