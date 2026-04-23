import { NextRequest, NextResponse } from 'next/server';
import { themeOptions } from '@/data/theme-options';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      themes: themeOptions
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, colors, gradients, typography, effects } = body;

    const newTheme = {
      id: `custom-${Date.now()}`,
      name,
      description,
      category,
      preview: '/themes/custom.jpg',
      colors,
      gradients,
      typography,
      effects
    };

    return NextResponse.json({
      success: true,
      theme: newTheme,
      message: 'Theme created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}