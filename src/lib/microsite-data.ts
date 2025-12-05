// @ts-nocheck
import { prisma } from './prisma';
import { MicrositeData } from '@/types/microsite';
import { withCache, CacheKeys, CacheTTL } from './cache';

/**
 * Fetch microsite data by brand and branch slugs (server-side)
 */
export async function getMicrositeData(
  brandSlug: string,
  branchSlug: string
): Promise<MicrositeData | null> {
  // Use cache with 5 minute TTL
  return withCache(
    CacheKeys.MICROSITE(brandSlug, branchSlug),
    async () => {
      try {
        const brand = await prisma.brand.findUnique({
          where: { slug: brandSlug },
          include: {
            branches: {
              where: { slug: branchSlug, isActive: true },
            },
          },
        });

        if (!brand || brand.branches.length === 0) {
          return null;
        }

        const branch = brand.branches[0];

        return {
          brand: {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo,
            tagline: brand.tagline,
            colorTheme: brand.colorTheme,
            customDomain: brand.customDomain,
          },
          branch: {
            id: branch.id,
            name: branch.name,
            slug: branch.slug,
            address: branch.address,
            contact: branch.contact,
            socialMedia: branch.socialMedia,
            businessHours: branch.businessHours,
            micrositeConfig: branch.micrositeConfig,
            updatedAt: branch.updatedAt.toISOString(),
          },
          micrositeConfig: branch.micrositeConfig as any,
        };
      } catch (error) {
        console.error('Error fetching microsite data:', error);
        return null;
      }
    },
    CacheTTL.MEDIUM
  );
}
