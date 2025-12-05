// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { prefersReducedMotion } from '@/config/animations';

/**
 * ScrollProgressBar Component
 *
 * A visual indicator showing page scroll progress.
 * - Calculates scroll percentage
 * - Updates progress bar on scroll
 * - Smooth spring animation
 * - Respects reduced motion preferences
 *
 * Requirements: 8.2
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Use spring animation for smooth progress updates
  const springProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate scroll percentage
  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Calculate percentage (0 to 100)
      const totalScrollableHeight = documentHeight - windowHeight;
      const progress = totalScrollableHeight > 0
        ? (scrollTop / totalScrollableHeight) * 100
        : 0;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Initial calculation
    calculateScrollProgress();

    // Update on scroll
    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    window.addEventListener('resize', calculateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
    };
  }, []);

  // Disable spring animation if user prefers reduced motion
  const shouldAnimate = !prefersReducedMotion();
  const displayProgress = shouldAnimate ? springProgress : scrollProgress;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1150] h-1 bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 shadow-lg"
        style={{
          width: shouldAnimate
            ? useTransform(displayProgress, (value) => `${value}%`)
            : `${scrollProgress}%`,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
