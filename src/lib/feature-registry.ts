/**
 * Feature Registry — Central config for all microsite sections.
 *
 * Controls:
 * 1. Which features exist in the system
 * 2. Default enabled/disabled state per business type
 * 3. Which plan tier is required for each feature
 * 4. Display order and categorization for admin UI
 */

export type FeatureTier = 'free' | 'starter' | 'professional' | 'agency';

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'engagement' | 'conversion' | 'trust' | 'advanced';
  tier: FeatureTier;
  icon: string; // lucide icon name
  defaultEnabled: boolean;
  /** Business types where this feature is enabled by default */
  enabledForTypes: string[];
}

// =============================================================================
// Master Feature Registry
// =============================================================================

export const FEATURE_REGISTRY: FeatureDefinition[] = [
  // --- CORE (always available) ---
  { id: 'hero', name: 'Hero / Header', description: 'Business name, logo, tagline, and cover image', category: 'core', tier: 'free', icon: 'layout', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'about', name: 'About Section', description: 'Business description and story', category: 'core', tier: 'free', icon: 'info', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'services', name: 'Services / Menu', description: 'List of services or products with pricing', category: 'core', tier: 'free', icon: 'briefcase', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'contact', name: 'Contact & Lead Form', description: 'Contact info, map, and enquiry form', category: 'core', tier: 'free', icon: 'mail', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'businessHours', name: 'Business Hours', description: 'Operating hours with open/closed status', category: 'core', tier: 'free', icon: 'clock', defaultEnabled: true, enabledForTypes: ['*'] },

  // --- ENGAGEMENT ---
  { id: 'gallery', name: 'Photo Gallery', description: 'Showcase photos of your work, space, or products', category: 'engagement', tier: 'free', icon: 'image', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'videos', name: 'Video Section', description: 'Embed YouTube or uploaded video content', category: 'engagement', tier: 'starter', icon: 'video', defaultEnabled: false, enabledForTypes: ['creatives-designers', 'event-planners', 'fitness-wellness'] },
  { id: 'team', name: 'Team Members', description: 'Staff profiles with roles and contact info', category: 'engagement', tier: 'starter', icon: 'users', defaultEnabled: false, enabledForTypes: ['healthcare-professionals', 'corporate-professionals', 'educational-institutions'] },
  { id: 'staffCards', name: 'Staff Digital Cards', description: 'Individual shareable digital cards for each team member', category: 'engagement', tier: 'professional', icon: 'id-card', defaultEnabled: false, enabledForTypes: ['corporate-professionals', 'healthcare-professionals'] },
  { id: 'documents', name: 'Documents & Downloads', description: 'PDF brochures, menus, catalogs for download', category: 'engagement', tier: 'starter', icon: 'file-text', defaultEnabled: false, enabledForTypes: ['restaurants-cafes', 'educational-institutions', 'corporate-professionals'] },
  { id: 'bestTimeToVisit', name: 'Best Time to Visit', description: 'Shows busy/quiet hours based on traffic', category: 'engagement', tier: 'professional', icon: 'trending-up', defaultEnabled: false, enabledForTypes: ['restaurants-cafes', 'healthcare-professionals', 'fitness-wellness'] },

  // --- CONVERSION ---
  { id: 'booking', name: 'Appointment Booking', description: 'Let customers book time slots online', category: 'conversion', tier: 'starter', icon: 'calendar', defaultEnabled: false, enabledForTypes: ['healthcare-professionals', 'fitness-wellness', 'creatives-designers', 'freelancers-consultants'] },
  { id: 'quoteRequest', name: 'Quote Request Form', description: 'Customers request pricing for specific services', category: 'conversion', tier: 'starter', icon: 'file-text', defaultEnabled: false, enabledForTypes: ['event-planners', 'freelancers-consultants', 'creatives-designers', 'real-estate-agents'] },
  { id: 'offers', name: 'Deals & Offers', description: 'Active promotions, discounts, and coupon codes', category: 'conversion', tier: 'starter', icon: 'tag', defaultEnabled: false, enabledForTypes: ['restaurants-cafes', 'fitness-wellness', 'business-owners'] },
  { id: 'payment', name: 'Online Payment', description: 'Accept payments via UPI, Razorpay, or Stripe', category: 'conversion', tier: 'starter', icon: 'credit-card', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'cta', name: 'Call-to-Action Banner', description: 'Prominent action banner (Book Now, Order Now, etc.)', category: 'conversion', tier: 'free', icon: 'zap', defaultEnabled: false, enabledForTypes: ['restaurants-cafes', 'fitness-wellness'] },

  // --- TRUST ---
  { id: 'feedback', name: 'Customer Reviews', description: 'Star ratings and written reviews from customers', category: 'trust', tier: 'free', icon: 'star', defaultEnabled: true, enabledForTypes: ['*'] },
  { id: 'testimonials', name: 'Testimonials', description: 'Featured customer success stories', category: 'trust', tier: 'starter', icon: 'quote', defaultEnabled: false, enabledForTypes: ['freelancers-consultants', 'healthcare-professionals', 'educational-institutions'] },
  { id: 'qa', name: 'Customer Q&A', description: 'Public questions and answers section', category: 'trust', tier: 'starter', icon: 'message-circle', defaultEnabled: false, enabledForTypes: ['healthcare-professionals', 'educational-institutions', 'legal-services'] },
  { id: 'trustIndicators', name: 'Trust Badges', description: 'Certifications, awards, years in business', category: 'trust', tier: 'free', icon: 'shield', defaultEnabled: false, enabledForTypes: ['healthcare-professionals', 'legal-services', 'corporate-professionals'] },
  { id: 'videoTestimonials', name: 'Video Testimonials', description: 'Video reviews from customers', category: 'trust', tier: 'professional', icon: 'video', defaultEnabled: false, enabledForTypes: ['fitness-wellness', 'educational-institutions'] },
  { id: 'socialProofBadges', name: 'Social Proof', description: 'Verified, Top Rated, Customer Favorite badges', category: 'trust', tier: 'professional', icon: 'award', defaultEnabled: false, enabledForTypes: ['*'] },

  // --- ADVANCED ---
  { id: 'portfolio', name: 'Portfolio / Case Studies', description: 'Detailed project showcases', category: 'advanced', tier: 'professional', icon: 'folder', defaultEnabled: false, enabledForTypes: ['creatives-designers', 'freelancers-consultants', 'event-planners'] },
  { id: 'aboutFounder', name: 'About Founder', description: 'Personal story of the business founder', category: 'advanced', tier: 'starter', icon: 'user', defaultEnabled: false, enabledForTypes: ['freelancers-consultants', 'business-owners'] },
  { id: 'impact', name: 'Impact / Stats', description: 'Key business metrics and achievements', category: 'advanced', tier: 'starter', icon: 'bar-chart', defaultEnabled: false, enabledForTypes: ['corporate-professionals', 'educational-institutions'] },
  { id: 'faq', name: 'FAQ', description: 'Frequently asked questions accordion', category: 'advanced', tier: 'free', icon: 'help-circle', defaultEnabled: false, enabledForTypes: ['healthcare-professionals', 'legal-services', 'educational-institutions'] },
  { id: 'location', name: 'Location Map', description: 'Interactive Google Maps with directions', category: 'advanced', tier: 'free', icon: 'map-pin', defaultEnabled: false, enabledForTypes: ['restaurants-cafes', 'healthcare-professionals', 'fitness-wellness'] },
  { id: 'whatsappCatalogue', name: 'WhatsApp Catalogue', description: 'Product grid customers can order via WhatsApp', category: 'advanced', tier: 'professional', icon: 'shopping-bag', defaultEnabled: false, enabledForTypes: ['business-owners', 'restaurants-cafes'] },
  { id: 'voiceIntro', name: 'Voice Introduction', description: 'Audio clip introducing the business', category: 'advanced', tier: 'professional', icon: 'mic', defaultEnabled: false, enabledForTypes: ['freelancers-consultants', 'creatives-designers'] },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the default section order for a given business type.
 * Returns all features with enabled/disabled based on type defaults.
 */
export function getDefaultSectionsForType(businessType: string): { id: string; enabled: boolean }[] {
  return FEATURE_REGISTRY.map((feature) => ({
    id: feature.id,
    enabled: feature.enabledForTypes.includes('*')
      ? feature.defaultEnabled
      : feature.enabledForTypes.includes(businessType) || feature.defaultEnabled,
  }));
}

/**
 * Check if a feature is available on a given plan tier.
 */
export function isFeatureAvailableOnPlan(featureId: string, planTier: FeatureTier): boolean {
  const feature = FEATURE_REGISTRY.find((f) => f.id === featureId);
  if (!feature) return false;

  const tierOrder: FeatureTier[] = ['free', 'starter', 'professional', 'agency'];
  return tierOrder.indexOf(planTier) >= tierOrder.indexOf(feature.tier);
}

/**
 * Get all features grouped by category (for admin UI).
 */
export function getFeaturesByCategory(): Record<string, FeatureDefinition[]> {
  const grouped: Record<string, FeatureDefinition[]> = {};
  for (const feature of FEATURE_REGISTRY) {
    if (!grouped[feature.category]) grouped[feature.category] = [];
    grouped[feature.category].push(feature);
  }
  return grouped;
}

/**
 * Get features that are locked for a given plan (need upgrade).
 */
export function getLockedFeatures(planTier: FeatureTier): FeatureDefinition[] {
  return FEATURE_REGISTRY.filter((f) => !isFeatureAvailableOnPlan(f.id, planTier));
}

/**
 * Get the recommended features for a new business in a category.
 */
export function getRecommendedFeatures(categorySlug: string): string[] {
  return FEATURE_REGISTRY
    .filter((f) => f.enabledForTypes.includes(categorySlug) || f.enabledForTypes.includes('*'))
    .filter((f) => f.defaultEnabled || f.enabledForTypes.includes(categorySlug))
    .map((f) => f.id);
}

/**
 * Category display labels for admin UI grouping.
 */
export const CATEGORY_LABELS: Record<string, { label: string; description: string }> = {
  core: { label: 'Core', description: 'Essential sections every business needs' },
  engagement: { label: 'Engagement', description: 'Keep visitors interested and exploring' },
  conversion: { label: 'Conversion', description: 'Turn visitors into customers' },
  trust: { label: 'Trust & Social Proof', description: 'Build credibility and confidence' },
  advanced: { label: 'Advanced', description: 'Extra sections for power users' },
};
