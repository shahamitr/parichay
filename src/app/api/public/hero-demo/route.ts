import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return demo data for the hero section
    const demoData = {
      name: 'Sarah Johnson',
      initials: 'SJ',
      role: 'Marketing Director',
      email: 'sarah@techstart.io',
      phone: '+91 98765 43210',
      website: 'www.techstart.io',
      avatarUrl: null, // Will use initials instead
      brandSlug: null, // No real brand link for demo
      branchSlug: null
    };

    return NextResponse.json({
      success: true,
      demo: demoData
    });
  } catch (error) {
    console.error('Error in hero demo API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch demo data' },
      { status: 500 }
    );
  }
}