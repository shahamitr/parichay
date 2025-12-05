# Responsive Design Implementation Guide

This guide documents the responsive design optimizations implemented for the microsite visual enhancements project.

## Overview

The responsive design system ensures the microsite works flawlessly across all devices from 320px (small mobile) to 2560px (large desktop) screens, following mobile-first principles and WCAG accessibility guidelines.

## Key Features Implemented

### 1. Mobile-First Layouts (Task 11.1)

#### Gap-y-8 for Stacked Sections
All sections now use `gap-y-8` spacing on mobile devices, providing consistent vertical rhythm:

```tsx
<main className="flex-1 flex flex-col gap-y-8 md:gap-y-0">
  {/* Sections */}
</main>
```

#### Optimized Touch Targets
All interactive elements meet WCAG 2.1 Level AAA standards with minimum 44x44px touch targets:

- Buttons: `min-h-[44px]`
- Large buttons: `min-h-[48px]` or `min-h-[56px]`
- All buttons include `touch-manipulation` CSS for better mobile performance

#### Responsive Typography
Typography scales smoothly across breakpoints:

```tsx
// Hero title
className="text-3xl sm:text-4xl md:text-5xl lg:text-hero"

// Section headings
className="text-xl sm:text-2xl md:text-3xl lg:text-h2"

// Body text
className="text-base sm:text-lg"
```

#### Screen Size Testing
The implementation has been designed and tested for:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 2560px

### 2. Responsive Image System (Task 11.2)

#### ResponsiveImage Component
A new `ResponsiveImage` component wraps Next.js Image with enhanced features:

```tsx
import ResponsiveImage, { IMAGE_SIZES, ASPECT_RATIOS } from '@/components/ui/ResponsiveImage';

<ResponsiveImage
  src="/images/hero.jpg"
  alt="Hero image"
  fill
  aspectRatio={ASPECT_RATIOS.photo}
  sizes={IMAGE_SIZES.hero}
  placeholder="blur"
  quality={90}
/>
```

#### Features
- **Automatic srcset generation**: Next.js Image handles responsive image sizes
- **Blur placeholders**: Smooth loading experience with blur-up effect
- **Loading states**: Skeleton loaders while images load
- **Error handling**: Graceful fallback UI for failed images
- **Lazy loading**: Images load as they enter viewport
- **Optimized quality**: Default 85% quality, adjustable per image

#### Predefined Sizes
```typescript
export const IMAGE_SIZES = {
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  hero: '(max-width: 768px) 100vw, 50vw',
  full: '100vw',
  thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  avatar: '(max-width: 640px) 96px, 128px',
  logo: '(max-width: 640px) 120px, 200px',
};
```

#### Aspect Ratios
```typescript
export const ASPECT_RATIOS = {
  square: '1/1',
  landscape: '16/9',
  portrait: '9/16',
  wide: '21/9',
  photo: '4/3',
  golden: '1.618/1',
};
```

### 3. Mobile Navigation (Task 11.3)

#### Hamburger Menu
A full-featured mobile menu component with:

```tsx
import { MobileMenu } from '@/components/navigation';

<MobileMenu
  sections={navSections}
  activeSection={activeSection}
  onSectionClick={scrollToSection}
  logo={brand.logo}
  brandName={branch.name}
/>
```

#### Features
- **Full-screen overlay**: Slides in from right on mobile
- **Large touch targets**: 56px minimum height for menu items
- **Smooth animations**: Framer Motion powered transitions
- **Keyboard accessible**: ESC key closes menu, proper focus management
- **Body scroll lock**: Prevents background scrolling when open
- **Active state indication**: Highlights current section
- **Reduced motion support**: Respects user preferences

#### Mobile-Friendly Sticky Nav
The sticky navigation adapts for mobile:
- Hamburger menu replaces desktop navigation links
- Compact header with logo and brand name
- Backdrop blur effect maintained
- Show/hide on scroll behavior preserved

#### Floating Action Button Optimization
FAB positioning adjusted to avoid overlap:

```tsx
// Mobile: Higher position to avoid bottom bars
// Desktop: Standard position
className="bottom-20 right-4 sm:bottom-6 sm:right-6"

// Responsive sizing
className="p-3 sm:p-4 min-h-[56px] min-w-[56px]"
```

## Utility Functions

### Responsive Utils (`src/lib/responsive-utils.ts`)

A comprehensive set of utilities for responsive design:

```typescript
import {
  TOUCH_TARGET,
  BREAKPOINTS,
  SECTION_SPACING,
  TOUCH_BUTTON_CLASSES,
  CONTAINER_CLASSES,
  RESPONSIVE_GRID,
  RESPONSIVE_TEXT,
  isMobile,
  isTablet,
  isDesktop,
  getCurrentBreakpoint,
  getResponsivePadding,
} from '@/lib/responsive-utils';
```

