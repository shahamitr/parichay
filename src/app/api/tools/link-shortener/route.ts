import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customSlug } = body;

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate short code
    const shortCode = customSlug || Math.random().toString(36).substring(2, 8);
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/s/${shortCode}`;

    // In a real app, you would save to database
    // const shortLink = await db.shortLink.create({
    //   data: {
    //     originalUrl: url,
    //     shortCode,
    //     customSlug,
    //     userId: user.id,
    //     clicks: 0
    //   }
    // });

    return NextResponse.json({
      success: true,
      shortUrl,
      shortCode,
      originalUrl: url,
      clicks: 0,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to create short link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create short link' },
      { status: 500 }
    );
  }
}