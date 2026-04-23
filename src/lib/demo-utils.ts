/**
 * Demo brand detection and URL utilities.
 *
 * Convention: demo brands use the slug prefix `demo-` and
 * demo users use the email domain `@demo.parichay.io`.
 */

const DEMO_PREFIX = 'demo-';
const DEMO_EMAIL_DOMAIN = 'demo.parichay.io';

/**
 * Returns `true` when the brand slug belongs to a demo microsite.
 */
export function isDemoBrand(slug: string): boolean {
  return slug.startsWith(DEMO_PREFIX);
}

/**
 * Extracts the category slug from a demo brand slug.
 * Returns `null` when the slug is not a demo brand.
 *
 * @example getCategoryFromDemoSlug('demo-restaurants-cafes') // 'restaurants-cafes'
 * @example getCategoryFromDemoSlug('my-brand')               // null
 */
export function getCategoryFromDemoSlug(slug: string): string | null {
  if (!isDemoBrand(slug)) return null;
  return slug.slice(DEMO_PREFIX.length);
}

/**
 * Builds the demo brand slug for a given category slug.
 *
 * @example buildDemoSlug('restaurants-cafes') // 'demo-restaurants-cafes'
 */
export function buildDemoSlug(categorySlug: string): string {
  return `${DEMO_PREFIX}${categorySlug}`;
}

/**
 * Builds the demo user email for a given category slug.
 *
 * @example buildDemoEmail('restaurants-cafes') // 'restaurants-cafes@demo.parichay.io'
 */
export function buildDemoEmail(categorySlug: string): string {
  return `${categorySlug}@${DEMO_EMAIL_DOMAIN}`;
}

/**
 * Resolves the demo URL for a category.
 *
 * If the category defines a `demoUrl`, that value is returned as-is.
 * Otherwise the URL is constructed as `/demo-{slug}/main`.
 */
export function resolveDemoUrl(category: { slug: string; demoUrl?: string }): string {
  if (category.demoUrl) {
    return category.demoUrl;
  }
  return `/${buildDemoSlug(category.slug)}/main`;
}
