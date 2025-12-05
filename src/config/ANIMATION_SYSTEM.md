# Animation System Documentation

## Overview

The animation system is built on Framer Motion and provides a comprehensive set of components, hooks, and utilities for creating smooth, accessible animations throughout the application. The system automatically respects user preferences for reduced motion.

## Key Features

- 🎨 **Predefined Animation Variants** - Ready-to-use animation patterns
- ♿ **Accessibility First** - Automatic reduced motion support
- 🎯 **Scroll-Triggered Animations** - Animate elements as they enter viewport
- ✨ **Micro-Interactions** - Hover and tap effects for interactive elements
- 🔧 **Flexible Configuration** - Easy to customize and extend

## Installation

Framer Motion is already installed as a dependency. Import components and utilities as needed:

```tsx
import { AnimatedElement, AnimatedList } from '@/components/ui/AnimatedElement';
import { AnimatedHero } from '@/components/ui/AnimatedHero';
import { animationVariants } from '@/config/animations';
```

## Core Components

### AnimatedElement

Wrapper component for scroll-triggered animations.

```tsx
<AnimatedElement variant="fadeUp" delay={0.2}>
  <div>Content to animate</div>
</AnimatedElement>
```

**Props:**
- `variant`: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideInLeft' | 'slideInRight'
- `delay`: number (seconds)
- `className`: string
- `once`: boolean (default: true)
- `customVariants`: Variants (override preset)
- `threshold`: number (0-1, visibility threshold)

### AnimatedList

Staggered animations for lists of items.

```tsx
<AnimatedList staggerDelay={0.1} childVariant="fadeUp">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AnimatedList>
```

**Props:**
- `staggerDelay`: number (delay between items)
- `childVariant`: 'fadeUp' | 'fadeIn' | 'scaleIn'
- `className`: string
- `once`: boolean

### AnimatedSection

Section-level wrapper for content animations.

```tsx
<AnimatedSection variant="fadeUp" staggerChildren>
  <h2>Section Title</h2>
  <p>Section content</p>
</AnimatedSection>
```

**Props:**
- `variant`: 'fadeUp' | 'fadeIn' | 'scaleIn'
- `staggerChildren`: boolean
- `className`: string
- `once`: boolean

### AnimatedHero

Specialized component for hero sections with staggered entrance.

```tsx
<AnimatedHero>
  <h1>Welcome</h1>
  <p>Subtitle</p>
  <Button>CTA</Button>
</AnimatedHero>
```

### AnimatedHeroTitle

Character-by-character reveal animation for titles.

```tsx
<AnimatedHeroTitle as="h1">
  Welcome to Our Site
</AnimatedHeroTitle>
```

### AnimatedIcon

Icon wrapper with hover effects.

```tsx
<AnimatedIcon hoverEffect="rotate">
  <IconComponent />
</AnimatedIcon>
```

**Hover Effects:**
- `scale` - Grows slightly
- `rotate` - Rotates 15 degrees
- `bounce` - Bounces up
- `pulse` - Continuous pulsing
- `spin` - Full 360° rotation

### AnimatedSocialIcon

Social media icons with glow effect.

```tsx
<AnimatedSocialIcon glowColor="rgba(123, 97, 255, 0.4)">
  <FacebookIcon />
</AnimatedSocialIcon>
```

## Enhanced UI Components

### Button

Buttons now include micro-interactions by default.

```tsx
<Button variant="primary" size="md">
  Click Me
</Button>
```

**Animations:**
- Hover: Scale up + shadow increase
- Tap: Scale down feedback
- Icons: Scale on hover

**Disable animations:**
```tsx
<Button disableAnimations>No Animation</Button>
```

### Card

Cards support hover animations.

```tsx
<Card elevation="md" hover>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

**Animations:**
- Hover: Lift up + shadow increase + scale
- Smooth transitions

## Hooks

### useReducedMotion

Detects user's reduced motion preference.

```tsx
function MyComponent() {
  const prefersReducedMotion = useReducedMotion();

  return prefersReducedMotion ? <StaticContent /> : <AnimatedContent />;
}
```

### useAnimationConfig

Returns animation configuration based on reduced motion.

```tsx
function MyComponent() {
  const { shouldAnimate, duration, transition } = useAnimationConfig();

  return (
    <motion.div
      animate={shouldAnimate ? { opacity: 1 } : undefined}
      transition={transition}
    >
      Content
    </motion.div>
  );
}
```

### useAnimation (Context)

Access global animation configuration.

```tsx
function MyComponent() {
  const { shouldAnimate, duration } = useAnimation();
  // Use animation config
}
```

## Animation Variants

Pre-configured animation patterns in `animations.ts`:

### Entrance Animations

```tsx
animationVariants.fadeUp      // Fade in while moving up
animationVariants.fadeIn       // Simple fade in
animationVariants.scaleIn      // Scale up while fading
animationVariants.slideInLeft  // Slide from left
animationVariants.slideInRight // Slide from right
```

### Stagger Animations

```tsx
animationVariants.staggerChildren     // Standard stagger
animationVariants.staggerChildrenFast // Quick stagger
```

### Hover Animations

```tsx
hoverAnimations.scale       // Scale up
hoverAnimations.scaleGlow   // Scale + glow
hoverAnimations.lift        // Lift up
hoverAnimations.liftShadow  // Lift + shadow
hoverAnimations.rotate      // Rotate slightly
```

### Tap Animations

```tsx
tapAnimations.scale     // Scale down
tapAnimations.scaleDown // Scale down more
```

## Transition Presets

```tsx
transitionPresets.spring // Bouncy, natural
transitionPresets.smooth // Ease out
transitionPresets.fast   // Quick response
transitionPresets.slow   // Deliberate, elegant
```

## Reduced Motion Support

The system automatically respects the user's `prefers-reduced-motion` setting.

### Automatic Support

All animation components check for reduced motion and disable animations automatically:

```tsx
// This will automatically disable animations if user prefers reduced motion
<AnimatedElement variant="fadeUp">
  <Content />
