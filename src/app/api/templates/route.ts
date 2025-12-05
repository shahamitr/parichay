import { NextRequest, NextResponse } from 'next/server';
import { micrositeTemplates } from '@/data/templates';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    let templates = micrositeTemplates;

    // Filter by category if provided
    if (categoryId != null) {
      templates = templates.filter(template => template.categoryId === categoryId);
    }

    return NextResponse.json({
      templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
