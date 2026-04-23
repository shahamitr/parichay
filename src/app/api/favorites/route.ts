import { NextResponse } from 'next/server';

// Simple in-memory storage for demo (in production, use database with user sessions)
const favoriteStore = new Map<string, string[]>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'anonymous';

    const favorites = favoriteStore.get(sessionId) || [];

    return NextResponse.json({
      favorites,
      success: true
    });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({
      error: 'Failed to get favorites',
      success: false
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { businessId, sessionId = 'anonymous' } = await request.json();

    if (!businessId) {
      return NextResponse.json({
        error: 'Business ID is required',
        success: false
      }, { status: 400 });
    }

    const favorites = favoriteStore.get(sessionId) || [];

    if (!favorites.includes(businessId)) {
      favorites.push(businessId);
      favoriteStore.set(sessionId, favorites);
    }

    return NextResponse.json({
      favorites,
      success: true
    });
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({
      error: 'Failed to add favorite',
      success: false
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const sessionId = searchParams.get('sessionId') || 'anonymous';

    if (!businessId) {
      return NextResponse.json({
        error: 'Business ID is required',
        success: false
      }, { status: 400 });
    }

    const favorites = favoriteStore.get(sessionId) || [];
    const updatedFavorites = favorites.filter(id => id !== businessId);
    favoriteStore.set(sessionId, updatedFavorites);

    return NextResponse.json({
      favorites: updatedFavorites,
      success: true
    });
  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({
      error: 'Failed to remove favorite',
      success: false
    }, { status: 500 });
  }
}