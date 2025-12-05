// @ts-nocheck
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { hoverAnimations, prefersReducedMotion } from '@/config/animations';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  glassmorphism?: boolean;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Disable hover animations
   */
  disableAnimations?: boolean;
}

/**
 * Card Component
 *
 * A flexible card component with elevation system, hover effects, and glassmorphism variant.
 * Implements consistent shadow and border radius from design tokens with micro-interactions.
 *
 * @example
 * ```tsx
 * <Card elevation="md" hover>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 *
 * <Card glassmorphism elevation="lg">
 *   <p>Glassmorphism card</p>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = 'md',
      hover = false,
      glassmorphism = false,
      children,
      className = '',
      padding = 'md',
      rounded = 'xl',
      disableAnimations = false,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'transition-all duration-300';

    // Background styles
    const backgroundStyles = glassmorphism
      ? 'bg-white/70 dark:bg-neutral-900/70 backdrop-blur-lg border border-white/20'
      : 'bg-white dark:bg-neutral-900';

    // Elevation (shadow) styles
    const elevationStyles = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Border radius styles
    const roundedStyles = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    };

    const shouldAnimate = hover && !disableAnimations && !prefersReducedMotion();

    const hoverAnimation = {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.3, ease: 'easeOut' },
    };

    const baseClassName = `
      ${baseStyles}
      ${backgroundStyles}
      ${elevationStyles[elevation]}
      ${paddingStyles[padding]}
      ${roundedStyles[rounded]}
      ${hover ? 'cursor-pointer' : ''}
      ${className}
    `;

    // If animations are disabled, render regular div
    if (!shouldAnimate) {
      return (
        <div
          ref={ref}
          className={baseClassName}
          {...props}
        >
          {children}
        </div>
      );
    }

    // Render animated card
    return (
      <motion.div
        ref={ref}
        className={baseClassName}
        whileHover={hoverAnimation}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 *
 * A header section for cards with consistent spacing.
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle Component
 *
 * A title component for card headers.
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={`text-h3 font-bold text-neutral-900 dark:text-neutral-50 ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * CardContent Component
 *
 * A content section for cards with consistent spacing.
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-neutral-700 dark:text-neutral-300 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter Component
 *
 * A footer section for cards with consistent spacing.
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
