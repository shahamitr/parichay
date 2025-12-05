# Design System Documentation

## Overview

This design system provides a comprehensive set of design tokens and utilities for building consistent, accessible, and visually appealing user interfaces across the microsite platform.

## Design Tokens

Design tokens are stored in `src/config/design-tokens.ts` and include:

### Colors

#### Primary Colors
Used for main brand elements, CTAs, and interactive components.
- `primary-50` to `primary-900` - Purple gradient scale
- Main color: `primary-500` (#7b61ff)

#### Accent Colors
Used for highlights, secondary actions, and visual interest.
- `accent-50` to `accent-900` - Orange gradient scale
- Main color: `accent-500` (#ff7b00)

#### Neutral Colors
Used for text, backgrounds, and borders.
- `neutral-50` to `neutral-900` - Gray scale
- Main color: `neutral-500` (#737373)

#### Semantic Colors
- **Success**: `success-50`, `success-500`, `success-900`
- **Warning**: `warning-50`, `warning-500`, `warning-900`
- **Error**: `error-50`, `error-500`, `error-900`

### Typography

#### Font Families
- `font-sans` - Inter (default body text)
- `font-display` - Cal Sans (headings and hero text)
- `font-mono` - JetBrains Mono (code)

#### Font Sizes
- `text-hero` - 48px (3rem) - Hero sections
- `text-h1` - 36px (2.25rem) - Main headings
- `text-h2` - 30px (1.875rem) - Section headings
- `text-h3` - 24px (1.5rem) - Subsection headings
- `text-h4` - 20px (1.25rem) - Card headings
- `text-body` - 18px (1.125rem) - Body text
- `text-base` - 16px (1rem) - Default text
- `text-small` - 14px (0.875rem) - Small text

#### Font Weights
- `font-normal` - 400
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700

### Spacing

- `spacing-section` - 4rem (64px) - Between major sections
- `spacing-container` - 2rem (32px) - Container padding
- `spacing-element` - 1.5rem (24px) - Between elements
- `spacing-compact` - 1rem (16px) - Compact spacing
- `spacing-tight` - 0.5rem (8px) - Tight spacing

### Border Radius

- `rounded-sm` - 6px
- `rounded-md` - 8px
- `rounded-lg` - 12px
- `rounded-xl` - 16px
- `rounded-2xl` - 24px
- `rounded-3xl` - 32px

### Shadows

- `shadow-sm` - Subtle shadow
- `shadow-soft` - Soft medium shadow
- `shadow-soft-lg` - Soft large shadow
- `shadow-soft-xl` - Extra large shadow
- `shadow-soft-2xl` - Maximum shadow

## Usage Examples

### Using Colors in Tailwind

```tsx
// Background colors
<div className="bg-primary-500">Primary background</div>
<div className="bg-accent-100">Light accent background</div>

// Text colors
<p className="text-neutral-700">Body text</p>
<h1 className="text-primary-600">Primary heading</h1>

// Border colors
<div className="border border-neutral-200">Bordered element</div>
```

### Using Typography

```tsx
// Headings
<h1 className="text-h1 font-bold text-neutral-900">Main Heading</h1>
<h2 className="text-h2 font-bold">Section Heading</h2>

// Body text
<p className="text-body text-neutral-700 leading-relaxed">
  Body paragraph with relaxed line height
</p>

// Hero text
<h1 className="text-hero font-bold text-gradient-primary">
  Hero Title
</h1>
```

### Using Spacing

```tsx
// Section spacing
<section className="py-section">
  <div className="container-custom">
    {/* Content */}
  </div>
</section>

// Element spacing
<div className="space-y-element">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Using Gradients

```tsx
// Gradient backgrounds
<div className="gradient-primary text-white">
  Primary gradient background
</div>

<div className="gradient-pastel">
  Subtle pastel gradient
</div>

// Gradient text
<h1 className="text-gradient-primary">
  Gradient text effect
</h1>
```

### Using Component Classes

```tsx
// Card with hover effect
<div className="card-base card-hover p-6">
  Card content
</div>

// Glassmorphism effect
<div className="glass p-6 rounded-xl">
  Glass effect content
</div>

// Container
<div className="container-custom">
  Centered content with max-width
</div>
```

### Using Animations

```tsx
// Fade up animation
<div className="animate-fade-up">
  Content fades up on load
</div>

// Scale in animation
<div className="animate-scale-in">
  Content scales in
</div>
```

## Utility Functions

Import design system utilities:

```tsx
import {
  getColor,
  getSpacing,
  getGradient,
  cn,
  designTokens
} from '@/lib/design-system';

// Get color value
const primaryColor = getColor('primary', 500); // '#7b61ff'

// Get spacing value
const sectionSpacing = getSpacing('section'); // '4rem'

// Get gradient
const gradient = getGradient('primary');

// Combine class names
const buttonClasses = cn(
  'px-6 py-3 rounded-xl',
  isActive && 'bg-primary-500',
  isDisabled && 'opacity-50'
);
```

## Accessibility

### Focus States
All interactive elements automatically receive focus indicators:
```tsx
// Automatic focus ring on interactive elements
<button className="...">
  Button with focus ring
</button>
```

### Color Contrast
All color combinations meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### Reduced Motion
Animations respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations are disabled */
}
```

## Best Practices

1. **Use design tokens consistently** - Always use the predefined colors, spacing, and typography values
2. **Maintain visual hierarchy** - Use the typography scale appropriately
3. **Limit gradient usage** - Use gradients sparingly for buttons, headers, and accent elements
4. **Test accessibility** - Ensure proper contrast and keyboard navigation
5. **Responsive design** - Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)

## Customization

To customize the design system for a specific brand:

```tsx
import { generateCSSVariables } from '@/lib/design-system';

const customTheme = generateCSSVariables({
  primary: '#custom-color',
  accent: '#custom-accent',
  neutral: '#custom-neutral',
});

// Apply to a component
<div style={customTheme}>
  {/* Themed content */}
</div>
```

## File Structure

```
src/
├── config/
│   ├── design-tokens.ts      # Design token definitions
│   └── DESIGN_SYSTEM.md      # This documentation
├── lib/
│   └── design-system.ts      # Utility functions
└── app/
    └── globals.css           # Global styles and utilities
```
