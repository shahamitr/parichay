import { NextRequest, NextResponse } from 'next/server';
import { layoutOptions } from '@/data/layout-options';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      layouts: layoutOptions
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch layouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, sections, spacing, containerWidth } = body;

    const newLayout = {
      id: `custom-${Date.now()}`,
      name,
      description,
      preview: '/layouts/custom.jpg',
      sections,
      spacing,
      containerWidth
    };

    return NextResponse.json({
      success: true,
      layout: newLayout,
      message: 'Layout created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create layout' },
      { status: 500 }
    );
  }
}