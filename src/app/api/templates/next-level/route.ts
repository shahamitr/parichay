import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple response to test if the API works
    return NextResponse.json({
      success: true,
      message: 'Next-level templates API is working',
      data: {
        templates: [],
        categories: [],
        differentiators: {},
        meta: {
          total: 0,
          phases: { 1: 0, 2: 0, 3: 0, 4: 0 },
          trending: 0
        }
      }
    });

  } catch (error) {
    console.error('Error in next-level templates API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    return NextResponse.json({
      success: true,
      message: `Action ${action} received`,
      data: {}
    });

  } catch (error) {
    console.error('Error processing template request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}