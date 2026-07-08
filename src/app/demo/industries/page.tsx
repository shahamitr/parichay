import { industryCategories } from '@/data/categories';
import { getCategoryFromDemoSlug } from '@/lib/demo-utils';
import IndustryCatalogGrid from '@/components/demo/IndustryCatalogGrid';

interface IndustryCategoryCard {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  colorScheme: { primary: string; secondary: string; accent: string };
  demoUrl: string | null;
  brandName: string | null;
}

export const metadata = {
  title: 'Industry Demos | Parichay',
  description:
    'Explore live demo microsites for every industry. See how Parichay works for your business type.',
};

export default async function DemoIndustriesPage() {
  // Try to fetch demo brands from DB; fall back gracefully if DB is unavailable
  let demoBrands: any[] = [];
  try {
    const { prisma } = await import('@/lib/prisma');
    demoBrands = await prisma.brand.findMany({
      where: { slug: { startsWith: 'demo-' } },
      include: { branches: { where: { isActive: true }, take: 1 } },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    // DB unavailable — show categories with static demo URLs from config
    console.error('Database unavailable for demo industries page:', (error as Error).message);
  }

  // Index demo brands by category slug for fast lookup
  const brandByCategory = new Map<string, (typeof demoBrands)[number]>();
  for (const brand of demoBrands) {
    const catSlug = getCategoryFromDemoSlug(brand.slug);
    if (catSlug) {
      brandByCategory.set(catSlug, brand);
    }
  }

  const categories: IndustryCategoryCard[] = industryCategories.map((cat) => {
    const brand = brandByCategory.get(cat.slug);
    const branch = brand?.branches[0];
    // Use DB URL if brand exists, fall back to static demoUrl for resilience
    const demoUrl = branch ? `/${brand.slug}/${branch.slug}` : (cat.demoUrl || null);

    return {
      categoryId: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      colorScheme: cat.colorScheme,
      demoUrl,
      brandName: brand?.name ?? null,
    };
  });

  return <IndustryCatalogGrid categories={categories} />;
}
