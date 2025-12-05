import { NextRequest, NextResponse } from 'next/server';
import { generateBatchContent, BatchGenerationRequest } from '@/lib/ai-content-generator';

/**
 * Batch AI Content Generation API
 * Generates content for multiple sections at once
 */
export async function POST(request: NextRequest) {
  try {
    const body: BatchGenerationRequest = await request.json();

    const { businessName, industry } = body;

    // Validate required fields
    if (!businessName || !industry) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: businessName and industry'
        },
        { status: 400 }
      );
    }

    // Generate all content types
    const content = await generateBatchContent(body);

    return NextResponse.json({
      success: true,
      data: content,
      message: 'Content generated successfully',
    });
  } catch (error) {
    console.error('Error in batch content generation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate content'
      },
      { status: 500 }
    );
  }
}
