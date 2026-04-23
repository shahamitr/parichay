import { prisma } from '@/lib/prisma';
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
  const demoBrands = await prisma.brand.findMany({
    where: { slug: { startsWith: 'demo-' } },
    include: { branches: { where: { isActive: true }, take: 1 } },
    orderBy: { name: 'asc' },
  });

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
    const demoUrl = branch ? `/${brand.slug}/${branch.slug}` : null;

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
