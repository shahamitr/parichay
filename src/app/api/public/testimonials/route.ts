import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/public/testimonials - Get published testimonials for landing page
export async function GET() {
  try {
    // Try to fetch from database
    let testimonials: any[] = [];

    try {
      testimonials = await (prisma as any).landingTestimonial?.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }) || [];
    } catch (dbError) {
      // Table might not exist yet, use fallback
      console.log('LandingTestimonial table not found, using fallback data');
    }

    // If no testimonials in DB, return fallback data
    if (testimonials.length === 0) {
      testimonials = [
        {
          id: '1',
          name: 'Rajesh Kumar',
          role: 'CEO & Founder',
          company: 'TechStart Solutions',
          avatar: null,
          content: 'Parichay has transformed how we share business information. Our team loves the instant sharing feature and the analytics help us track engagement.',
          rating: 5,
        },
        {
          id: '2',
          name: 'Priya Sharma',
          role: 'Marketing Director',
          company: 'Creative Minds Agency',
          avatar: null,
          content: 'The custom branding options are fantastic! We can maintain our brand identity across all our digital cards. Highly recommended for agencies.',
          rating: 5,
        },
        {
          id: '3',
          name: 'Amit Patel',
          role: 'Sales Head',
          company: 'Growth Partners',
          avatar: null,
          content: 'Lead capture has never been easier. The QR code scanning feature helps us collect contacts at events seamlessly. Great ROI!',
          rating: 5,
        },
        {
          id: '4',
          name: 'Dr. Meera Reddy',
          role: 'Clinic Director',
          company: 'HealthFirst Clinics',
          avatar: null,
          content: 'Perfect for healthcare professionals. Our patients can easily access our contact info and book appointments through the microsite.',
          rating: 5,
        },
        {
          id: '5',
          name: 'Vikram Singh',
          role: 'Real Estate Consultant',
          company: 'Prime Properties',
          avatar: null,
          content: 'The property showcase feature on microsites has helped me close more deals. Clients love the professional presentation.',
          rating: 5,
        },
        {
          id: '6',
          name: 'Sneha Gupta',
          role: 'Restaurant Owner',
          company: 'Spice Garden',
          avatar: null,
          content: 'Our digital menu and contact card have reduced printing costs and improved customer engagement. The analytics are very insightful.',
          rating: 5,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      testimonials,
      source: testimonials.length > 0 && testimonials[0].createdAt ? 'database' : 'fallback',
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
