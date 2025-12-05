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

  // If no branches, show a "coming soon" page
  if (brand.branches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-contain" />
            ) : (
              <span className="text-3xl font-bold text-gray-400">
                {brand.name.charAt(0)}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.name}</h1>
          {brand.tagline && (
            <p className="text-gray-600 mb-6">{brand.tagline}</p>
          )}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Coming Soon
          </div>
        </div>
      </div>
    );
  }

  // If only one branch, show that branch's microsite directly
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

  // If multiple branches, show branch selection page
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-100">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                {brand.name.charAt(0)}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.name}</h1>
          {brand.tagline && (
            <p className="text-gray-600">{brand.tagline}</p>
          )}
        </div>
      </div>

      {/* Branch Selection */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Select a Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brand.branches.map((branch) => {
            const address = branch.address as any;
            const contact = branch.contact as any;

            return (
              <a
                key={branch.id}
                href={`/${brand.slug}/${branch.slug}`}
                className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {branch.name}
                </h3>
                {address && (
                  <p className="text-sm text-gray-500 mb-3">
                    {address.city}, {address.state}
                  </p>
                )}
                {contact?.phone && (
                  <p className="text-sm text-gray-600">
                    📞 {contact.phone}
                  </p>
                )}
                <div
                  className="mt-4 inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: primaryColor }}
                >
                  View Details
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
