import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MicrositeRenderer from '@/components/microsites/MicrositeRenderer';
import DemoBadge from '@/components/microsites/DemoBadge';
import { getMicrositeData } from '@/lib/microsite-data';
import { generateMicrositeSEO, generateStructuredData } from '@/lib/seo-utils';
import { isDemoBrand, getCategoryFromDemoSlug } from '@/lib/demo-utils';
import { industryCategories } from '@/data/categories';

interface MicrositePageProps {
  params: Promise<{
    brand: string;
    branch: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: MicrositePageProps): Promise<Metadata> {
  const { brand, branch } = await params;
  const micrositeData = await getMicrositeData(brand, branch);

  if (!micrositeData) {
    return {
      title: 'Microsite Not Found',
      description: 'The requested microsite could not be found.',
    };
  }

  return generateMicrositeSEO(micrositeData);
}

export default async function MicrositePage({ params }: MicrositePageProps) {
  const { brand, branch } = await params;
  const micrositeData = await getMicrositeData(brand, branch);

  if (!micrositeData) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = generateStructuredData(micrositeData);

  // Check if this is a demo brand and resolve category name
  const isDemo = isDemoBrand(brand);
  let demoCategoryName: string | undefined;
  if (isDemo) {
    const categorySlug = getCategoryFromDemoSlug(brand);
    if (categorySlug) {
      const category = industryCategories.find((c) => c.slug === categorySlug);
      demoCategoryName = category?.name;
    }
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {isDemo && demoCategoryName && (
        <DemoBadge
          brandName={micrositeData.brand?.name ?? brand}
          categoryName={demoCategoryName}
        />
      )}

      <MicrositeRenderer data={micrositeData} />
    </>
  );
}