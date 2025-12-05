/**
 * Code Splitting Configuration
 *
 * Defines which modules should be split into separate chunks
 * for optimal loading performance.
 */

/**
 * Vendor chunks configuration
 * Groups related dependencies into separate chunks
 */
export const vendorChunks = {
  // Animation libraries
  animations: ['framer-motion'],

  // Chart and visualization libraries
  charts: ['chart.js', 'react-chartjs-2'],

  // Form libraries
  forms: ['react-hook-form', '@hookform/resolvers', 'zod'],

  // UI icon libraries
  icons: ['lucide-react'],

  // Date utilities
  dates: ['date-fns'],

  // State management
  state: ['zustand'],
};

/**
 * Route-based code splitting
 * Defines which routes should have their own chunks
 */
export const routeChunks = {
  // Admin/Executive routes
  admin: ['/executive', '/dashboard/admin'],

  // Builder/Editor routes
  builder: ['/dashboard/builder', '/dashboard/editor'],

  // Analytics routes
  analytics: ['/dashboard/analytics'],

  // Public microsite routes
  microsite: ['/[brand]'],
};

/**
 * Component-level splitting priorities
 * Higher priority = loaded earlier
 */
export const componentPriorities = {
  critical: [
    'Header',
    'Footer',
    'Navigation',
    'Button',
    'Card',
  ],
  high: [
    'MicrositeRenderer',
    'MicrositePreview',
    'ThemeSelector',
  ],
  medium: [
    'ThemeEditor',
    'BrandCustomizationPanel',
    'ContentEditor',
  ],
  low: [
    'AnimatedSection',
    'AiContentGenerator',
    'InteractiveProductCatalog',
    'LiveChatWidget',
    'AppointmentBooking',
    'AnalyticsChart',
  ],
};

/**
 * Prefetch configuration
 * Defines which chunks should be prefetched
 */
export const prefetchConfig = {
  // Prefetch on hover for these routes
  hoverPrefetch: ['/dashboard', '/pricing', '/features'],

  // Prefetch on viewport for these components
  viewportPrefetch: ['ThemeEditor', 'BrandCustomizationPanel'],

  // Prefetch after initial load
  idlePrefetch: ['AnalyticsChart', 'AiContentGenerator'],
};

/**
 * Bundle size limits (in KB)
 * Warnings will be shown if exceeded
 */
export const bundleSizeLimits = {
  // Main bundle
  main: 200,

  // Vendor chunks
  animations: 100,
  charts: 150,
  forms: 80,

  // Route chunks
  admin: 150,
  builder: 200,
  analytics: 100,
  microsite: 150,
};

/**
 * Check if a module should be in a specific vendor chunk
 */
export function getVendorChunk(moduleName: string): string | null {
  for (const [chunkName, modules] of Object.entries(vendorChunks)) {
    if (modules.some(mod => moduleName.includes(mod))) {
      return chunkName;
    }
  }
  return null;
}

/**
 * Check if a route should have its own chunk
 */
export function getRouteChunk(pathname: string): string | null {
  for (const [chunkName, routes] of Object.entries(routeChunks)) {
    if (routes.some(route => pathname.startsWith(route))) {
      return chunkName;
    }
  }
  return null;
}

/**
 * Get component loading priority
 */
export function getComponentPriority(
  componentName: string
): 'critical' | 'high' | 'medium' | 'low' {
  for (const [priority, components] of Object.entries(componentPriorities)) {
    if (components.includes(componentName)) {
      return priority as 'critical' | 'high' | 'medium' | 'low';
    }
  }
  return 'low';
}
