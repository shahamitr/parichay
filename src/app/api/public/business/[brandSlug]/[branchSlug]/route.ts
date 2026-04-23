import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { brandSlug: string; branchSlug: string } }
) {
  try {
    const { brandSlug, branchSlug } = params;

    // Find the branch with all related data
    const branch = await prisma.branch.findFirst({
      where: {
        slug: branchSlug,
        brand: {
          slug: brandSlug
        },
        isActive: true,
        visibility: 'public' // Only show public branches
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            tagline: true,
            isVerified: true,
            verificationBadge: true
          }
        },
        reviews: {
          where: {
            isPublished: true
          },
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            reviewerName: true,
            reviewerAvatar: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        portfolioItems: {
          where: {
            isPublished: true
          },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            videoUrl: true,
            projectUrl: true,
            clientName: true,
            completedAt: true,
            tags: true
          },
          orderBy: [
            { featured: 'desc' },
            { order: 'asc' },
            { createdAt: 'desc' }
          ],
          take: 12
        },
        offers: {
          where: {
            isActive: true,
            startDate: {
              lte: new Date()
            },
            endDate: {
              gte: new Date()
            }
          },
          select: {
            id: true,
            title: true,
            description: true,
            code: true,
            discountType: true,
            discountValue: true,
            minPurchase: true,
            maxDiscount: true,
            imageUrl: true,
            endDate: true,
            terms: true
          },
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        serviceSlots: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
            currency: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        },
        socialProofBadges: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            icon: true,
            color: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        },
        videoTestimonials: {
          where: {
            isPublished: true
          },
          select: {
            id: true,
            title: true,
            description: true,
            videoUrl: true,
            thumbnailUrl: true,
            customerName: true,
            customerTitle: true,
            customerAvatar: true,
            duration: true
          },
          orderBy: {
            order: 'asc'
          },
          take: 6
        },
        voiceIntro: {
          select: {
            id: true,
            audioUrl: true,
            duration: true,
            transcript: true
          }
        }
      }
    });

    if (!branch) {
      return NextResponse.json({
        error: 'Business not found',
        success: false
      }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = branch.reviews.length > 0
      ? branch.reviews.reduce((sum, review) => sum + review.rating, 0) / branch.reviews.length
      : 0;

    // Format the response
    const businessProfile = {
      id: branch.id,
      name: branch.name,
      slug: branch.slug,
      businessType: branch.businessType,
      serviceCategories: branch.serviceCategories || [],
      priceRange: branch.priceRange,
      avgServicePrice: branch.avgServicePrice,
      address: branch.address,
      contact: branch.contact,
      socialMedia: branch.socialMedia,
      businessHours: branch.businessHours,
      isVerified: branch.isVerified,
      latitude: branch.latitude,
      longitude: branch.longitude,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: branch.reviews.length,
      brand: branch.brand,
      reviews: branch.reviews,
      portfolioItems: branch.portfolioItems,
      offers: branch.offers,
      serviceSlots: branch.serviceSlots,
      socialProofBadges: branch.socialProofBadges,
      videoTestimonials: branch.videoTestimonials,
      voiceIntro: branch.voiceIntro
    };

    return NextResponse.json({
      business: businessProfile,
      success: true
    });

  } catch (error) {
    console.error('Business profile API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch business profile',
      success: false
    }, { status: 500 });
  }
}