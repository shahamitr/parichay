// @ts-nocheck
/**
 * Lazy Component Loaders
 *
 * Centralizec imports for code splitting heavy components.
 * This reduces the initial bundle size and improves page load performance.
 */

import dynamic from 'next/dynamic';

/**
 * Lazy load AnimatedSection with framer-motion
 * Only loads when animation is needed
 */
export const AnimatedSection = dynamic(
  () => import('@/components/microsites/AnimatedSection'),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Lazy load theme customization components
 * These are only needed in the builder/editor interface
 */
export const ThemeEditor = dynamic(
  () => import('@/components/themes/ThemeEditor'),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />),
  }
);

export const BrandCustomizationPanel = dynamic(
  () => import('@/components/themes/BrandCustomizationPanel'),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />),
  }
);

export const HeroCustomizer = dynamic(
  () => import('@/components/themes/HeroCustomizer'),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />),
  }
);

/**
 * Lazy load AI content generator
 * Heavy component with complex logic
 */
export const AiContentGenerator = dynamic(
  () => import('@/components/microsites/AiContentGenerator'),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-48 rounded-lg" />),
  }
);

/**
 * Lazy load interactive catalog
 * Contains complex interactions and state management
 */
export const InteractiveProductCatalog = dynamic(
  () => import('@/components/microsites/InteractiveProductCatalog'),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />),
  }
);

/**
 * Lazy load live chat widget
 * Third-party integration that's not always needed
 */
export const LiveChatWidget = dynamic(
  () => import('@/components/microsites/LiveChatWidget'),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Lazy load appointment booking
 * Complex form with calendar integration
 */
export const AppointmentBooking = dynamic(
  () => import('@/components/microsites/AppointmentBooking'),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />),
  }
);

/**
 * Lazy load chart components
 * Heavy charting library (chart.js)
 */
export const AnalyticsChart = dynamic(
  () => import('@/components/analytics/AnalyticsChart').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />),
  }
);
