'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Lazy load the AnimatedSection component with framer-motion
const AnimatedSection = dynamic(() => import('./AnimatedSection'), {
  ssr: false,
  loading: () => null, // No loading state to avoid layout shift
});

interface AnimatedSectionLazyProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Lazy-loaded AnimatedSection Component
 *
 * This wrapper dynamically imports the AnimatedSection component
 * to reduce initial bundle size by code-splitting framer-motion.
 */
export default function AnimatedSectionLazy(props: AnimatedSectionLazyProps) {
  return <AnimatedSection {...props} />;
}
