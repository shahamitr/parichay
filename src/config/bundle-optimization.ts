/**
 * Bundle Optimization Configuration
 *
 * Defines strategies for minimizing bundle size through:
 * - Tree shaking
 * - Dead code elimination
 * - Module concatenation
 * - Minification
 */

/**
 * Modules that should be tree-shaken
 * These are libraries that support tree-shaking
 */
export const treeShakableModules = [
  'lodash-es',
  'date-fns',
  'lucide-react',
  'framer-motion',
  '@hookform/resolvers',
];

/**
 * Side effect free modules
 * These modules can be safely tree-shaken
 */
export const sideEffectFreeModules = [
  '@/lib/utils',
  '@/lib/design-system',
  '@/lib/theme-utils',
  '@/lib/gradient-utils',
  '@/config/design-tokens',
  '@/config/animations',
];

/**
 * Modules to exclude from bundle
 * These are only needed in development or testing
 */
export const excludeFromBundle = [
  'jest',
  '@testing-library/react',
  '@testing-library/jest-dom',
  'prettier',
  'eslint',
];

/**
 * Import optimization rules
 * Defines how to optimize imports from specific libraries
 */
export const importOptimizations = {
  // Use named imports from lodash-es for tree-shaking
  'lodash-es': {
    transform: 'named',
    example: "import { debounce } from 'lodash-es'",
  },

  // Use specific date-fns imports
  'date-fns': {
    transform: 'named',
    example: "import { format } from 'date-fns'",
  },

  // Use specific lucide-react imports
  'lucide-react': {
    transform: 'named',
    example: "import { ChevronRight } from 'lucide-react'",
  },

  // Use specific framer-motion imports
  'framer-motion': {
    transform: 'named',
    example: "import { motion } from 'framer-motion'",
  },
};

/**
 * CSS optimization rules
 */
export const cssOptimizations = {
  // Purge unused Tailwind classes
  purgeCss: true,

  // Minify CSS in production
  minify: true,

  // Remove duplicate CSS rules
  deduplicate: true,

  // Inline critical CSS
  inlineCritical: true,

  // Maximum inline CSS size (in bytes)
  maxInlineSize: 10000,
};

/**
 * JavaScript optimization rules
 */
export const jsOptimizations = {
  // Minify JavaScript
  minify: true,

  // Remove console logs in production
  removeConsole: true,

  // Remove debugger statements
  removeDebugger: true,

  // Remove comments
  removeComments: true,

  // Mangle variable names
  mangle: true,

  // Compress code
  compress: true,
};

/**
 * Bundle size limits (in KB)
 * Warnings will be shown if exceeded
 */
export const bundleSizeLimits = {
  // First Load JS
  firstLoadJS: 250,

  // Individual page bundles
  page: 150,

  // Shared chunks
  shared: 100,

  // CSS files
  css: 50,
};

/**
 * Performance budgets
 * Used for monitoring and alerting
 */
export const performanceBudgets = {
  // Time to First Byte (TTFB)
  ttfb: 600, // ms

  // First Contentful Paint (FCP)
  fcp: 1800, // ms

  // Largest Contentful Paint (LCP)
  lcp: 2500, // ms

  // Time to Interactive (TTI)
  tti: 3800, // ms

  // Total Blocking Time (TBT)
  tbt: 300, // ms

  // Cumulative Layout Shift (CLS)
  cls: 0.1,
};

/**
 * Check if a module should be tree-shaken
 */
export function shouldTreeShake(moduleName: string): boolean {
  return treeShakableModules.some(mod => moduleName.includes(mod));
}

/**
 * Check if a module has side effects
 */
export function hasSideEffects(moduleName: string): boolean {
  return !sideEffectFreeModules.some(mod => moduleName.includes(mod));
}

/**
 * Get import optimization for a module
 */
export function getImportOptimization(moduleName: string) {
  return importOptimizations[moduleName as keyof typeof importOptimizations];
}

/**
 * Check if bundle size exceeds limit
 */
export function checkBundleSize(
  type: keyof typeof bundleSizeLimits,
  size: number
): { exceeded: boolean; limit: number; percentage: number } {
  const limit = bundleSizeLimits[type];
  const exceeded = size > limit;
  const percentage = (size / limit) * 100;

  return { exceeded, limit, percentage };
}

/**
 * Check if performance metric exceeds budget
 */
export function checkPerformanceBudget(
  metric: keyof typeof performanceBudgets,
  value: number
): { exceeded: boolean; budget: number; percentage: number } {
  const budget = performanceBudgets[metric];
  const exceeded = value > budget;
  const percentage = (value / budget) * 100;

  return { exceeded, budget, percentage };
}
