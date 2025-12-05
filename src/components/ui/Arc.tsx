'use client';

import React from 'react';

export interface ArcProps {
  /**
   * Position of the arc relative to the section
   */
  position: 'top' | 'bottom';

  /**
   * Color of the arc (hex, rgb, or CSS color name)
   * Defaults to brand primary color if not specified
   */
  color?: string;

  /**
   * Size of the arc (optimized for mobile-first design)
   * - 'small': 30px on mobile, 60px on tablet, 80px on desktop
   * - 'medium': 35px on mobile, 70px on tablet, 90px on desktop
   * - 'large': 40px on mobile, 80px on tablet, 100px on desktop
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Curve intensity (0-100)
   * Higher values create more pronounced curves
   * Default: 50
   */
  curveIntensity?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to flip the arc horizontally
   * Useful for creating varied visual patterns
   */
  flip?: boolean;
}

/**
 * Arc Component
 *
 * A decorative SVG arc element that can be placed at the top or bottom of sections
 * to create visual separation and enhance the microsite design.
 *
 * Features:
 * - Responsive sizing (adapts to mobile, tablet, and desktop)
 * - Customizable color (supports brand theming)
 * - Adjustable curve intensity
 * - Top and bottom positioning
 * - Smooth, scalable SVG rendering
 *
 * @example
 * ```tsx
 * // Top arc with brand primary color
 * <Arc position="top" color="#FF6B35" size="medium" />
 *
 * // Bottom arc with custom color and high curve
 * <Arc position="bottom" color="#4A90E2" size="large" curveIntensity={70} />
 * ```
 */
export default function Arc({
  position,
  color = '#FF6B35',
  size = 'medium',
  curveIntensity = 50,
  className = '',
  flip = false,
}: ArcProps) {
  // Calculate responsive heights based on size
  // Optimized for mobile-first design with proper spacing
  const sizeMap = {
    small: {
      mobile: 30,    // 30-40px range for mobile
      tablet: 60,    // 60-80px range for tablet
      desktop: 80,   // 80-100px range for desktop
    },
    medium: {
      mobile: 35,    // 30-40px range for mobile
      tablet: 70,    // 60-80px range for tablet
      desktop: 90,   // 80-100px range for desktop
    },
    large: {
      mobile: 40,    // 30-40px range for mobile
      tablet: 80,    // 60-80px range for tablet
      desktop: 100,  // 80-100px range for desktop
    },
  };

  const heights = sizeMap[size];

  // Normalize curve intensity to a reasonable range (0-100 -> 0-1)
  const normalizedCurve = Math.max(0, Math.min(100, curveIntensity)) / 100;

  // Generate SVG path for the arc
  // The path creates a smooth curve using quadratic bezier curves
  const generatePath = (width: number, height: number) => {
    // Control point for the curve (affects the curve intensity)
    const controlPointY = height * normalizedCurve;

    if (position === 'top') {
      // Arc curves downward from top
      return `M 0,0 Q ${width / 2},${controlPointY} ${width},0 L ${width},${height} L 0,${height} Z`;
    } else {
      // Arc curves upward from bottom
      return `M 0,${height} Q ${width / 2},${height - controlPointY} ${width},${height} L ${width},0 L 0,0 Z`;
    }
  };

  // Positioning classes with proper z-index for layering
  // z-0 ensures arcs stay behind content but above background
  const positionClasses = position === 'top'
    ? 'top-0 left-0 z-0'
    : 'bottom-0 left-0 z-0';

  // Transform for flipping
  const transform = flip ? 'scaleX(-1)' : 'none';

  return (
    <>
      {/* Mobile (< 640px) - 30-40px height range */}
      <div
        className={`absolute ${positionClasses} w-full overflow-hidden pointer-events-none sm:hidden ${className}`}
        style={{ height: `${heights.mobile}px` }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 1000 ${heights.mobile}`}
          preserveAspectRatio="none"
          style={{ transform }}
        >
          <path
            d={generatePath(1000, heights.mobile)}
            fill={color}
          />
        </svg>
      </div>

      {/* Tablet (640px - 1024px) - 60-80px height range */}
      <div
        className={`absolute ${positionClasses} w-full overflow-hidden pointer-events-none hidden sm:block lg:hidden ${className}`}
        style={{ height: `${heights.tablet}px` }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 1000 ${heights.tablet}`}
          preserveAspectRatio="none"
          style={{ transform }}
        >
          <path
            d={generatePath(1000, heights.tablet)}
            fill={color}
          />
        </svg>
      </div>

      {/* Desktop (>= 1024px) - 80-100px height range */}
      <div
        className={`absolute ${positionClasses} w-full overflow-hidden pointer-events-none hidden lg:block ${className}`}
        style={{ height: `${heights.desktop}px` }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 1000 ${heights.desktop}`}
          preserveAspectRatio="none"
          style={{ transform }}
        >
          <path
            d={generatePath(1000, heights.desktop)}
            fill={color}
          />
        </svg>
      </div>
    </>
  );
}
