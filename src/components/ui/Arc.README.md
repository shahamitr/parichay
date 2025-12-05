# Arc Component Documentation

## Overview

The `Arc` component is a reusable, decorative SVG element designed to add visual separation and enhance the aestheticpeal of microsite sections. It creates smooth, curved arc shapes that can be positioned at the top or bottom of sections.

## Features

- ✅ **Responsive Design**: Automatically adjusts size for mobile, tablet, and desktop screens
- ✅ **Brand Theming**: Supports custom colors for seamless brand integration
- ✅ **Customizable Curve**: Adjustable curve intensity (0-100)
- ✅ **Flexible Positioning**: Can be placed at top or bottom of sections
- ✅ **Multiple Sizes**: Small, medium, and large size options
- ✅ **Smooth SVG Rendering**: Scalable vector graphics for crisp display at any resolution
- ✅ **Accessibility**: Properly marked with `aria-hidden` for screen readers
- ✅ **Performance**: Lightweight and optimized for fast rendering

## Installation

The component is located at `src/components/ui/Arc.tsx` and can be imported directly:

```tsx
import Arc from '@/components/ui/Arc';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top' \| 'bottom'` | **Required** | Position of the arc relative to the section |
| `color` | `string` | `'#FF6B35'` | Color of the arc (hex, rgb, or CSS color name) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the arc |
| `curveIntensity` | `number` | `50` | Curve intensity (0-100). Higher values create more pronounced curves |
| `className` | `string` | `''` | Additional CSS classes |
| `flip` | `boolean` | `false` | Whether to flip the arc horizontally |

## Size Reference

**Optimized for mobile-first design with proper spacing across all devices**

### Small
- Mobile: 30px height (320px - 640px width)
- Tablet: 60px height (640px - 1024px width)
- Desktop: 80px height (1024px+ width)

### Medium (Recommended)
- Mobile: 35px height (320px - 640px width)
- Tablet: 70px height (640px - 1024px width)
- Desktop: 90px height (1024px+ width)

### Large
- Mobile: 40px height (320px - 640px width)
- Tablet: 80px height (640px - 1024px width)
- Desktop: 100px height (1024px+ width)

## Usage Examples

### Basic Usage

```tsx
import Arc from '@/components/ui/Arc';

function MySection() {
  return (
    <section className="relative bg-white py-16">
      <Arc position="top" color="#FF6B35" size="medium" />
      <div className="container mx-auto px-4">
        <h2>Section Content</h2>
      </div>
    </section>
  );
}
```

### With Brand Theming

```tsx
function BrandedSection({ brand }) {
  const primaryColor = brand.colorTheme.primary;

  return (
    <section className="relative bg-gray-50 py-16">
      <Arc position="top" color={primaryColor} size="large" />
      <div className="container mx-auto px-4">
        <h2>Branded Content</h2>
      </div>
      <Arc position="bottom" color={primaryColor} size="large" />
    </section>
  );
}
```

### Both Top and Bottom Arcs

```tsx
function FullyDecoratedSection() {
  return (
    <section className="relative bg-white py-20">
      <Arc position="top" color="#4A90E2" size="medium" curveIntensity={60} />

      <div className="container mx-auto px-4">
        <h2>Content with decorative arcs</h2>
        <p>This section has arcs on both top and bottom</p>
      </div>

      <Arc position="bottom" color="#4A90E2" size="medium" curveIntensity={60} />
    </section>
  );
}
```

### Custom Curve Intensity

```tsx
// Subtle curve
<Arc position="top" color="#FF6B35" size="medium" curveIntensity={30} />

// Moderate curve (default)
<Arc position="top" color="#FF6B35" size="medium" curveIntensity={50} />

// Pronounced curve
<Arc position="top" color="#FF6B35" size="medium" curveIntensity={80} />
```

### Flipped Arc for Variety

```tsx
function VariedSection() {
  return (
    <section className="relative bg-white py-16">
      <Arc position="top" color="#FF6B35" size="medium" flip={true} />
      <div className="container mx-auto px-4">
        <h2>Content</h2>
      </div>
      <Arc position="bottom" color="#FF6B35" size="medium" />
    </section>
  );
}
```

## Integration with Microsite Sections

### ProfileSection Example