</AnimatedElement>
```

### Manual Check

```tsx
import { prefersReducedMotion } from '@/config/animations';

if (prefersReducedMotion()) {
  // Render without animations
} else {
  // Render with animations
}
```

### Accessible Variants

Create variants that respect reduced motion:

```tsx
import { createAccessibleVariants } from '@/config/animations';

const myVariants = createAccessibleVariants({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
});
```

## Context Provider

Wrap your app with AnimationProvider for global animation configuration:

```tsx
// In your root layout
import { AnimationProvider } from '@/lib/animation-context';

export default function RootLayout({ children }) {
  return (
    <AnimationProvider>
      {children}
    </AnimationProvider>
  );
}
```

## Best Practices

### 1. Use Semantic Animation Variants

Choose variants that match the content's purpose:
- Hero sections: `AnimatedHero` or `fadeUp`
- Cards/Lists: `AnimatedList` with `fadeUp`
- Sections: `AnimatedSection` with `fadeUp`
- Icons: `AnimatedIcon` with appropriate hover effect

### 2. Stagger Delays

For multiple elements, use staggered animations:

```tsx
<AnimatedList staggerDelay={0.1}>
  {items.map(item => <Item key={item.id} {...item} />)}
</AnimatedList>
```

### 3. Respect Performance

- Use `once={true}` for animations that should only play once
- Avoid animating too many elements simultaneously
- Use `will-change` CSS property sparingly

### 4. Test Reduced Motion

Always test with reduced motion enabled:
- macOS: System Preferences → Accessibility → Display → Reduce motion
- Windows: Settings → Ease of Access → Display → Show animations
- Browser DevTools: Emulate CSS media feature `prefers-reduced-motion`

### 5. Consistent Timing

Use predefined transition presets for consistency:

```tsx
import { transitionPresets } from '@/config/animations';

<motion.div transition={transitionPresets.smooth}>
  Content
</motion.div>
```

## Examples

### Animated Card Grid

```tsx
<AnimatedList staggerDelay={0.1} childVariant="fadeUp">
  {cards.map(card => (
    <Card key={card.id} hover elevation="md">
      <h3>{card.title}</h3>
      <p>{card.description}</p>
    </Card>
  ))}
</AnimatedList>
```

### Hero Section

```tsx
<AnimatedHero>
  <AnimatedHeroTitle as="h1">
    Welcome to Our Platform
  </AnimatedHeroTitle>
  <AnimatedHeroContent delay={0.3}>
    <p>Your journey starts here</p>
  </AnimatedHeroContent>
  <AnimatedHeroContent delay={0.5}>
    <Button variant="primary">Get Started</Button>
  </AnimatedHeroContent>
</AnimatedHero>
```

### Social Media Icons

```tsx
<div className="flex gap-4">
  <AnimatedSocialIcon glowColor="rgba(59, 89, 152, 0.4)">
    <FacebookIcon />
  </AnimatedSocialIcon>
  <AnimatedSocialIcon glowColor="rgba(29, 161, 242, 0.4)">
    <TwitterIcon />
  </AnimatedSocialIcon>
  <AnimatedSocialIcon glowColor="rgba(0, 119, 181, 0.4)">
    <LinkedInIcon />
  </AnimatedSocialIcon>
</div>
```

### Custom Animation

```tsx
import { motion } from 'framer-motion';
import { useAnimation } from '@/lib/animation-context';

function CustomAnimatedComponent() {
  const { shouldAnimate, transition } = useAnimation();

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, x: -50 } : undefined}
      animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
      transition={transition}
    >
      Custom animated content
    </motion.div>
  );
}
```

## Troubleshooting

### Animations not working

1. Check if Framer Motion is installed: `npm list framer-motion`
2. Ensure component is client-side: Add `'use client'` directive
3. Verify reduced motion is not enabled in OS settings

### Performance issues

1. Reduce number of simultaneously animated elements
2. Use `once={true}` for scroll animations
3. Simplify animation variants
4. Check for layout thrashing (animating layout properties)

### Animations too fast/slow

Adjust duration in transition:

```tsx
<AnimatedElement
  customVariants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.0 } // Slower
    }
  }}
>
  Content
</AnimatedElement>
```

## Migration from Old System

The old CSS-based AnimatedSection has been updated to use Framer Motion while maintaining backward compatibility:

```tsx
// Old API still works
<AnimatedSection animation="slide-up" delay={200} duration={800}>
  Content
</AnimatedSection>

// New API recommended
<AnimatedElement variant="fadeUp" delay={0.2}>
  Content
</AnimatedElement>
```

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Reduced Motion Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
