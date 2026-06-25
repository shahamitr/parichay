/**
 * Centralized configuration for the Parichay platform.
 * Ensures that sensitive data and contact information can be managed via environment variables.
 */

export const CONFIG = {
  // Brand & Identity
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Parichay',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://parichay.com',
  
  // Contact & Support (PII protection)
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '919724153883',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@parichay.io',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919724153883',
  
  // Social Links
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  },
  
  // API Keys (Publicly exposed ones only)
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
};

export default CONFIG;
