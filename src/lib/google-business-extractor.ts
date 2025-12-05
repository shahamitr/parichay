/**
 * Google Business Data Extractor
 * Extracts business information from Google Places API
 */

export interface GoogleBusinessData {
  // Basic Info
  placeId: string;
  name: string;
  businessStatus: string;

  // Category & Industry
  types: string[];
  primaryType?: string;

  // Contact Information
  formattedPhoneNumber?: string;
  internationalPhoneNumber?: string;
  website?: string;

  // Address
  formattedAddress?: string;
  addressComponents?: Array<{
    longName: string;
    shortName: string;
    types: string[];
  }>;

  // Location
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };

  // Business Hours
  openingHours?: {
    openNow?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekdayText?: string[];
  };

  // Media
  photos?: Array<{
    photoReference: string;
    height: number;
    width: number;
    htmlAttributions: string[];
  }>;

  // Reviews & Rating
  rating?: number;
  userRatingsTotal?: number;
  reviews?: Array<{
    authorName: string;
    rating: number;
    text: string;
    time: number;
  }>;

  // Additional Info
  priceLevel?: number;
  url?: string;
  utcOffset?: number;
  vicinity?: string;
}

export interface ExtractedMicrositeData {
  brandName: string;
  branchName: string;
  slug: string;
  category: string;
  industry: string;
  description?: string;

  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    website?: string;
  };

  location: {
    lat: number;
    lng: number;
  };

  businessHours?: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };

  photos: string[];

  rating?: number;
  reviewCount?: number;

  // Metadata for AI generation
  keywords: string[];
  specialties: string[];
}

/**
 * Extract place ID from Google Maps URL
 */
