// @ts-nocheck
'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import {
  animationVariants,
  scrollAnimationConfig,
  getAnimationVariant,
  prefersReducedMotion
} from '@/config/animations';

export interface AnimatedElementProps {
  children: ReactNode;
  variant?: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  className?: string;
  /**
   * Whether to animate only once or every time element enters viewport
   */
  once?: boolean;
  /**
   * Custom animation variants (overrides preset variants)
   */
  customVariants?: Variants;
  /**
   * Amount of element that must be visible to trigger (0-1)
   */
  threshold?: number;
}

/**
 * AnimatedElement Component
 *
 * A wrapper component that adds scroll-triggered animations using Framer Motion.
 * Automatically respects user's reduced motion preferences.
 *
 * @example
 * ```tsx
 * <AnimatedElement variant="fadeUp" delay={0.2}>
 *   <div>Content to animate</div>
 * </AnimatedElement>
 * ```
 */
export function AnimatedElement({
  children,
  variant = 'fadeUp',
  delay = 0,
  className = '',
  once = true,
  customVariants,
  threshold = 0.1,
}: AnimatedElementProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: scrollAnimationConfig.rootMargin,
  });

  // Get the animation variant with reduced motion support
  const variants = customVariants || getAnimationVariant(animationVariants[variant]);

  // If reduced motion is preferred, render without animation wrapper
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedList Component
 *
 * A wrapper for lists that adds staggered animations to children.
 *
 * @examp
 * ```tsx
 * <AnimatedList>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </AnimatedList>
 * ```
 */
export interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  childVariant?: 'fadeUp' | 'fadeIn' | 'scaleIn';
  once?: boolean;
}

export function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.1,
  childVariant = 'fadeUp',
  once = true,
}: AnimatedListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: 0.1,
    margin: scrollAnimationConfig.rootMargin,
  });

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = getAnimationVariant(animationVariants[childVariant]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * AnimatedSection Component
 *
 * A section-level wrapper that animates content on scroll.
 * Useful for full-width sections with multiple elements.
 *
 * @example
 * ```tsx
 * <AnimatedSection>
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </AnimatedSection>
 * ```
 */
export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'fadeUp' | 'fadeIn' | 'scaleIn';
  staggerChildren?: boolean;
  once?: boolean;
}

export function AnimatedSection({
  children,
  className = '',
  variant = 'fadeUp',
  staggerChildren = false,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: 0.1,
    margin: scrollAnimationConfig.rootMargin,
  });

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion()) {
    return <section className={className}>{children}</section>;
  }

  const variants = staggerChildren
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }
    : getAnimationVariant(animationVariants[variant]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.section>
  );
}
