import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/ads - Get all ads for admin
export async function GET(request: NextRequest) {
  try {
    // Dynamic demo data with microsite links and executive info
    const ads = [
      {
        id: '1',
        title: 'Premium Dining Experience - 20% Off',
        description: 'Authentic Italian cuisine with fresh ingredients',
        category: 'Restaurant',
        city: 'Mumbai',
        area: 'Bandra West',
        status: 'ACTIVE',
        impressions: 1250,
        clicks: 45,
        ctr: '3.6%',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        budget: 5000,
        spent: 1800,
        brand: { 
          id: 'brand1',
          name: 'Bella Vista Restaurant',
          slug: 'bella-vista',
          logo: '/images/restaurant-logo.jpg'
        },
        executive: { 
          id: 'exec1',
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'rajesh@parichay.co'
        },
        micrositeUrl: 'http://localhost:3000/bella-vista',
        targetAudience: 'Food lovers, couples, families',
        adPlacement: ['AdSection - Bottom of microsites']
      },
      {
        id: '2',
        title: 'Hair & Beauty Makeover - Book Now',
        description: 'Professional styling and beauty treatments',
        category: 'Salon',
        city: 'Delhi',
        area: 'Connaught Place',
        status: 'PAUSED',
        impressions: 890,
        clicks: 23,
        ctr: '2.6%',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        budget: 3000,
        spent: 750,
        brand: { 
          id: 'brand2',
          name: 'Glamour Beauty Salon',
          slug: 'glamour-salon',
          logo: '/images/salon-logo.jpg'
        },
        executive: { 
          id: 'exec2',
          name: 'Priya Sharma',
          phone: '+91 87654 32109',
          email: 'priya@parichay.co'
        },
        micrositeUrl: 'http://localhost:3000/glamour-salon',
        targetAudience: 'Women 18-45, beauty enthusiasts',
        adPlacement: ['AdSection - Bottom of microsites']
      },
      {
        id: '3',
        title: 'Fitness Training - Join Today',
        description: 'Personal training and group fitness classes',
        category: 'Gym',
        city: 'Bangalore',
        area: 'Koramangala',
        status: 'ACTIVE',
        impressions: 2100,
        clicks: 89,
        ctr: '4.2%',
        start_date: '2024-01-15',
        end_date: '2024-12-31',
        budget: 8000,
        spent: 3200,
        brand: { 
          id: 'brand3',
          name: 'FitZone Gym',
          slug: 'fitzone-gym',
          logo: '/images/gym-logo.jpg'
        },
        executive: { 
          id: 'exec1',
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'rajesh@parichay.co'
        },
        micrositeUrl: 'http://localhost:3000/fitzone-gym',
        targetAudience: 'Fitness enthusiasts, professionals',
        adPlacement: ['AdSection - Bottom of microsites']
      },
      {
        id: '4',
        title: 'Medical Consultation - Book Appointment',
        description: 'Expert healthcare services and consultations',
        category: 'Clinic',
        city: 'Chennai',
        area: 'T. Nagar',
        status: 'ACTIVE',
        impressions: 1680,
        clicks: 67,
        ctr: '4.0%',
        start_date: '2024-02-01',
        end_date: '2024-12-31',
        budget: 6000,
        spent: 2400,
        brand: { 
          id: 'brand4',
          name: 'HealthCare Plus Clinic',
          slug: 'healthcare-plus',
          logo: '/images/clinic-logo.jpg'
        },
        executive: { 
          id: 'exec3',
          name: 'Dr. Amit Patel',
          phone: '+91 76543 21098',
          email: 'amit@parichay.co'
        },
        micrositeUrl: 'http://localhost:3000/healthcare-plus',
        targetAudience: 'Patients, health-conscious individuals',
        adPlacement: ['AdSection - Bottom of microsites']
      }
    ];

    return NextResponse.json({ ads });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}