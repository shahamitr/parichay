import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || 'https://onetouchbizcard.in';

  try {
    // Fetch all active branches with their brands
    const branches = await prisma.branch.findMany({
      where: {
        isActive: true,
        brand: {
          subscription: {
            status: 'ACTIVE',
          },
        },
      },
      include: {
        brand: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Generate sitemap entries for all microsites
    const micrositeEntries: MetadataRoute.Sitemap = branches.map(branch => ({
      url: `${baseUrl}/${branch.brand.slug}/${branch.slug}`,
      lastModified: branch.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Add static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms-of-service`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
    ];

    return [...staticPages, ...micrositeEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static pages if database query fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
  }
}
