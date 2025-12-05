import { NextRequest, NextResponse } from 'next/server';
import {
  ContentGenerationRequest,
  generateContent,
  getPlaceholderContent
} from '@/lib/ai-content-generator';

/**
 * AI Content Generation API Endpoint
 * Generates content for various microsite sections
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json();

    const { type, businessName } = body;

    // Validate required fields
    if (!type || !businessName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type and businessName' },
        { status: 400 }
      );
    }

    // Generate content using the AI service
    const result = await generateContent(body);

    return NextResponse.json({
      success: true,
      content: result.content,
      alternatives: result.alternatives,
      confidence: result.confidence,
    });
  } catch (error) {
    console.error('Error in AI content generation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate content'
      },
      { status: 500 }
    );
  }
}

// All content generation logic has been moved to @/lib/ai-content-generator
// This API now acts as a thin wrapper around the service
