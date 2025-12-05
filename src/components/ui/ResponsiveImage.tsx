'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface ResponsiveImageProps {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Image width (for static images)
   */
  width?: number;
  /**
   * Image height (for static images)
   */
  height?: number;
  /**
   * Fill container (for responsive images)
   */
  fill?: boolean;
  /**
   * Object fit style
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * Object position
   */
  objectPosition?: string;
  /**
   * Priority loading (for above-the-fold images)
   */
  priority?: boolean;
  /**
   * Sizes attribute for responsive images
   */
  sizes?: string;
  /**
   * Quality (1-100)
   */
  quality?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;
  /**
   * Blur placeholder data URL
   */
  blurDataURL?: string;
  /**
   * Enable blur placeholder
   */
  placeholder?: 'blur' | 'empty';
  /**
   * Aspect ratio (e.g., '16/9', '4/3', '1/1')
   */
  aspectRatio?: string;
  /**
   * Callback when image loads
   */
  onLoad?: () => void;
  /**
   * Callback when image errors
   */
  onError?: () => void;
}

/**
 * ResponsiveImage Component
 *
 * A responsive image component that:
 * - Uses Next.js Image component for optimization
 * - Implements srcset for different screen sizes
 * - Adds blur placeholders for better UX
 * - Handles loading and error states
 * - Supports various aspect ratios
 *
 * Requirements: 10.5
 *
 * @example
 * ```tsx
 * <ResponsiveImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   fill
 *   sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
 *   priority
 * />
 * ```
 */
export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  priority = false,
  sizes,
  quality = 85,
  className = '',
  showSkeleton = true,
  blurDataURL,
  placeholder = 'blur',
  aspectRatio,
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default sizes if not provided
  const defaultSizes = fill
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined;

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=';

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Error fallback
  if (hasError != null) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={aspectRatio && !fill ? { aspectRatio } : undefined}
    >
      {/* Loading skeleton */}
      {showSkeleton && isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={aspectRatio ? { aspectRatio } : undefined}
        />
      )}

      {/* Next.js Image */}
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes || defaultSizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={placeholder === 'blur' ? (blurDataURL || defaultBlurDataURL) : undefined}
        className={`${fill ? 'object-${objectFit}' : ''} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={
          fill
            ? {
                objectFit,
                objectPosition,
              }
            : undefined
        }
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

/**
 * Responsive image sizes presets for common use cases
 */
export const IMAGE_SIZES = {
  // Full width on mobile, half on tablet, third on desktop
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  // Full width on mobile, 50% on desktop
  hero: '(max-width: 768px) 100vw, 50vw',
  // Full width always
  full: '100vw',
  // Gallery thumbnails
  thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  // Profile/avatar images
  avatar: '(max-width: 640px) 96px, 128px',
  // Logo images
  logo: '(max-width: 640px) 120px, 200px',
} as const;

/**
 * Common aspect ratios
 */
export const ASPECT_RATIOS = {
  square: '1/1',
  landscape: '16/9',
  portrait: '9/16',
  wide: '21/9',
  photo: '4/3',
  golden: '1.618/1',
} as const;
