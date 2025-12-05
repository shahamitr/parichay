// @ts-nocheck
import { Metadata } from 'next';
import { MicrositeData } from '@/types/microsite';

/**
 * Generate local SEO keywords based on business info
 */
export function generateLocalKeywords(data: MicrositeData): string[] {
  const { brand, branch } = data;
  const address = branch.address as {
    city?: string;
    state?: string;
    locality?: string;
    area?: string;
  };
  const micrositeConfig = branch.micrositeConfig as any;
  const services = micrositeConfig?.sections?.services?.items || [];

  const keywords: string[] = [];
  const city = address?.city || '';
  const locality = address?.locality || address?.area || '';
  const state = address?.state || '';

  // Add brand/business name variations
  keywords.push(brand.name);
  keywords.push(`${brand.name} ${city}`);

  // Add location-based keywords
  if (city != null) {
    keywords.push(`${brand.name} in ${city}`);
    keywords.push(`${brand.name} near ${city}`);
  }

  if (locality != null) {
    keywords.push(`${brand.name} in ${locality}`);
    keywords.push(`${brand.name} ${locality} ${city}`);
    keywords.push(`${brand.name} near ${locality}`);
  }

  // Add service-based local keywords
  services.forEach((service: any) => {
    const serviceName = service.name || service.title;
    if (serviceName != null) {
      keywords.push(serviceName);
      if (city != null) {
        keywords.push(`${serviceName} in ${city}`);
        keywords.push(`${serviceName} ${city}`);
      }
      if (locality != null) {
        keywords.push(`${serviceName} in ${locality}`);
        keywords.push(`${serviceName} near ${locality}`);
        keywords.push(`${serviceName} ${locality} ${city}`);
      }
    }
  });

  // Add industry category keywords
  if (brand.industryCategory) {
    keywords.push(brand.industryCategory);
    if (city != null) {
      keywords.push(`${brand.industryCategory} in ${city}`);
      keywords.push(`${brand.industryCategory} ${city}`);
      keywords.push(`best ${brand.industryCategory} in ${city}`);
    }
    if (locality != null) {
      keywords.push(`${brand.industryCategory} in ${locality}`);
      keywords.push(`${brand.industryCategory} near ${locality}`);
    }
  }

  // Add common local search patterns
  if (city != null) {
    keywords.push(`best ${brand.name} in ${city}`);
    keywords.push(`top ${brand.name} ${city}`);
    keywords.push(`${brand.name} contact ${city}`);
  }

  // Remove duplicates and empty strings
  return [...new Set(keywords.filter(k => k && k.trim()))];
}

/**
 * Generate SEO-optimized description with local keywords
 */
export function generateLocalDescription(data: MicrositeData): string {
  const { brand, branch } = data;
  const address = branch.address as {
    city?: string;
    state?: string;
    locality?: string;
    area?: string;
  };
  const micrositeConfig = branch.micrositeConfig as any;
  const services = micrositeConfig?.sections?.services?.items || [];

  const city = address?.city || '';
  const locality = address?.locality || address?.area || '';
  const serviceNames = services.slice(0, 3).map((s: any) => s.name || s.title).filter(Boolean);

  let description = `${brand.name}`;

  if (locality && city) {
    description += ` in ${locality}, ${city}`;
  } else if (city != null) {
    description += ` in ${city}`;
  }

  if (serviceNames.length > 0) {
    description += ` - Offering ${serviceNames.join(', ')}`;
  }

  if (brand.tagline) {
    description += `. ${brand.tagline}`;
  }

  description += `. Contact us for quality services and competitive prices.`;

  return description;
}

/**
 * Generate SEO metadata for microsites
 */
export function generateMicrositeSEO(data: MicrositeData): Metadata {
  const { brand, branch } = data;
  const micrositeConfig = branch.micrositeConfig as any;
  const seoSettings = micrositeConfig?.seoSettings || {};

  // Generate local keywords
  const localKeywords = generateLocalKeywords(data);
  const customKeywords = seoSettings?.keywords || [];
  const allKeywords = [...new Set([...localKeywords, ...customKeywords])];

  const title = seoSettings?.title || `${branch.name} - ${brand.name}`;
  const description = seoSettings?.description || generateLocalDescription(data);
  const keywords = allKeywords;

  const url = `https://onetouchbizcard.in/${brand.slug}/${branch.slug}`;
  const ogImage = seoSettings?.ogImage || brand.logo || '/default-og-image.png';

  return {
    title,
    description,
    keywords,
    authors: [{ name: brand.name }],
    creator: brand.name,
    publisher: brand.name,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: brand.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${branch.name} - ${brand.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate JSON-LD structured data for microsites
 */
export function generateStructuredData(data: MicrositeData) {
  const { brand, branch } = data;
  const contact = branch.contact as { phone?: string; email?: string; whatsapp?: string };
  const address = branch.address as {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    locality?: string;
    area?: string;
  };
  const socialMedia = branch.socialMedia as {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  const micrositeConfig = branch.micrositeConfig as any;
  const services = micrositeConfig?.sections?.services?.items || [];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onetouchbizcard.in';

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: branch.name,
    description: generateLocalDescription(data),
    image: brand.logo || '',
    '@id': `${baseUrl}/${brand.slug}/${branch.slug}`,
    url: `${baseUrl}/${brand.slug}/${branch.slug}`,
    telephone: contact?.phone || '',
    email: contact?.email || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.street || '',
      addressLocality: address?.city || '',
      addressRegion: address?.state || '',
      postalCode: address?.zipCode || '',
      addressCountry: address?.country || 'IN',
    },
    geo: address?.city ? {
      '@type': 'GeoCoordinates',
      // Note: Add actual coordinates if available in address
    } : undefined,
    areaServed: {
      '@type': 'City',
      name: address?.city || '',
    },
    sameAs: [
      socialMedia?.facebook,
      socialMedia?.instagram,
      socialMedia?.linkedin,
      socialMedia?.twitter,
    ].filter(Boolean),
    priceRange: '₹₹', // Default mid-range
  };

  // Add services as offers
  if (services.length > 0) {
    structuredData.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map((service: any, index: number) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name || service.title,
          description: service.description,
        },
        price: service.price,
        priceCurrency: 'INR',
        position: index + 1,
      })),
    };
  }

  // Add aggregate rating if reviews exist
  const reviews = micrositeConfig?.sections?.testimonials?.items || [];
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / reviews.length;
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add business hours if available
  if (branch.businessHours) {
    const businessHours = branch.businessHours as Record<string, { open: string; close: string; closed: boolean }>;
    const openingHours = Object.entries(businessHours)
      .filter(([_, hours]) => !hours.closed)
      .map(([day, hours]) => {
        const dayMap: Record<string, string> = {
          monday: 'Mo',
          tuesday: 'Tu',
          wednesday: 'We',
          thursday: 'Th',
          friday: 'Fr',
          saturday: 'Sa',
          sunday: 'Su',
        };
        return `${dayMap[day.toLowerCase()]} ${hours.open}-${hours.close}`;
      });

    if (openingHours.length > 0) {
      (structuredData as any).openingHoursSpecification = openingHours.map(spec => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: spec.split(' ')[0],
        opens: spec.split(' ')[1].split('-')[0],
        closes: spec.split(' ')[1].split('-')[1],
      }));
    }
  }

  return structuredData;
}

/**
 * Generate sitemap entry for a microsite
 */
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemapEntry(data: MicrositeData): SitemapEntry {
  const { brand, branch } = data;

  return {
    url: `https://onetouchbizcard.in/${brand.slug}/${branch.slug}`,
    lastModified: new Date(branch.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  };
}