```tsx
import Arc from '@/components/ui/Arc';

function ProfileSection({ branch, brand }) {
  const primaryColor = brand.colorTheme.primary;

  return (
    <section className="relative bg-white min-h-screen">
      <Arc position="top" color={primaryColor} size="medium" />

      {/* Profile content */}
      <div className="container mx-auto px-4 py-16">
        {/* ... profile content ... */}
      </div>

      <Arc position="bottom" color={primaryColor} size="medium" />
    </section>
  );
}
```

### HeroSection Example

```tsx
import Arc from '@/components/ui/Arc';

function HeroSection({ config, brand }) {
  const primaryColor = brand.colorTheme.primary;

  return (
    <section className="relative min-h-[500px]">
      {/* Hero content */}
      <div className="container mx-auto px-4">
        <h1>{config.title}</h1>
        <p>{config.subtitle}</p>
      </div>

      <Arc position="bottom" color={primaryColor} size="large" curveIntensity={65} />
    </section>
  );
}
```

### AboutSection Example

```tsx
import Arc from '@/components/ui/Arc';

function AboutSection({ config, brand }) {
  const primaryColor = brand.colorTheme.primary;

  return (
    <section className="relative bg-gray-50 py-20">
      <Arc position="top" color={primaryColor} size="medium" />

      <div className="container mx-auto px-4">
        <h2>About Us</h2>
        <p>{config.content}</p>
      </div>

      <Arc position="bottom" color={primaryColor} size="medium" />
    </section>
  );
}
```

## Best Practices

### 1. Color Selection
- Use brand primary color for consistency
- Ensure sufficient contrast with section background
- Consider using secondary or accent colors for variety

### 2. Positioning
- Use toto transition from previous section
- Use bottom arcs to transition to next section
- Use both for fully enclosed sections

### 3. Size Selection
- **Small**: For subtle decoration or tight spacing
- **Medium**: For standard sections (recommended default)
- **Large**: For hero sections or prominent areas

### 4. Curve Intensity
- **30-40**: Subtle, gentle curves
- **50-60**: Moderate curves (recommended)
- **70-80**: Pronounced, dramatic curves

### 5. Performance
- Arcs are lightweight SVG elements
- Use sparingly (1-2 per section) for best visual impact
- The component is optimized with `pointer-events-none`

## Accessibility

The Arc component is properly configured for accessibility:
- Marked with `aria-hidden="true"` (decorative element)
- Does not interfere with screen readers
- Does not block pointer events

## Browser Support

The Arc component uses standard SVG features and is supported in:
- ✅ Chrome/Edge (all modern versions)
- ✅ Firefox (all modern versions)
- ✅ Safari (all modern versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### SVG Path Generation

The component uses quadratic Bezier curves to create smooth arcs:
- Top arcs curve downward
- Bottom arcs curve upward
- Curve intensity controls the control point position

### Responsive Implementation

Three separate SVG elements are rendered for different breakpoints:
- Mobile: `< 640px` (Tailwind `sm` breakpoint)
- Tablet: `640px - 1024px` (Tailwind `sm` to `lg`)
- Desktop: `>= 1024px` (Tailwind `lg` breakpoint)

This ensures optimal rendering at each screen size without scaling artifacts.

## Troubleshooting

### Arc not visible
- Check that the parent section has `position: relative`
- Verify the color contrasts with the background
- Ensure the section has sufficient height

### Arc overlapping content
- Adjust the section's padding to accommodate the arc height
- Use z-index on content if needed: `relative z-10`

### Arc appears stretched or distorted
- This is expected behavior - the arc fills the full width
- Adjust `curveIntensity` if the curve appears too flat or too steep

## Related Components

- `ProfileSection`: Uses arcs for decorative corners
- `HeroSection`: Can use bottom arc for transition
- `AboutSection`: Can use top and bottom arcs
- `ServicesSection`: Can use arcs for visual separation

## Requirements Satisfied

This component satisfies the following requirements:
- **Requirement 4.3**: Predefined sections for business information
- **Requirement 15.1**: Template marketplace with multiple layout options

## Future Enhancements

Potential future improvements:
- [ ] Animated arcs (wave effect)
- [ ] Gradient fill support
- [ ] Multiple curve patterns (sine wave, multiple peaks)
- [ ] Shadow/glow effects
