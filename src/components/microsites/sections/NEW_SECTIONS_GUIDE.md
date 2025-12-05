# New Content Sections Guide

This guide explains how to use the new premium content sections added to the microsite builder.

## Overview

Four new sections have been added to enhance the visual appeal and credibility of microsites:

1. **Impact/Metrics Section** - Display key business metrics and achievements
2. **Testimonials Section** - Showcase customer reviews with photos and ratings
3. **CTA Section** - Create prominent call-to-action sections with strong visual emphasis
4. **Trust Indicators Section** - Display certifications, awards, and partner logos

## 1. Impact/Metrics Section

### Purpose
Display key business metrics that demonstrate your impact and success (e.g., clients served, years in business, satisfaction ratings).

### Configuration

```typescript
impact: {
  enabled: true,
  metrics: [
    {
      value: "500+",
      label: "Happy Clients",
      icon: "users"
    },
    {
      value: "15",
      label: "Years Experience",
      icon: "award"
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: "star"
    },
    {
      value: "50+",
      label: "Locations",
      icon: "location"
    }
  ]
}
```

### Features
- Animated number counters that count up when scrolled into view
- Responsive grid layout (1-4 columns)
- Icon support for each metric
- Hover effects with gradient accents
- Automatic number parsing (supports formats like "500+", "98%", "1.5K", "2M")

### Available Icons
- `trending` - TrendingUp icon
- `users` - Users icon
- `location` - MapPin icon
- `star` - Star icon
- `award` - Award icon
- `target` - Target icon (default)

## 2. Testimonials Section

### Purpose
Build trust by showcasing real customer testimonials with photos, names, roles, and star ratings.

### Configuration

```typescript
testimonials: {
  enabled: true,
  items: [
    {
      id: "1",
      name: "John Smith",
      role: "CEO, Tech Corp",
      photo: "https://example.com/photo.jpg", // Optional
      content: "Excellent service! The team went above and beyond to meet our needs.",
      rating: 5
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Marketing Director",
      content: "Professional, reliable, and results-driven. Highly recommend!",
      rating: 5
    }
  ]
}
```

### Features
- Carousel/slider for multiple testimonials with navigation arrows
- Star rating display (1-5 stars)
- Customer photo with verified badge
- Smooth transitions between testimonials
- Carousel indicators (dots)
- Grid view for 3+ testimonials (shows first 3 in cards)
- Automatic fallback to placeholder avatars if no photo provided

### Best Practices
- Use high-quality customer photos
- Keep testimonial content concise (2-3 sentences)
- Include full name and role/company for credibility
- Aim for 3-6 testimonials for best impact

## 3. CTA (Call-to-Action) Section

### Purpose
Create a prominent, visually striking section that encourages visitors to take a specific action.

### Configuration

```typescript
cta: {
  enabled: true,
  title: "Ready to Get Started?",
  subtitle: "Join thousands of satisfied customers and transform your business today",
  buttonText: "Get Started Now",
  buttonLink: "#contact", // Can be URL, anchor link, or relative path
  backgroundType: "gradient", // or "image"
  backgroundImage: "https://example.com/bg.jpg" // Optional, used when backgroundType is "image"
}
```

### Features
- Gradient or image background options
- Animated floating particles effect
- Pulsing icon animation
- Animated CTA button with arrow
- Trust badge at bottom
- Wave decoration at bottom
- Dark overlay for image backgrounds (better text contrast)
- Analytics tracking for CTA clicks

### Background Types
- `gradient` - Animated gradient background (purple to orange)
- `image` - Custom image with dark overlay

### Button Link Options
- External URL: `https://example.com`
- Anchor link: `#contact` (smooth scroll to section)
- Relative path: `/pricing`

## 4. Trust Indicators Section

### Purpose
Display certifications, awards, and partner logos to build credibility and trust.

### Configuration

```typescript
trustIndicators: {
  enabled: true,
  certifications: [
    {
      id: "1",
      name: "ISO 9001 Certified",
      logo: "https://example.com/iso-logo.png", // Optional
      description: "Quality Management System" // Optional
    },
    {
      id: "2",
      name: "Best Service Award 2024",
      logo: "https://example.com/award.png"
    }
  ],
  partners: [
    {
      id: "1",
      name: "Google Partner",
      logo: "https://example.com/google-logo.png"
    },
    {
      id: "2",
      name: "Microsoft Partner",
      logo: "https://example.com/microsoft-logo.png"
    }
  ]
}
```

### Features
- Separate sections for certifications and partners
- Badge/seal design for certifications with verified checkmark
- Grayscale partner logos that become colored on hover
- Responsive grid layouts
- Automatic fallback icons if no logo provided
- Trust statement at bottom

### Best Practices
- Use high-quality, transparent PNG logos
- Keep certification descriptions brief
- Aim for 4-8 certifications and 5-10 partners
- Use recognizable industry certifications and partners

## Section Order in Microsite

The new sections are strategically placed in the microsite flow:

1. Profile Section
2. Hero Section
3. About Section
4. Services Section
5. **Impact/Metrics Section** ← NEW
6. **Testimonials Section** ← NEW
7. Gallery Section
8. **Trust Indicators Section** ← NEW
9. Videos Section
10. **CTA Section** ← NEW
11. Contact Section
12. Payment Section
13. Feedback Section

## Complete Example Configuration

```typescript
const micrositeConfig = {
  templateId: "premium",
  sections: {
    // ... existing sections ...

    impact: {
      enabled: true,
      metrics: [
        { value: "1000+", label: "Happy Clients", icon: "users" },
        { value: "20", label: "Years Experience", icon: "award" },
        { value: "99%", label: "Satisfaction Rate", icon: "star" },
        { value: "100+", label: "Locations", icon: "location" }
      ]
    },

    testimonials: {
      enabled: true,
      items: [
        {
          id: "1",
          name: "John Smith",
          role: "CEO, Tech Corp",
          photo: "https://example.com/john.jpg",
          content: "Outstanding service and professionalism!",
          rating: 5
        },
        {
          id: "2",
          name: "Sarah Johnson",
          role: "Marketing Director",
          content: "Exceeded all our expectations. Highly recommend!",
          rating: 5
        }
      ]
    },

    trustIndicators: {
      enabled: true,
      certifications: [
        {
          id: "1",
          name: "ISO 9001 Certified",
          description: "Quality Management"
        },
        {
          id: "2",
          name: "Best Service Award 2024"
        }
      ],
      partners: [
        {
          id: "1",
          name: "Google Partner",
          logo: "https://example.com/google.png"
        }
      ]
    },

    cta: {
      enabled: true,
      title: "Ready to Transform Your Business?",
      subtitle: "Join thousands of satisfied customers today",
      buttonText: "Get Started Now",
      buttonLink: "#contact",
      backgroundType: "gradient"
    }
  },
  seoSettings: {
    // ... SEO settings ...
  }
};
```

## Styling and Customization

All sections use:
- Design tokens from `@/config/design-tokens`
- Framer Motion for animations
- Responsive design (mobile-first)
- Brand color theming
- Consistent spacing and typography
- Accessibility features (ARIA labels, keyboard navigation)

## Animation Features

- Scroll-triggered animations (fade-up, scale)
- Staggered animations for multiple items
- Hover effects (scale, shadow, glow)
- Animated counters for metrics
- Carousel transitions for testimonials
- Floating particles in CTA section

## Accessibility

All sections include:
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure
- Alt text for images
- Color contrast compliance (WCAG AA)

## Performance

- Lazy loading for images
- Optimized animations (GPU-accelerated)
- Reduced motion support
- Code splitting ready
- Minimal bundle impact

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
