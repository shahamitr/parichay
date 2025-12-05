// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { prefersReducedMotion } from '@/config/animations';

export interface AnimatedIconProps {
  children: ReactNode;
  className?: string;
  /**
   * Type of hover animation
   */
  hoverEffect?: 'scale' | 'rotate' | 'bounce' | 'pulse' | 'spin';
  /**
   * Disable animations
   */
  disableAnimations?: boolean;
}

/**
 * AnimatedIcon Component
 *
 * Wrapper for icons that adds hover micro-interactions.
 *
 * @example
 * ```tsx
 * <AnimatedIcon hoverEffect="rotate">
 *   <IconComponent />
 * </AnimatedIcon>
 * ```
 */
export function AnimatedIcon({
  children,
  className = '',
  hoverEffect = 'scale',
  disableAnimations = false,
}: AnimatedIconProps) {
  const shouldAnimate = !disableAnimations && !prefersReducedMotion();

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>;
  }

  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'scale':
        return {
          scale: 1.15,
          transition: { duration: 0.2 },
        };
      case 'rotate':
        return {
          rotate: 15,
          transition: { duration: 0.2 },
        };
      case 'bounce':
        return {
          y: -4,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
          },
        };
      case 'pulse':
        return {
          scale: [1, 1.1, 1],
          transition: {
            duration: 0.4,
            repeat: Infinity,
            repeatType: 'loop' as const,
          },
        };
      case 'spin':
        return {
          rotate: 360,
          transition: { duration: 0.6 },
        };
      default:
        return { scale: 1.15 };
    }
  };

  return (
    <motion.span
      className={`inline-flex items-center justify-center ${className}`}
      whileHover={hoverEffect !== 'pulse' ? getHoverAnimation() : undefined}
      animate={hoverEffect === 'pulse' ? getHoverAnimation() : undefined}
    >
      {children}
    </motion.span>
  );
}

/**
 * AnimatedSocialIcon Component
 *
 * Specialized component for social media icons with glow effect on hover.
 *
 * @example
 * ```tsx
 * <AnimatedSocialIcon color="blue">
 *   <FacebookIcon />
 * </AnimatedSocialIcon>
 * ```
 */
export interface AnimatedSocialIconProps {
  children: ReactNode;
  className?: string;
  /**
   * Color for the glow effect
   */
  glowColor?: string;
  /**
   * Disable animations
   */
  disableAnimations?: boolean;
}

export function AnimatedSocialIcon({
  children,
  className = '',
  glowColor = 'rgba(123, 97, 255, 0.4)',
  disableAnimations = false,
}: AnimatedSocialIconProps) {
  const shouldAnimate = !disableAnimations && !prefersReducedMotion();

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={`inline-flex items-center justify-center ${className}`}
      whileHover={{
        scale: 1.1,
        filter: `drop-shadow(0 0 8px ${glowColor})`,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * AnimatedBadge Component
 *
 * Badge component with entrance animation and hover effect.
 *
 * @example
 * ```tsx
 * <AnimatedBadge delay={0.2}>
 *   New
 * </AnimatedBadge>
 * ```
 */
export interface AnimatedBadgeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  disableAnimations?: boolean;
}

export function AnimatedBadge({
  children,
  className = '',
  delay = 0,
  disableAnimations = false,
}: AnimatedBadgeProps) {
  const shouldAnimate = !disableAnimations && !prefersReducedMotion();

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.span>
  );
}
