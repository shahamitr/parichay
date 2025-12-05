import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface MicrositeLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    brand: string;
    branch: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; branch: string }>;
}): Promise<Metadata> {
  try {
    const { brand: brandSlug, branch: branchSlug } = await params;

    // Fetch microsite data for SEO metadata
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
      include: {
        branches: {
          where: { slug: branchSlug, isActive: true },
        },
      },
    });

    if (!brand || brand.branches.length === 0) {
      return {
        title: 'Page Not Found',
        description: 'The requested microsite could not be found.',
      };
    }

    const branch = brand.branches[0];
    const micrositeConfig = branch.micrositeConfig as any;
    const seoSettings = micrositeConfig?.seoSettings;

    // Generate SEO metadata
    const title = seoSettings?.title || `${branch.name} - ${brand.name}`;
    const description = seoSettings?.description ||
      `Visit ${branch.name} by ${brand.name}. ${brand.tagline || 'Professional business services.'}`;
    const keywords = seoSettings?.keywords || [brand.name, branch.name, 'business', 'services'];

    // Construct canonical URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parichay.com';
    const canonicalUrl = brand.customDomain
      ? `https://${brand.customDomain}/${branch.slug}`
      : `${baseUrl}/${brand.slug}/${branch.slug}`;

    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: brand.name }],
      creator: brand.name,
      publisher: brand.name,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: brand.name,
        type: 'website',
        locale: 'en_US',
        images: seoSettings?.ogImage ? [
          {
            url: seoSettings.ogImage,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : brand.logo ? [
          {
            url: brand.logo,
            width: 400,
            height: 400,
            alt: `${brand.name} Logo`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings?.ogImage ? [seoSettings.ogImage] : brand.logo ? [brand.logo] : [],
        creator: `@${brand.name.toLowerCase().replace(/\s+/g, '')}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Business Microsite',
      description: 'Professional business services and contact information.',
    };
  }
}

export default function MicrositeLayout({ children, params }: MicrositeLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}