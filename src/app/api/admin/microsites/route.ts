import { NextRequest, NextResponse } from 'next/server';

// Mock microsites data
const mockMicrosites = [
  {
    id: '1',
    slug: 'main-branch',
    title: 'OneTouchBizCard Main Branch',
    description: 'Professional digital business cards and networking solutions',
    isActive: true,
    customDomain: null,
    theme: 'modern',
    views: 12450,
    leads: 234,
    lastUpdated: '2024-01-18T10:30:00Z',
    branch: {
      id: 'branch1',
      name: 'Main Branch',
      brand: {
        id: 'brand1',
        name: 'OneTouchBizCard',
        slug: 'onetouchbizcard'
      }
    },
    features: {
      appointments: true,
      gallery: true,
      testimonials: true,
      products: false,
      services: true
    }
  },
  {
    id: '2',
    slug: 'downtown-office',
    title: 'Downtown Office - Creative Studio',
    description: 'Modern creative services and design solutions',
    isActive: true,
    customDomain: 'creative.example.com',
    theme: 'vibrant',
    views: 8920,
    leads: 156,
    lastUpdated: '2024-01-17T14:15:00Z',
    branch: {
      id: 'branch2',
      name: 'Downtown Office',
      brand: {
        id: 'brand2',
        name: 'Creative Studio',
        slug: 'creative-studio'
      }
    },
    features: {
      appointments: false,
      gallery: true,
      testimonials: true,
      products: true,
      services: true
    }
  },
  {
    id: '3',
    slug: 'tech-hub',
    title: 'Tech Hub - Innovation Center',
    description: 'Technology solutions and software development',
    isActive: false,
    customDomain: null,
    theme: 'professional',
    views: 5640,
    leads: 89,
    lastUpdated: '2024-01-16T09:45:00Z',
    branch: {
      id: 'branch3',
      name: 'Tech Hub',
      brand: {
        id: 'brand3',
        name: 'Innovation Center',
        slug: 'innovation-center'
      }
    },
    features: {
      appointments: true,
      gallery: false,
      testimonials: true,
      products: true,
      services: true
    }
  },
  {
    id: '4',
    slug: 'wellness-center',
    title: 'Wellness Center - Health & Fitness',
    description: 'Complete wellness and fitness solutions',
    isActive: true,
    customDomain: null,
    theme: 'minimal',
    views: 15680,
    leads: 342,
    lastUpdated: '2024-01-15T16:20:00Z',
    branch: {
      id: 'branch4',
      name: 'Wellness Center',
      brand: {
        id: 'brand4',
        name: 'Health & Fitness',
        slug: 'health-fitness'
      }
    },
    features: {
      appointments: true,
      gallery: true,
      testimonials: true,
      products: false,
      services: true
    }
  },
  {
    id: '5',
    slug: 'restaurant-branch',
    title: 'Bella Vista Restaurant',
    description: 'Authentic Italian cuisine with fresh ingredients',
    isActive: true,
    customDomain: 'bellavista.restaurant',
    theme: 'classic',
    views: 22340,
    leads: 456,
    lastUpdated: '2024-01-14T11:10:00Z',
    branch: {
      id: 'branch5',
      name: 'Main Restaurant',
      brand: {
        id: 'brand5',
        name: 'Bella Vista',
        slug: 'bella-vista'
      }
    },
    features: {
      appointments: true,
      gallery: true,
      testimonials: true,
      products: true,
      services: false
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from database
    // const microsites = await db.microsite.findMany({
    //   include: {
    //     branch: {
    //       include: {
    //         brand: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     lastUpdated: 'desc'
    //   }
    // });

    return NextResponse.json({
      success: true,
      microsites: mockMicrosites
    });
  } catch (error) {
    console.error('Failed to fetch microsites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch microsites' },
      { status: 500 }
    );
  }
}