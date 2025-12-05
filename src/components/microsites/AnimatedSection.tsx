'use client';

import { ReactNode } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import { prefersReducedMotion } from '@/config/animations';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedSection Component (Legacy API with Framer Motion)
 *
 * Maintains backward compatibility with existing animation prop names
 * while using Framer Motion under the hood for better performance.
 */
export default function AnimatedSection({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 800,
  className = '',
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: '-50px 0px',
  });

  // If no animation or reduced motion preferred, render without animation
  if (animation === 'none' || prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  // Map legacy animation names to Framer Motion variants
  const getVariants = (): Variants => {
    const durationInSeconds = duration / 1000;

    switch (animation) {
      case 'fade-in':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: durationInSeconds, delay: delay / 1000 },
          },
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: durationInSeconds, delay: delay / 1000, ease: 'easeOut' },
          },
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: durationInSeconds, delay: delay / 1000, ease: 'easeOut' },
          },
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: durationInSeconds, delay: delay / 1000, ease: 'easeOut' },
          },
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: durationInSeconds, delay: delay / 1000, ease: 'easeOut' },
          },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
