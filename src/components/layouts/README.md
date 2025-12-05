# Asymmetric Layout System

A comprehensive layout system for creating visually engaging, asymmetric sections with decorative backgrounds and consistent spacing.

## Overview

This layout system implements Requirements 1.1, 1.2, 1.3, 1.4, and 1.5 from the microsite visual enhancements specification:

- **1.1**: Asymmetric layouts with alternating image-text positions
- **1.2**: Container width constraints (max-w-6xl / 1280px)
- **1.3**: Decorative background elements (SVG blobs, gradients)
- **1.4**: Consistent vertical spacing (64px between sections)
- **1.5**: Fully responsive for mobile devices

## Components

### AsymmetricSection

Creates sections with alternating image-left/text-right and text-left/image-right layouts.

```tsx
import { AsymmetricSection, getAlternatingPosition } from '@/components/layouts';

// Basic usage
<AsymmetricSection
  imagePosition="left"
  image="/path/to/image.jpg"
  imageAlt="Description"
  title="Section Title"
  subtitle="Optional subtitle"
  content={<p>Your content here</p>}
  background="white"
/>

// Automatic alternation
{sections.map((section, index) => (
  <AsymmetricSection
    key={index}
    imagePosition={getAlternatingPosition(index)}
    {...section}
  />
))}
```

**Props:**
- `imagePosition`: 'left' | 'right' - Position of the image
- `image`: string - Image URL
- `imageAlt`: string (optional) - Alt text for image
- `title`: string - Section title
- `subtitle`: string (optional) - Section subtitle
- `content`: React.ReactNode - Section content
- `background`: 'white' | 'gray' | 'gradient' (optional) - Background style
- `className`: string (optional) - Additional CSS classes

### DecorativeBackground

Adds decorative background elements to sections.

```tsx
import { DecorativeBackground, BlobShape, HeadingBackground } from '@/components/layouts';

// Full decorative background
<DecorativeBackground variant="blobs" intensity="medium">
  <YourContent />
</DecorativeBackground>

// Individual blob shapes
<BlobShape
  color="purple"
  position="top-right"
  size="lg"
  opacity={0.2}
/>

// Heading with background effect
<HeadingBackground variant="blob" color="primary">
  <h2>Your Heading</h2>
</HeadingBackground>
```

**DecorativeBackground Props:**
- `variant`: 'blobs' | 'gradient' | 'mesh' | 'minimal' - Background style
- `intensity`: 'light' | 'medium' | 'strong' - Opacity intensity
- `className`: string (optional) - Additional CSS classes

**BlobShape Props:**
- `color`: string - Color name (blue, purple, pink, orange, etc.)
- `opacity`: number - Opacity value (0-1)
- `size`: 'sm' | 'md' | 'lg' | 'xl' - Blob size
- `position`: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
- `blur`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' - Blur intensity

**HeadingBackground Props:**
- `variant`: 'blob' | 'underline' | 'highlight' | 'gradient' - Effect style
- `color`: string - Color name
- `children`: React.ReactNode - Heading element

### Container & Section

Provides consistent width constraints and spacing.

```tsx
import { Container, Section, SectionSpacer, GridContainer } from '@/components/layouts';

// Basic container
<Container maxWidth="6xl" padding="md" verticalSpacing="lg">
  <YourContent />
</Container>

// Semantic section with built-in container
<Section background="gray" verticalSpacing="xl">
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>

// Spacing between sections
<Section>Content 1</Section>
<SectionSpacer size="lg" />
<Section>Content 2</Section>

// Responsive grid
<GridContainer columns={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</GridContainer>
```

**Container Props:**
- `maxWidth`: '6xl' | '7xl' | 'full' - Maximum width (default: '6xl' = 1280px)
- `padding`: 'none' | 'sm' | 'md' | 'lg' - Horizontal padding
- `verticalSpacing`: 'none' | 'sm' | 'md' | 'lg' | 'xl' - Vertical padding
- `className`: string (optional) - Additional CSS classes

**Section Props:**
- All Container props, plus:
- `background`: 'white' | 'gray' | 'gradient' | 'transparent' - Background style

**GridContainer Props:**
- `columns`: 1 | 2 | 3 | 4 - Number of columns (responsive)
- `gap`: 'sm' | 'md' | 'lg' | 'xl' - Gap between items
- `className`: string (optional) - Additional CSS classes

## Design Specifications

