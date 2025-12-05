'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  blurDataURL?: string;
  onLoad?: () => void;
}

/**
 * OptimizedImage Component
 *
 * Wrapper around Next.js Image component with:
 * - Automatic lazy loading
 * - Blur placeholder support
 * - Responsive sizes
 * - Loading state handling
 * - Error fallback
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  className = '',
  objectFit = 'cover',
  sizes,
  blurDataURL,
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default responsive sizes if not provided
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad != null) {
      onLoad();
    }
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Error fallback
  if (hasError != null) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
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
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`,
    ...(fill
      ? { fill: true, style: { objectFit } }
      : { width, height, style: { objectFit } }),
    ...(blurDataURL && { placeholder: 'blur' as const, blurDataURL }),
    sizes: defaultSizes,
  };

  return (
    <>
      {isLoading && !priority && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      <Image {...imageProps} />
    </>
  );
}