export function extractPlaceIdFromUrl(url: string): string | null {
  try {
    // Handle different Google Maps URL formats
    const patterns = [
      /place\/[^/]+\/data=.*!1s([^!]+)/,  // New format with data parameter
      /place\/[^/]+\/.*@.*\/data=.*!1s([^!]+)/, // With coordinates
      /maps\/place\/[^/]+\/.*cid=(\d+)/, // CID format
      /\?cid=(\d+)/, // Direct CID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting place ID:', error);
    return null;
  }
}

/**
 * Fetch business data from Google Places API
 */
export async function fetchGoogleBusinessData(
  placeId: string,
  apiKey: string
): Promise<GoogleBusinessData | null> {
  try {
    const fields = [
      'place_id',
      'name',
      'business_status',
      'formatted_address',
      'address_components',
      'geometry',
      'formatted_phone_number',
      'international_phone_number',
      'opening_hours',
      'website',
      'photos',
      'rating',
      'user_ratings_total',
      'reviews',
      'types',
      'price_level',
      'url',
      'utc_offset',
      'vicinity',
    ].join(',');

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result as GoogleBusinessData;
    }

    console.error('Google Places API error:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('Error fetching Google Business data:', error);
    return null;
  }
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(
  photoReference: string,
  apiKey: string,
  maxWidth: number = 800
): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
}

/**
 * Transform Google Business data to microsite format
 */
export function transformToMicrositeData(
  googleData: GoogleBusinessData,
  apiKey: string
): ExtractedMicrositeData {
  // Extract address components
  const addressComponents = googleData.addressComponents || [];
  const getComponent = (type: string) =>
    addressComponents.find(c => c.types.includes(type))?.longName || '';

  const street = [
    getComponent('street_number'),
    getComponent('route')
  ].filter(Boolean).join(' ');

  const city = getComponent('locality') || getComponent('administrative_area_level_2');
  const state = getComponent('administrative_area_level_1');
  const zipCode = getComponent('postal_code');
  const country = getComponent('country');

  // Parse business hours
  const businessHours = parseBusinessHours(googleData.openingHours);

  // Extract photos
  const photos = (googleData.photos || [])
    .slice(0, 10) // Limit to 10 photos
    .map(photo => getPhotoUrl(photo.photoReference, apiKey));

  // Determine industry/category
  const primaryType = googleData.types?.[0] || 'business';
  const industry = mapGoogleTypeToIndustry(primaryType);

  // Extract keywords from types and name
  const keywords = extractKeywords(googleData);

  // Generate slug
  const slug = generateSlug(googleData.name);

  return {
    brandName: googleData.name,
    branchName: googleData.name,
    slug,
    category: primaryType,
    industry,

    address: {
      street: street || googleData.vicinity || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      country: country || 'India',
    },

    contact: {
      phone: googleData.formattedPhoneNumber || googleData.internationalPhoneNumber,
      website: googleData.website,
      // WhatsApp can be same as phone (user can modify)
      whatsapp: googleData.formattedPhoneNumber || googleData.internationalPhoneNumber,
    },

    location: {
      lat: googleData.geometry?.location.lat || 0,
      lng: googleData.geometry?.location.lng || 0,
    },

    businessHours,
    photos,

    rating: googleData.rating,
    reviewCount: googleData.userRatingsTotal,

    keywords,
    specialties: googleData.types || [],
  };
}

/**
 * Parse Google business hours to our format
 */
function parseBusinessHours(openingHours?: GoogleBusinessData['openingHours']) {
  if (!openingHours?.periods) return undefined;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const result: ExtractedMicrositeData['businessHours'] = {};

  for (const period of openingHours.periods) {
    const dayName = days[period.open.day] as keyof typeof result;
    const openTime = formatTime(period.open.time);
    const closeTime = period.close ? formatTime(period.close.time) : '11:59 PM';

    result[dayName] = {
      open: openTime,
      close: closeTime,
      closed: false,
    };
  }

  // Mark days without periods as closed
  days.forEach((day, index) => {
    const dayName = day as keyof typeof result;
    if (!result[dayName]) {
      result[dayName] = {
        open: '09:00 AM',
        close: '06:00 PM',
        closed: true,
      };
    }
  });

  return result;
}

/**
 * Format time from HHMM to HH:MM AM/PM
 */
function formatTime(time: string): string {
  const hours = parseInt(time.substring(0, 2));
  const minutes = time.substring(2, 4);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

  return `${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`;
}

/**
 * Map Google place type to our industry categories
 */
function mapGoogleTypeToIndustry(type: string): string {
  const industryMap: Record<string, string> = {
    // Food & Beverage
    'restaurant': 'Restaurant',
    'cafe': 'Cafe',
    'bar': 'Bar & Lounge',
    'bakery': 'Bakery',
    'food': 'Food & Beverage',

    // Healthcare
    'hospital': 'Healthcare',
    'doctor': 'Healthcare - Medical',
    'dentist': 'Healthcare - Dentistry',
    'pharmacy': 'Healthcare - Pharmacy',
    'physiotherapist': 'Healthcare - Physiotherapy',

    // Retail
    'store': 'Retail',
    'clothing_store': 'Retail - Fashion',
    'shoe_store': 'Retail - Footwear',
    'jewelry_store': 'Retail - Jewelry',
    'electronics_store': 'Retail - Electronics',
    'book_store': 'Retail - Books',

    // Services
    'beauty_salon': 'Beauty & Wellness',
    'hair_care': 'Beauty & Wellness - Salon',
    'spa': 'Beauty & Wellness - Spa',
    'gym': 'Fitness & Gym',
    'lawyer': 'Professional Services - Legal',
    'accounting': 'Professional Services - Accounting',
    'real_estate_agency': 'Real Estate',

    // Education
    'school': 'Education',
    'university': 'Education - Higher',
    'library': 'Education - Library',

    // Automotive
    'car_dealer': 'Automotive - Sales',
    'car_repair': 'Automotive - Repair',
    'car_wash': 'Automotive - Wash',

    // Hospitality
    'lodging': 'Hospitality',
    'hotel': 'Hospitality - Hotel',
    'travel_agency': 'Travel & Tourism',
  };

  return industryMap[type] || 'General Business';
}

/**
 * Extract keywords from business data
 */
function extractKeywords(data: GoogleBusinessData): string[] {
  const keywords: string[] = [];

  // Add business name words
  keywords.push(...data.name.toLowerCase().split(/\s+/));

  // Add types
  if (data.types) {
    keywords.push(...data.types.map(t => t.replace(/_/g, ' ')));
  }

  // Remove common words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];

  return [...new Set(keywords)]
    .filter(k => k.length > 2 && !stopWords.includes(k))
    .slice(0, 10);
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Mock data for development/testing
 */
export function getMockGoogleBusinessData(businessName: string = 'Demo Business'): ExtractedMicrositeData {
  return {
    brandName: businessName,
    branchName: `${businessName} - Main Branch`,
    slug: generateSlug(businessName),
    category: 'restaurant',
    industry: 'Restaurant',
    description: `Welcome to ${businessName}! We provide excellent service and quality products.`,

    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
    },

    contact: {
      phone: '+91 22 1234 5678',
      email: 'contact@business.com',
      whatsapp: '+91 98765 43210',
      website: 'https://business.com',
    },

    location: {
      lat: 19.0760,
      lng: 72.8777,
    },

    businessHours: {
      monday: { open: '09:00 AM', close: '06:00 PM', closed: false },
      tuesday: { open: '09:00 AM', close: '06:00 PM', closed: false },
      wednesday: { open: '09:00 AM', close: '06:00 PM', closed: false },
      thursday: { open: '09:00 AM', close: '06:00 PM', closed: false },
      friday: { open: '09:00 AM', close: '06:00 PM', closed: false },
      saturday: { open: '10:00 AM', close: '04:00 PM', closed: false },
      sunday: { open: '00:00 AM', close: '00:00 PM', closed: true },
    },

    photos: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
    ],

    rating: 4.5,
    reviewCount: 127,

    keywords: ['quality', 'service', 'professional', 'trusted'],
    specialties: ['restaurant', 'food', 'dining'],
  };
}
