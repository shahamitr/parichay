// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { prefersReducedMotion } from '@/config/animations';

export interface AnimatedHeroProps {
  children: ReactNode;
  className?: string;
}

/**
 * AnimatedHero Component
 *
 * Specialized component for hero section animations with staggered entrance.
 * Animates children in sequence for a polished introduction.
 *
 * @example
 * ```tsx
 * <AnimatedHero>
 *   <h1>Welcome</h1>
 *   <p>Subtitle text</p>
 *   <Button>Call to Action</Button>
 * </AnimatedHero>
 * ```
 */
export function AnimatedHero({ children, className = '' }: AnimatedHeroProps) {
  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

/**
 * AnimatedHeroTitle Component
 *
 * Specialized animation for hero titles with character-by-character reveal.
 *
 * @example
 * ```tsx
 * <AnimatedHeroTitle>Welcome to Our Site</AnimatedHeroTitle>
 * ```
 */
export interface AnimatedHeroTitleProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function AnimatedHeroTitle({
  children,
  className = '',
  as: Component = 'h1',
}: AnimatedHeroTitleProps) {
  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion()) {
    return <Component className={className}>{children}</Component>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        shildren: 0.03,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const words = children.split(' ');

  return (
    <Component className={className}>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ display: 'inline-block' }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: 'inline-block', marginRight: '0.25em' }}>
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                variants={letterVariants}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * AnimatedHeroContent Component
 *
 * Wrapper for hero content with fade-up animation.
 * Simpler than AnimatedHero for single-element content.
 *
 * @example
 * ```tsx
 * <AnimatedHeroContent delay={0.3}>
 *   <p>Hero description text</p>
 * </AnimatedHeroContent>
 * ```
 */
export interface AnimatedHeroContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedHeroContent({
  children,
  className = '',
  delay = 0,
}: AnimatedHeroContentProps) {
  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
