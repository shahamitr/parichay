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
  return R * c; // Distance in kilometers
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const radius = parseInt(searchParams.get('radius') || '10'); // Default 10km
        const category = searchParams.get('category') || '';
        const businessType = searchParams.get('businessType') || '';
        const priceRange = searchParams.get('priceRange') || '';
        const limit = parseInt(searchParams.get('limit') || '20');
        const isPublic = searchParams.get('public') === 'true';

        // Build where clause
        const whereClause: any = {
          isActive: true
        };

        // Only show public branches for public API
        if (isPublic) {
          whereClause.visibility = 'public';
        }

        // Text search
        if (query.length >= 2) {
          whereClause.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { brand: { name: { contains: query, mode: 'insensitive' } } },
            {
              serviceCategories: {
                path: '$',
                array_contains: query
              }
            }
          ];
        }

        // Category filter
        if (category) {
          whereClause.serviceCategories = {
            path: '$',
            array_contains: category
          };
        }

        // Business type filter
        if (businessType) {
          whereClause.businessType = businessType;
        }

        // Price range filter
        if (priceRange) {
          whereClause.priceRange = priceRange;
        }

        // Get branches
        const branches = await prisma.branch.findMany({
            where: whereClause,
            take: limit * 2, // Get more to filter by distance
            select: {
              id: true,
              name: true,
              slug: true,
              latitude: true,
              longitude: true,
              serviceCategories: true,
              businessType: true,
              priceRange: true,
              avgServicePrice: true,
              address: true,
              contact: true,
              businessHours: true,
              isVerified: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  slug: true,
                  isVerified: true,
                  verificationBadge: true
                }
              },
              reviews: {
                where: { isPublished: true },
                select: {
                  rating: true
                }
              },
              _count: {
                select: {
                  reviews: {
                    where: { isPublished: true }
                  }
                }
              }
            },
        });

        // Calculate distances and filter by radius if location provided
        let results = branches.map(branch => {
          let distance = null;

          if (lat && lng && branch.latitude && branch.longitude) {
            distance = calculateDistance(
              parseFloat(lat),
              parseFloat(lng),
              branch.latitude,
              branch.longitude
            );
          }

          // Calculate average rating
          const avgRating = branch.reviews.length > 0
            ? branch.reviews.reduce((sum, review) => sum + review.rating, 0) / branch.reviews.length
            : 0;

          return {
            id: branch.id,
            name: branch.name,
            slug: branch.slug,
            businessType: branch.businessType,
            serviceCategories: branch.serviceCategories,
            priceRange: branch.priceRange,
            avgServicePrice: branch.avgServicePrice,
            address: branch.address,
            contact: branch.contact,
            businessHours: branch.businessHours,
            isVerified: branch.isVerified,
            distance: distance ? Math.round(distance * 10) / 10 : null, // Round to 1 decimal
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: branch._count.reviews,
            brand: branch.brand,
            url: isPublic ? `/business/${branch.brand.slug}/${branch.slug}` : `/admin/branches/${branch.id}`
          };
        });

        // Filter by radius if location provided
        if (lat && lng) {
          results = results.filter(branch =>
            branch.distance === null || branch.distance <= radius
          );

          // Sort by distance
          results.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
        } else {
          // Sort by rating if no location
          results.sort((a, b) => b.rating - a.rating);
        }

        // Limit results
        results = results.slice(0, limit);

        // Add search metadata
        const metadata = {
          total: results.length,
          hasLocation: !!(lat && lng),
          radius: radius,
          query: query,
          category: category,
          businessType: businessType,
          priceRange: priceRange
        };

        return NextResponse.json({
          results,
          metadata,
          success: true
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({
          error: 'Search failed',
          success: false
        }, { status: 500 });
    }
}