### Width Constraints (Requirement 1.2)
- Default max-width: **1280px** (max-w-6xl)
- Alternative: 1536px (max-w-7xl) or full width
- Responsive horizontal padding: 16px → 24px → 32px

### Vertical Spacing (Requirement 1.4)
- Section spacing: **64px** (py-16)
- Consistent spacing between major sections
- Responsive adjustments for mobile

### Responsive Behavior (Requirement 1.5)
- Mobile: Stacked layout (single column)
- Tablet: 2-column grid where appropriate
- Desktop: Full asymmetric layout with 2 columns
- Touch targets: Minimum 44x44px

## Usage Examples

### Example 1: About Section with Alternating Layout

```tsx
export function AboutPage() {
  const features = [
    {
      image: '/images/innovation.jpg',
      title: 'Innovation First',
      content: 'We push boundaries and explore new possibilities.',
    },
    {
      image: '/images/quality.jpg',
      title: 'Quality Assured',
      content: 'Every product meets the highest standards.',
    },
  ];

  return (
    <>
      {features.map((feature, index) => (
        <AsymmetricSection
          key={index}
          imagePosition={getAlternatingPosition(index)}
          image={feature.image}
          title={feature.title}
          background={index % 2 === 0 ? 'white' : 'gray'}
          content={<p>{feature.content}</p>}
        />
      ))}
    </>
  );
}
```

### Example 2: Services Section with Decorative Background

```tsx
export function ServicesSection() {
  return (
    <Section background="white" verticalSpacing="xl">
      <DecorativeBackground variant="blobs" intensity="medium">
        <div className="text-center space-y-8">
          <HeadingBackground variant="gradient" color="primary">
            <h2 className="text-h1 font-bold">Our Services</h2>
          </HeadingBackground>

          <GridContainer columns={3} gap="lg">
            <Card elevation="md" hover>
              <h3>Web Development</h3>
              <p>Custom websites built with modern tech</p>
            </Card>
            <Card elevation="md" hover>
              <h3>Mobile Apps</h3>
              <p>Native and cross-platform apps</p>
            </Card>
            <Card elevation="md" hover>
              <h3>Cloud Solutions</h3>
              <p>Scalable infrastructure</p>
            </Card>
          </GridContainer>
        </div>
      </DecorativeBackground>
    </Section>
  );
}
```

### Example 3: Hero Section with Custom Blobs

```tsx
export function HeroSection() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <BlobShape color="purple" position="top-left" size="xl" opacity={0.15} />
      <BlobShape color="blue" position="top-right" size="lg" opacity={0.2} />
      <BlobShape color="orange" position="bottom-left" size="md" opacity={0.25} />

      <Container maxWidth="6xl" verticalSpacing="xl">
        <div className="text-center space-y-6">
          <h1 className="text-hero font-bold">Welcome</h1>
          <p className="text-h3 text-gray-600">
            Experience modern design
          </p>
        </div>
      </Container>
    </div>
  );
}
```

## Best Practices

1. **Use getAlternatingPosition()** for automatic image position alternation
2. **Combine with design tokens** from `@/config/design-tokens`
3. **Apply consistent spacing** using SectionSpacer between major sections
4. **Use decorative backgrounds sparingly** - intensity 'light' or 'medium' recommended
5. **Test on mobile devices** to ensure proper stacking and touch targets
6. **Maintain max-w-6xl** for optimal readability (1280px)
7. **Use semantic HTML** - Section component renders `<section>` tags

## Accessibility

- All decorative elements have `aria-hidden="true"`
- Proper semantic HTML structure
- Images require alt text
- Keyboard navigation supported
- Focus indicators visible
- Color contrast meets WCAG AA standards

## Performance

- Images use Next.js Image component with optimization
- Lazy loading enabled by default
- Responsive images with srcset
- CSS-only decorative elements (no JavaScript)
- Minimal bundle size impact

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Mobile Safari and Chrome tested
- Responsive design from 320px to 2560px

## Related Components

- [Button Component](../ui/Button.tsx)
- [Card Component](../ui/Card.tsx)
- [Design Tokens](../../config/design-tokens.ts)

## Further Reading

- [Design Document](.kiro/specs/microsite-visual-enhancements/design.md)
- [Requirements Document](.kiro/specs/microsite-visual-enhancements/requirements.md)
- [Tasks Document](.kiro/specs/microsite-visual-enhancements/tasks.md)
