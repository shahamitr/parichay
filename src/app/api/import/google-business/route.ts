import { NextRequest, NextResponse } from 'next/server';
import {
  extractPlaceIdFromUrl,
  fetchGoogleBusinessData,
  transformToMicrositeData,
  getMockGoogleBusinessData,
} from '@/lib/google-business-extractor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, placeId, useMockData } = body;

    // For development/testing, allow mock data
    if (useMockData != null) {
      const mockData = getMockGoogleBusinessData(body.businessName || 'Demo Business');
      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'mock',
      });
    }

    // Extract place ID from URL if provided
    let extractedPlaceId = placeId;
    if (url && !extractedPlaceId) {
      extractedPlaceId = extractPlaceIdFromUrl(url);
    }

    if (!extractedPlaceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not extract place ID from URL. Please provide a valid Google Maps URL or place ID.'
        },
        { status: 400 }
      );
    }

    // Get Google API key from environment
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.warn('Google Places API key not configured, using mock data');
      const mockData = getMockGoogleBusinessData();
      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'mock',
        warning: 'Google Places API key not configured',
      });
    }

    // Fetch data from Google Places API
    const googleData = await fetchGoogleBusinessData(extractedPlaceId, apiKey);

    if (!googleData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch business data from Google Places API'
        },
        { status: 404 }
      );
    }

    // Transform to our microsite format
    const micrositeData = transformToMicrositeData(googleData, apiKey);

    return NextResponse.json({
      success: true,
      data: micrositeData,
      source: 'google',
    });
  } catch (error) {
    console.error('Error in Google Business import:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import business data'
      },
      { status: 500 }
    );
  }
}
