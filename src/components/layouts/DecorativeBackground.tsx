'use client';

import React from 'react';

export interface BlobShapeProps {
  color?: string;
  opacity?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

/**
 * BlobShape Component
 *
 * Creates decorative SVG blob shapes for backgrounds.
 * Implements Requirement 1.3 for decorative background elements.
 *
 * @example
 * ```tsx
 * <BlobShape color="blue" position="top-right" size="lg" />
 * ```
 */
export const BlobShape: React.FC<BlobShapeProps> = ({
  color = 'blue',
  opacity = 0.2,
  size = 'md',
  position = 'top-right',
  blur = '3xl',
  className = '',
}) => {
  // Size mappings
  const sizeStyles = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  };

  // Position mappings
  const positionStyles = {
    'top-left': 'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
    'top-right': 'top-0 right-0 translate-x-1/4 -translate-y-1/4',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
    'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  // Blur mappings
  const blurStyles = {
    sm: 'blur-sm',
    md: 'blur-md',
    lg: 'blur-lg',
    xl: 'blur-xl',
    '2xl': 'blur-2xl',
    '3xl': 'blur-3xl',
  };

  // Color mappings
  const colorStyles = {
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    pink: 'bg-pink-400',
    orange: 'bg-orange-400',
    green: 'bg-green-400',
    teal: 'bg-teal-400',
    indigo: 'bg-indigo-400',
    primary: 'bg-primary-400',
    accent: 'bg-accent-400',
  };

  const colorClass = colorStyles[color as keyof typeof colorStyles] || `bg-${color}-400`;

  return (
    <div
      className={`
        absolute pointer-events-none
        ${sizeStyles[size]}
        ${positionStyles[position]}
        ${blurStyles[blur]}
        ${colorClass}
        rounded-full
        ${className}
      `}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

export interface GradientPatternProps {
  variant?: 'radial' | 'linear' | 'mesh';
  colors?: string[];
  opacity?: number;
  className?: string;
}

/**
 * GradientPattern Component
 *
 * Creates gradient pattern backgrounds.
 * Implements Requirement 1.3 for gradient patterns.
 *
 * @example
 * ```tsx
 * <GradientPattern variant="radial" colors={['purple', 'blue']} />
 * ```
 */
export const GradientPattern: React.FC<GradientPatternProps> = ({
  variant = 'radial',
  colors = ['purple', 'blue'],
  opacity = 0.1,
  className = '',
}) => {
  const gradientStyles = {
    radial: `radial-gradient(circle at top right, ${colors[0]} 0%, ${colors[1]} 50%, transparent 100%)`,
    linear: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
    mesh: `
      radial-gradient(at 0% 0%, ${colors[0]} 0px, transparent 50%),
      radial-gradient(at 100% 0%, ${colors[1]} 0px, transparent 50%),
      radial-gradient(at 100% 100%, ${colors[0]} 0px, transparent 50%),
      radial-gradient(at 0% 100%, ${colors[1]} 0px, transparent 50%)
    `,
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: gradientStyles[variant],
        opacity,
      }}
      aria-hidden="true"
    />
  );
};

export interface HeadingBackgroundProps {
  variant?: 'blob' | 'underline' | 'highlight' | 'gradient';
  color?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * HeadingBackground Component
 *
 * Adds soft background shapes behind headings.
 * Implements Requirement 1.3 for decorative elements behind headings.
 *
 * @example
 * ```tsx
 * <HeadingBackground variant="blob" color="purple">
 *   <h2>My Heading</h2>
 * </HeadingBackground>
 * ```
 */
export const HeadingBackground: React.FC<HeadingBackgroundProps> = ({
  variant = 'blob',
  color = 'primary',
  className = '',
  children,
}) => {
  const variantStyles = {
    blob: `
      relative inline-block
      before:content-['']
      before:absolute
      before:inset-0
      before:bg-${color}-100
      before:rounded-full
      before:blur-2xl
      before:opacity-30
      before:-z-10
      before:scale-150
    `,
    underline: `
      relative inline-block
      after:content-['']
      after:absolute
      after:bottom-0
      after:left-0
      after:right-0
      after:h-3
      after:bg-gradient-to-r
      after:from-${color}-400
      after:to-${color}-600
      after:opacity-30
      after:-z-10
      after:rounded-full
    `,
    highlight: `
      relative inline-block
      before:content-['']
      before:absolute
      before:inset-x-0
      before:bottom-2
      before:h-4
      before:bg-${color}-200
      before:opacity-40
      before:-z-10
      before:skew-y-1
    `,
    gradient: `
      relative inline-block
      before:content-['']
      before:absolute
      before:inset-0
      before:bg-gradient-to-r
      before:from-${color}-100
      before:via-${color}-50
      before:to-transparent
      before:opacity-50
      before:-z-10
      before:rounded-2xl
      before:blur-xl
      before:scale-110
    `,
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export interface DecorativeBackgroundProps {
  variant?: 'blobs' | 'gradient' | 'mesh' | 'minimal';
  intensity?: 'light' | 'medium' | 'strong';
  className?: string;
  children?: React.ReactNode;
}

/**
 * DecorativeBackground Component
 *
 * A comprehensive decorative background component that combines multiple elements.
 * Implements Requirement 1.3 for soft decorative shapes and gradient patterns.
 *
 * @example
 * ```tsx
 * <DecorativeBackground variant="blobs" intensity="medium">
 *   <YourContent />
 * </DecorativeBackground>
 * ```
 */
export const DecorativeBackground: React.FC<DecorativeBackgroundProps> = ({
  variant = 'blobs',
  intensity = 'medium',
  className = '',
  children,
}) => {
  const opacityMap = {
    light: 0.1,
    medium: 0.2,
    strong: 0.3,
  };

  const opacity = opacityMap[intensity];

  return (
    <div className={`relative ${className}`}>
      {/* Blob variant */}
      {variant === 'blobs' && (
        <>
          <BlobShape color="purple" position="top-left" size="lg" opacity={opacity} />
          <BlobShape color="blue" position="top-right" size="md" opacity={opacity} />
          <BlobShape color="orange" position="bottom-left" size="md" opacity={opacity} />
          <BlobShape color="pink" position="bottom-right" size="lg" opacity={opacity} />
        </>
      )}

      {/* Gradient variant */}
      {variant === 'gradient' && (
        <GradientPattern
          variant="radial"
          colors={['rgba(123, 97, 255, 0.3)', 'rgba(255, 123, 0, 0.3)']}
          opacity={opacity}
        />
      )}

      {/* Mesh variant */}
      {variant === 'mesh' && (
        <GradientPattern
          variant="mesh"
          colors={['rgba(123, 97, 255, 0.2)', 'rgba(255, 123, 0, 0.2)']}
          opacity={opacity}
        />
      )}

      {/* Minimal variant */}
      {variant === 'minimal' && (
        <>
          <BlobShape color="primary" position="top-right" size="xl" opacity={opacity * 0.5} />
          <BlobShape color="accent" position="bottom-left" size="xl" opacity={opacity * 0.5} />
        </>
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};
