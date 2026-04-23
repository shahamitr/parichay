import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import MicrositeRenderer from '@/components/microsites/MicrositeRenderer';
import { generateMicrositeSEO, generateStructuredData } from '@/lib/seo-utils';

interface BrandPageProps {
  params: Promise<{
    brand: string;
  }>;
}

// Reserved routes that should not be treated as brand slugs
const RESERVED_ROUTES = [
  'login',
  'register',
  'dashboard',
  'admin',
  'api',
  'about',
  'contact',
  'pricing',
  'features',
  'privacy-policy',
  'terms-of-service',
  'refund-policy',
  'forgot-password',
  'reset-password',
  'executive',
  'onboarding',
  'preview',
  's',
  'clients',
  'digital-business-card',
];

async function getBrandData(brandSlug: string) {
  // Check if this is a reserved route
  if (RESERVED_ROUTES.includes(brandSlug.toLowerCase())) {
    return null;
  }

  try {
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
      include: {
        branches: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return brand;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = await getBrandData(brandSlug);

  if (!brand) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // If brand has branches, use the first branch for metadata
  if (brand.branches.length > 0) {
    const branch = brand.branches[0];
    const micrositeData = {
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
      },
    };
    return generateMicrositeSEO(micrositeData as any);
  }

  return {
    title: brand.name,
    description: brand.tagline || `Welcome to ${brand.name}`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand: brandSlug } = await params;
  const brand = await getBrandData(brandSlug);

  if (!brand) {
    notFound();
  }

  // If no branches, redirect to admin to create branches
  if (brand.branches.length === 0) {
    redirect(`/admin/brands/${brand.id}`);
  }

  // If only one branch, redirect to brand directly without branch slug
  if (brand.branches.length === 1) {
    const branch = brand.branches[0];
    const micrositeData = {
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
      },
    };

    const structuredData = generateStructuredData(micrositeData as any);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <MicrositeRenderer data={micrositeData as any} />
      </>
    );
  }

  // Redirect to admin brand management for multiple branches
  redirect(`/admin/brands/${brand.id}`);
}
