'use client';

import { useEffect, useState } from 'react';

/**
 * useReducedMotion Hook
 *
 * Detects if the user has requested reduced motion via their OS settings.
 * Automatically updates when the preference changes.
 *
 * @returns boolean indicating if reduced motion is preferred
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <div>
 *       {prefersReducedMotion ? (
 *         <StaticContent />
 *       ) : (
 *         <AnimatedContent />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event listener for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener
    // Use addEventListener for modern browsers, addListener for older ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * useAnimationConfig Hook
 *
 * Returns animation configuration based on reduced motion preference.
 * Provides instant transitions when reduced motion is preferred.
 *
 * @returns object with animation settings
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldAnimate, duration, transition } = useAnimationConfig();
 *
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={transition}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : 0.3,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3, ease: 'easeOut' },
  };
}