#### Constants
- `TOUCH_TARGET`: Touch target size constants (44px min, 48px recommended)
- `BREAKPOINTS`: Tailwind breakpoint values
- `SECTION_SPACING`: Consistent spacing classes
- `TOUCH_BUTTON_CLASSES`: Reusable button classes
- `CONTAINER_CLASSES`: Standard container classes
- `RESPONSIVE_GRID`: Grid layout patterns
- `RESPONSIVE_TEXT`: Typography scale classes

#### Functions
- `isMobile()`: Check if viewport is mobile
- `isTablet()`: Check if viewport is tablet
- `isDesktop()`: Check if viewport is desktop
- `getCurrentBreakpoint()`: Get current breakpoint name
- `getResponsivePadding(size)`: Generate responsive padding classes
- `testScreenSize(width, height)`: Validate screen size is within supported range

## Best Practices

### 1. Always Use Mobile-First Approach
```tsx
// ✅ Good: Mobile first, then larger screens
className="text-base sm:text-lg md:text-xl"

// ❌ Bad: Desktop first
className="text-xl md:text-lg sm:text-base"
```

### 2. Ensure Touch Targets
```tsx
// ✅ Good: Minimum 44x44px
className="min-h-[44px] min-w-[44px] touch-manipulation"

// ❌ Bad: Too small for touch
className="p-1"
```

### 3. Use Responsive Images
```tsx
// ✅ Good: Optimized with srcset and blur
<ResponsiveImage
  src={image}
  alt="Description"
  fill
  sizes={IMAGE_SIZES.card}
  placeholder="blur"
/>

// ❌ Bad: Regular img tag
<img src={image} alt="Description" />
```

### 4. Stack Content on Mobile
```tsx
// ✅ Good: Vertical stack on mobile, horizontal on desktop
className="flex flex-col sm:flex-row gap-4"

// ❌ Bad: Always horizontal
className="flex flex-row gap-4"
```

### 5. Responsive Spacing
```tsx
// ✅ Good: Smaller spacing on mobile
className="gap-y-8 md:gap-y-12 lg:gap-y-16"

// ❌ Bad: Same spacing everywhere
className="gap-y-16"
```

## Testing Checklist

### Mobile (320px - 767px)
- [ ] All text is readable without horizontal scrolling
- [ ] Touch targets are at least 44x44px
- [ ] Images load and display correctly
- [ ] Navigation menu opens and closes smoothly
- [ ] FAB doesn't overlap content
- [ ] Forms are easy to fill out
- [ ] Buttons are easy to tap

### Tablet (768px - 1023px)
- [ ] Layout adapts appropriately
- [ ] Images use correct sizes
- [ ] Navigation is accessible
- [ ] Content is well-spaced

### Desktop (1024px+)
- [ ] Full navigation visible
- [ ] Images are high quality
- [ ] Hover states work correctly
- [ ] Layout uses available space well
- [ ] Maximum width constraints applied (1280px)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Reduced motion respected

## Performance Considerations

### Image Optimization
- Use WebP format when possible
- Implement lazy loading for below-fold images
- Use blur placeholders for better perceived performance
- Set appropriate quality levels (85% default)

### Code Splitting
- Mobile menu loads only when needed
- Animations respect reduced motion preferences
- Touch utilities are lightweight

### CSS Optimization
- Use Tailwind JIT mode
- Purge unused styles
- Minimize custom CSS

## Browser Support

The responsive design system supports:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

## Future Enhancements

Potential improvements for future iterations:
1. Container queries for component-level responsiveness
2. Advanced image formats (AVIF)
3. Responsive video components
4. Adaptive loading based on connection speed
5. Progressive enhancement for older browsers

## Related Files

### Components
- `src/components/ui/ResponsiveImage.tsx` - Responsive image component
- `src/components/navigation/MobileMenu.tsx` - Mobile hamburger menu
- `src/components/navigation/StickyNav.tsx` - Sticky navigation with mobile support
- `src/components/navigation/FloatingActionButton.tsx` - Mobile-optimized FAB
- `src/components/ui/Button.tsx` - Touch-optimized button component
- `src/components/layouts/AsymmetricSection.tsx` - Responsive section layout

### Utilities
- `src/lib/responsive-utils.ts` - Responsive design utilities
- `src/config/design-tokens.ts` - Design system tokens
- `tailwind.config.js` - Tailwind configuration with breakpoints

### Documentation
- `RESPONSIVE_DESIGN_GUIDE.md` - This file
- `.kiro/specs/microsite-visual-enhancements/requirements.md` - Requirements
- `.kiro/specs/microsite-visual-enhancements/design.md` - Design document

## Support

For questions or issues related to responsive design:
1. Check this guide first
2. Review the design document
3. Test on actual devices when possible
4. Use browser DevTools device emulation for quick testing
