import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MicrositeRenderer from '@/components/microsites/MicrositeRenderer';
import { getMicrositeData } from '@/lib/microsite-data';
import { generateMicrositeSEO, generateStructuredData } from '@/lib/seo-utils';

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

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <MicrositeRenderer data={micrositeData} />
    </>
  );
}