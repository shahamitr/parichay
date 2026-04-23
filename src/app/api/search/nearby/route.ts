import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseInt(searchParams.get('radius') || '10'); // Default 10km
    const category = searchParams.get('category');
    const businessType = searchParams.get('businessType');
    const priceRange = searchParams.get('priceRange');
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!lat || !lng) {
      return NextResponse.json({
        error: 'Location coordinates are required'
      }, { status: 400 });
    }

    // Build where clause
    const whereClause: any = {
      isActive: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    // Add filters
    if (category) {
      whereClause.serviceCategories = {
        path: '$',
        array_contains: category
      };
    }

    if (businessType) {
      whereClause.businessType = businessType;
    }

    if (priceRange) {
      whereClause.priceRange = priceRange;
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { name: { contains: query, mode: 'insensitive' } } }
      ];
    }

    // Get branches with location data
    const branches = await prisma.branch.findMany({
      where: {
        ...whereClause,
        latitude: { not: null },
        longitude: { not: null }
      },
      include: {
        brand: {
          select: {
            name: true,
            isVerified: true,
            verificationBadge: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            appointments: true
          }
        }
      }
    });

    // Calculate distances and filter by radius
    const branchesWithDistance = branches
      .map(branch => {
        const distance = calculateDistance(
          lat, lng,
          branch.latitude!,
          branch.longitude!
        );

        // Calculate average rating
        const avgRating = branch.reviews.length > 0
          ? branch.reviews.reduce((sum, review) => sum + review.rating, 0) / branch.reviews.length
          : 0;

        return {
          id: branch.id,
          name: branch.name,
          slug: branch.slug,
          brand: branch.brand,
          address: branch.address,
          contact: branch.contact,
          socialMedia: branch.socialMedia,
          businessHours: branch.businessHours,
          serviceCategories: branch.serviceCategories,
          businessType: branch.businessType,
          priceRange: branch.priceRange,
          avgServicePrice: branch.avgServicePrice,
          latitude: branch.latitude,
          longitude: branch.longitude,
          distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: branch._count.reviews,
          appointmentCount: branch._count.appointments,
          isVerified: branch.brand.isVerified,
          verificationBadge: branch.brand.verificationBadge
        };
      })
      .filter(branch => branch.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      results: branchesWithDistance,
      total: branchesWithDistance.length,
      searchParams: {
        lat,
        lng,
        radius,
        category,
        businessType,
        priceRange,
        query
      }
    });

  } catch (error) {
    console.error('Nearby search error:', error);
    return NextResponse.json({
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
