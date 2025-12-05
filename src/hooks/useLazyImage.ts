/**
 * useLazyImage Hook
 *
 * Implements lazy loading for images using IntersectionObserver.
 * Only loads images when they're about to enter the viewport.
 */

import { useEffect, useRef, useState } from 'react';

interface UseLazyImageOptions {
  /**
   * Root margin for IntersectionObserver
   * Positive values load images before they enter viewport
   */
  rootMargin?: string;

  /**
   * Threshold for triggering load (0-1)
   */
  threshold?: number;

  /**
   * Placeholder image to show while loading
   */
  placeholder?: string;
}

interface UseLazyImageReturn {
  /**
   * Ref to attach to the image element
   */
  ref: React.RefObject<HTMLImageElement>;

  /**
   * Current image source (placeholder or actual)
   */
  src: string;

  /**
   * Whether the image is currently loading
   */
  isLoading: boolean;

  /**
   * Whether the image has loaded successfully
   */
  isLoaded: boolean;

  /**
   * Whether an error occurred while loading
   */
  hasError: boolean;
}

export function useLazyImage(
  imageSrc: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {
    rootMargin = '50px',
    threshold = 0.01,
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3C/svg%3E',
  } = options;

  const ref = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoading(true);

            // Create a new image to preload
            const img = new Image();

            img.onload = () => {
              setSrc(imageSrc);
              setIsLoading(false);
              setIsLoaded(true);
            };

            img.onerror = () => {
              setIsLoading(false);
              setHasError(true);
            };

            img.src = imageSrc;

            // Stop observing once we've started loading
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [imageSrc, rootMargin, threshold]);

  return {
    ref,
    src,
    isLoading,
    isLoaded,
    hasError,
  };
}

/**
 * useLazyBackgroundImage Hook
 *
 * Similar to useLazyImage but for background images
 */
export function useLazyBackgroundImage(
  imageSrc: string,
  options: UseLazyImageOptions = {}
): {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
  isLoading: boolean;
  isLoaded: boolean;
} {
  const { rootMargin = '50px', threshold = 0.01 } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoading(true);

            const img = new Image();

            img.onload = () => {
              setBackgroundImage(`url(${imageSrc})`);
              setIsLoading(false);
              setIsLoaded(true);
            };

            img.onerror = () => {
              setIsLoading(false);
            };

            img.src = imageSrc;

            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [imageSrc, rootMargin, threshold]);

  return {
    ref,
    style: { backgroundImage },
    isLoading,
    isLoaded,
  };
}
