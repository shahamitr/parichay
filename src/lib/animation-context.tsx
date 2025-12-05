'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimationContextType {
  /**
   * Whether animations should be enabled
   */
  shouldAnimate: boolean;
  /**
   * Whether user prefers reduced motion
   */
  prefersReducedMotion: boolean;
  /**
   * Default animation duration (0 if reduced motion)
   */
  duration: number;
  /**
   * Default transition config
   */
  transition: {
    duration: number;
    ease?: string;
  };
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

/**
 * AnimationProvider Component
 *
 * Provides animation configuration to all child components.
 * Automatically detects and respects user's reduced motion preference.
 *
 * @example
 * ```tsx
 * // In your root layout or app component
 * <AnimationProvider>
 *   <YourApp />
 * </AnimationProvider>
 * ```
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  const value: AnimationContextType = {
    shouldAnimate: !prefersReducedMotion,
    prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : 0.3,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3, ease: 'easeOut' },
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

/**
 * useAnimation Hook
 *
 * Access animation configuration from context.
 * Must be used within AnimationProvider.
 *
 * @returns AnimationContextType
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldAnimate, duration } = useAnimation();
 *
 *   return (
 *     <motion.div
 *       animate={shouldAnimate ? { opacity: 1 } : undefined}
 *       transition={{ duration }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useAnimation(): AnimationContextType {
  const context = useContext(AnimationContext);

  if (context === undefined) {
    // Fallback if used outside provider
    return {
      shouldAnimate: true,
      prefersReducedMotion: false,
      duration: 0.3,
      transition: { duration: 0.3, ease: 'easeOut' },
    };
  }

  return context;
}

/**
 * withAnimation HOC
 *
 * Higher-order component that injects animation configuration as props.
 *
 * @example
 * ```tsx
 * interface MyComponentProps {
 *   shouldAnimate?: boolean;
 *   duration?: number;
 * }
 *
 * const MyComponent = withAnimation<MyComponentProps>(({ shouldAnimate, duration }) => {
 *   return <div>Component with animation props</div>;
 * });
 * ```
 */
export function withAnimation<P extends object>(
  Component: React.ComponentType<P & Partial<AnimationContextType>>
) {
  return function WithAnimationComponent(props: P) {
    const animationConfig = useAnimation();

    return <Component {...props} {...animationConfig} />;
  };
}
