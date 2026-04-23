// @ts-nocheck
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { hoverAnimations, tapAnimations, prefersReducedMotion } from '@/config/animations';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** @deprecated Use leftIcon instead */
  icon?: React.ReactNode;
  /** @deprecated Use leftIcon/rightIcon instead */
  iconPosition?: 'left' | 'right';
  rounded?: 'default' | 'full';
  /**
   * Disable hover animations (useful for reduced motion)
   */
  disableAnimations?: boolean;
}

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Implements the design system tokens for consistent styling with micro-interactions.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" size="lg" leftIcon={<Icon />}>With Icon</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      className = '',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      icon,
      iconPosition = 'left',
      rounded = 'default',
      disableAnimations = false,
      ...props
    },
    ref
  ) => {
    // Handle deprecated icon prop
    const effectiveLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : undefined);
    const effectiveRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : undefined);

    // Base styles with touch-manipulation for better mobile performance
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';

    // Variant styles with gradient backgrounds and hover effects (using design tokens)
    const variantStyles = {
      primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 active:from-primary-700 active:to-accent-700 focus:ring-primary-500 shadow-md',
      secondary: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 focus:ring-neutral-500 shadow-sm',
      outline: 'border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/40 focus:ring-primary-500',
      ghost: 'text-primary-500 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/40 focus:ring-primary-500',
      danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 active:from-error-700 active:to-error-800 focus:ring-error-500 shadow-md',
      success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 active:from-success-700 active:to-success-800 focus:ring-success-500 shadow-md',
    };

    // Size styles with optimized touch targets (min 44x44px for mobile)
    const sizeStyles = {
      sm: 'px-3 py-2 min-h-[44px] text-sm gap-1.5',
      md: 'px-6 py-3 min-h-[44px] text-base gap-2',
      lg: 'px-8 py-4 min-h-[48px] text-lg gap-2.5',
      xl: 'px-10 py-5 min-h-[52px] text-xl gap-3',
    };

    // Rounded styles
    const roundedStyles = {
      default: size === 'sm' ? 'rounded-lg' : 'rounded-xl',
      full: 'rounded-full',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Loading spinner with animation
    const LoadingSpinner = () => (
      <motion.svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
    );

    // Determine if animations should be disabled
    const shouldAnimate = !disableAnimations && !disabled && !loading && !prefersReducedMotion();

    // Animation variants based on button variant
    const getHoverAnimation = () => {
      if (variant === 'primary') {
        return {
          scale: 1.02,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          y: -2,
        };
      }
      return hoverAnimations.scale;
    };

    const buttonContent = (
      <>
        {loading && <LoadingSpinner />}
        {!loading && effectiveLeftIcon && (
          <motion.span
            className="flex-shrink-0"
            whileHover={shouldAnimate ? { scale: 1.1 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {effectiveLeftIcon}
          </motion.span>
        )}
        <span>{children}</span>
        {!loading && effectiveRightIcon && (
          <motion.span
            className="flex-shrink-0"
            whileHover={shouldAnimate ? { scale: 1.1 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {effectiveRightIcon}
          </motion.span>
        )}
      </>
    );

    // If animations are disabled, render regular button
    if (!shouldAnimate) {
      return (
        <button
          ref={ref}
          className={`
            ${baseStyles}
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${roundedStyles[rounded]}
            ${widthStyles}
            ${className}
          `}
          disabled={disabled || loading}
          {...props}
        >
          {buttonContent}
        </button>
      );
    }

    // Render animated button
    return (
      <motion.button
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${roundedStyles[rounded]}
          ${widthStyles}
          ${className}
        `}
        disabled={disabled || loading}
        whileHover={getHoverAnimation()}
        whileTap={tapAnimations.scale}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// =============================================================================
// ICON BUTTON
// =============================================================================
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'ghost', size = 'md', label, className = '', ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700',
      secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
      outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800',
      ghost: 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800',
    };

    const sizeStyles = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    return (
      <button
        ref={ref}
        className={`rounded-lg transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        title={label}
        aria-label={label}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
