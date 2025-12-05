// @ts-nocheck
'use client';

/**
 * Animation System Examples
 *
 * This file demonstrates how to use the animation system components.
 * Use these examples as a reference for implementing animations in your app.
 */

import {
  AnimatedElement,
  AnimatedList,
  AnimatedSection
} from './AnimatedElement';
import {
  AnimatedHero,
  AnimatedHeroTitle,
  AnimatedHeroContent
} from './AnimatedHero';
import {
  AnimatedIcon,
  AnimatedlIcon,
  AnimatedBadge
} from './AnimatedIcon';
import { Button } from './Button';
import { Card } from './Card';

/**
 * Example 1: Basic Scroll Animation
 */
export function BasicScrollAnimationExample() {
  return (
    <div className="space-y-8 p-8">
      <AnimatedElement variant="fadeUp">
        <h2 className="text-3xl font-bold">Fade Up Animation</h2>
        <p>This content fades in while moving up as you scroll.</p>
      </AnimatedElement>

      <AnimatedElement variant="fadeIn" delay={0.2}>
        <h2 className="text-3xl font-bold">Fade In Animation</h2>
        <p>This content simply fades in with a delay.</p>
      </AnimatedElement>

      <AnimatedElement variant="scaleIn" delay={0.4}>
        <h2 className="text-3xl font-bold">Scale In Animation</h2>
        <p>This content scales up while fading in.</p>
      </AnimatedElement>
    </div>
  );
}

/**
 * Example 2: Animated List
 */
export function AnimatedListExample() {
  const items = [
    { id: 1, title: 'First Item', description: 'This is the first item' },
    { id: 2, title: 'Second Item', description: 'This is the second item' },
    { id: 3, title: 'Third Item', description: 'This is the third item' },
    { id: 4, title: 'Fourth Item', description: 'This is the fourth item' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Staggered List Animation</h2>
      <AnimatedList staggerDelay={0.1} childVariant="fadeUp">
        {items.map((item) => (
          <Card key={item.id} elevation="md" hover className="mb-4">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </Card>
        ))}
      </AnimatedList>
    </div>
  );
}

/**
 * Example 3: Hero Section with Animations
 */
export function AnimatedHeroExample() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-orange-500 p-8">
      <AnimatedHero className="text-center text-white">
        <AnimatedHeroTitle as="h1" className="text-6xl font-bold mb-4">
          Welcome to Our Platform
        </AnimatedHeroTitle>
        <AnimatedHeroContent delay={0.3}>
          <p className="text-xl mb-8">
            Experience the future of digital business cards
          </p>
        </AnimatedHeroContent>
        <AnimatedHeroContent delay={0.5}>
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </AnimatedHeroContent>
      </AnimatedHero>
    </div>
  );
}

/**
 * Example 4: Animated Icons
 */
export function AnimatedIconExample() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Icon Hover Effects</h2>
        <div className="flex gap-6">
          <AnimatedIcon hoverEffect="scale">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              S
            </div>
          </AnimatedIcon>

          <AnimatedIcon hoverEffect="rotate">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              R
            </div>
          </AnimatedIcon>

          <AnimatedIcon hoverEffect="bounce">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              B
            </div>
          </AnimatedIcon>

          <AnimatedIcon hoverEffect="spin">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
              ↻
            </div>
          </AnimatedIcon>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Social Media Icons with Glow</h2>
        <div className="flex gap-6">
          <AnimatedSocialIcon glowColor="rgba(59, 89, 152, 0.6)">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
              f
            </div>
          </AnimatedSocialIcon>

          <AnimatedSocialIcon glowColor="rgba(29, 161, 242, 0.6)">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white">
              𝕏
            </div>
          </AnimatedSocialIcon>

          <AnimatedSocialIcon glowColor="rgba(0, 119, 181, 0.6)">
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white">
              in
            </div>
          </AnimatedSocialIcon>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Animated Badges</h2>
        <div className="flex gap-4">
          <AnimatedBadge
            delay={0}
            className="px-3 py-1 bg-green-500 text-white rounded-full text-sm"
          >
            New
          </AnimatedBadge>

          <AnimatedBadge
            delay={0.1}
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
          >
            Featured
          </AnimatedBadge>

          <AnimatedBadge
            delay={0.2}
            className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm"
          >
            Popular
          </AnimatedBadge>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Button Micro-Interactions
 */
export function ButtonMicroInteractionsExample() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold mb-4">Button Animations</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Primary button with hover and tap effects:</p>
          <Button variant="primary" size="md">
            Hover and Click Me
          </Button>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Button with icons (icons scale on hover):</p>
          <Button
            variant="primary"
            size="md"
            leftIcon={<span>→</span>}
            rightIcon={<span>←</span>}
          >
            With Icons
          </Button>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Loading state with animated spinner:</p>
          <Button variant="primary" size="md" loading>
            Loading...
          </Button>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Button without animations:</p>
          <Button variant="primary" size="md" disableAnimations>
            No Animation
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 6: Card Hover Effects
 */
export function CardHoverEffectsExample() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Card Hover Effects</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card elevation="md" hover>
          <h3 className="text-xl font-semibold mb-2">Hover Me</h3>
          <p className="text-gray-600">
            This card lifts up and scales slightly on hover.
          </p>
        </Card>

        <Card elevation="lg" hover glassmorphism>
          <h3 className="text-xl font-semibold mb-2">Glassmorphism</h3>
          <p className="text-gray-600">
            This card has a glass effect with hover animation.
          </p>
        </Card>

        <Card elevation="md" hover={false}>
          <h3 className="text-xl font-semibold mb-2">No Hover</h3>
          <p className="text-gray-600">
            This card doesn't have hover effects.
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * Example 7: Complete Section with Multiple Animations
 */
export function CompleteSectionExample() {
  const features = [
    { title: 'Fast', description: 'Lightning-fast performance' },
    { title: 'Secure', description: 'Bank-level security' },
    { title: 'Scalable', description: 'Grows with your business' },
  ];

  return (
    <AnimatedSection className="p-8 bg-gray-50">
      <AnimatedElement variant="fadeUp">
        <h2 className="text-4xl font-bold text-center mb-4">Our Features</h2>
        <p className="text-center text-gray-600 mb-12">
          Everything you need to succeed
        </p>
      </AnimatedElement>

      <AnimatedList staggerDelay={0.15} childVariant="fadeUp">
        {features.map((feature, index) => (
          <Card key={index} elevation="md" hover className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </AnimatedList>

      <AnimatedElement variant="fadeUp" delay={0.6}>
        <div className="text-center mt-8">
          <Button variant="primary" size="lg">
            Learn More
          </Button>
        </div>
      </AnimatedElement>
    </AnimatedSection>
  );
}
