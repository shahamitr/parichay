# Performance Optimization Guide

This document describes the performance optimizations implemented in the microsite application.

## Overview

The application has been optimized for:
- **Fast initial load times** through code splitting
- **Efficient image delivery** with lazy loading and responsive images
- **Minimal bundle sizes** through tree shaking and dead code elimination
- **Optimal caching** strategies
- **Progressive enhancement** for better user experience

## Code Splitting

### Automatic Code Splitting

Next.js automatically splits code at the page level. Each page only loads the JavaScript it needs.

### Manual Code Splitting

Heavy components are dynamically imported to reduce initial bundle size:

```typescript
import { AnimatedSection } from '@/lib/lazy-components';
```

Available lazy-loaded components:
- `AnimatedSection` - Framer Motion animations
- `ThemeEditor` - Theme customization interface
- `BrandCustomizationPanel` - Brand settings
- `HeroCustomizer` - Hero section editor
- `AiContentGenerator` - AI content generation
- `InteractiveProductCatalog` - Product catalog
- `LiveChatWidget` - Chat integration
- `AppointmentBooking` - Booking system
- `AnalyticsChart` - Chart.js visualizations

### Vendor Chunk Splitting

Large dependencies are split into separate chunks:

- **animations** - Framer Motion (~100KB)
- **charts** - Chart.js and React Chart.js 2 (~150KB)
- **forms** - React Hook Form, Zod (~80KB)
- **icons** - Lucide React (~25KB)

This allows browsers to cache these chunks separately and load them in parallel.

## Image Optimization

### Responsive Images

Images are automatically generated in multiple sizes:

```typescript
import { generateResponsiveImages } from '@/lib/image-utils';

const sizes = await generateResponsiveImages(file, {
  sizes: ['small', 'medium', 'large'],
});
```

Available sizes:
- **thumbnail** - 150x150px (80% quality)
- **small** - 320x320px (85% quality)
- **medium** - 640x640px (85% quality)
- **large** - 1024x1024px (85% quality)
- **xlarge** - 1920x1920px (90% quality)

### Lazy Loading

Images are lazy-loaded using the `useLazyImage` hook:

```typescript
import { useLazyImage } from '@/hooks/useLazyImage';

const { ref, src, isLoading } = useLazyImage(imageSrc, {
  rootMargin: '50px',
  threshold: 0.01,
});
```

### Optimized Image Component

Use the `OptimizedImage` component for automatic optimization:

```tsx
import OptimizedImage from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  quality={85}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Image Compression

Images are automatically compressed on upload:

```typescript
import { compressImageWithPreset } from '@/lib/image-utils';

const compressed = await compressImageWithPreset(file, 'standard');
```

Quality presets:
- **thumbnail** - 70% quality
- **preview** - 80% quality
- **standard** - 85% quality (recommended)
- **high** - 90% quality
- **maximum** - 95% quality

### Modern Image Formats

Next.js automatically serves images in modern formats:
- **AVIF** - Best compression, supported by modern browsers
- **WebP** - Good compression, widely supported
- **JPEG/PNG** - Fallback for older browsers

## Bundle Size Optimization

### Tailwind CSS JIT Mode

Tailwind CSS uses Just-In-Time mode to generate only the CSS classes you use:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // JIT mode is enabled by default in v3+
};
```

### Tree Shaking

Unused code is automatically removed in production builds:

```typescript
// ✅ Good - Tree-shakeable
import { format } from 'date-fns';

// ❌ Bad - Imports entire library
import dateFns from 'date-fns';
```

### CSS Purging

Unused CSS is automatically removed:
- Tailwind CSS classes not used in your code are removed
- Only the CSS you need is included in the final bundle

### Production Optimizations

The following optimizations are applied in production:

1. **Minification** - JavaScript and CSS are minified
2. **Compression** - Gzip compression is enabled
3. **Source Maps** - Disabled in production for smaller bundles
4. **Console Removal** - Console logs are removed (except errors and warnings)
5. **Dead Code Elimination** - Unused code is removed

## Bundle Analysis

### Analyze Bundle Size

Run the bundle analyzer to see what's in your bundle:

```bash
npm run build:analyze
```

This will:
1. Build the production bundle
2. Analyze all chunks and their sizes
3. Show warnings for bundles exceeding size limits
4. Provide optimization recommendations

### Bundle Size Limits

The following limits are enforced:

- **First Load JS** - 250 KB
- **Page Bundles** - 150 KB
- **Shared Chunks** - 100 KB
- **CSS Files** - 50 KB

Warnings are shown if these limits are exceeded.

## Performance Budgets

The application monitors the following metrics:

- **TTFB** (Time to First Byte) - < 600ms
- **FCP** (First Contentful Paint) - < 1800ms
- **LCP** (Largest Contentful Paint) - < 2500ms
- **TTI** (Time to Interactive) - < 3800ms
- **TBT** (Total Blocking Time) - < 300ms
- **CLS** (Cumulative Layout Shift) - < 0.1

## Caching Strategy

### Static Assets

Static assets are cached for 1 year:
- Images
- Fonts
- JavaScript bundles
- CSS files

### API Responses

API responses use appropriate cache headers:
- **Public data** - Cached for 5 minutes
- **User data** - No cache
- **Static content** - Cached for 1 hour

### Image Cache

Optimized images are cached for 1 year:

```javascript
// next.config.js
images: {
  minimumCacheTTL: 31536000, // 1 year
}
```

## Best Practices

### 1. Use Dynamic Imports for Heavy Components

```typescript
// ✅ Good
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => <Skeleton />,
});

// ❌ Bad
import HeavyComponent from './HeavyComponent';
```

### 2. Optimize Images Before Upload

```typescript
// ✅ Good
const compressed = await compressImageWithPreset(file, 'standard');
const sizes = await generateResponsiveImages(compressed);

// ❌ Bad
// Uploading large uncompressed images
```

### 3. Use Lazy Loading for Below-the-Fold Content

```typescript
// ✅ Good
<OptimizedImage
  src="/image.jpg"
  alt="Below fold"
  priority={false} // Lazy load
/>

// ❌ Bad
<OptimizedImage
  src="/image.jpg"
  alt="Below fold"
  priority={true} // Eager load
/>
```

### 4. Import Only What You Need

```typescript
// ✅ Good
import { motion } from 'framer-motion';

// ❌ Bad
import * as FramerMotion from 'framer-motion';
```

### 5. Use the Optimized Components

```typescript
// ✅ Good
import { AnimatedSection } from '@/lib/lazy-components';

// ❌ Bad
import AnimatedSection from '@/components/microsites/AnimatedSection';
```

## Monitoring

### Development

Monitor bundle size during development:

```bash
npm run dev
# Check the terminal for bundle size warnings
```

### Production

Monitor performance metrics in production:
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track bundle sizes over time

## Troubleshooting

### Large Bundle Size

If your bundle is too large:

1. Run `npm run build:analyze` to identify large chunks
2. Check for duplicate dependencies
3. Ensure you're using dynamic imports for heavy components
4. Verify tree shaking is working (use named imports)

### Slow Image Loading

If images load slowly:

1. Ensure images are compressed
2. Use responsive image sizes
3. Enable lazy loading for below-the-fold images
4. Use modern image formats (AVIF, WebP)

### High First Load JS

If First Load JS is too high:

1. Move heavy components to dynamic imports
2. Split vendor chunks
3. Remove unused dependencies
4. Check for duplicate code in chunks

## Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)
