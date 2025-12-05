/**
 * Animation Configuration
 *
 * Centralized animation variants and configuration for Framer Motion.
 * Provides consistent animation behavior across the application.
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Animation Variants
 *
 * Predefined animation states for common use cases.
 */
export const animationVariants = {
  /**
   * Fade up animation - element fades in while moving up
   */
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      },
    },
  } as Variants,

  /**
   * Fade in animation - simple opacity transition
   */
  fadeIn: {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4
      },
    },
  } as Variants,

  /**
   * Scale in animation - element scales up while fading in
   */
  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      },
    },
  } as Variants,

  /**
   * Slide in from left
   */
  slideInLeft: {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  } as Variants,

  /**
   * Slide in from right
   */
  slideInRight: {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  } as Variants,

  /**
   * Stagger children animation - animates children with delay
   */
  staggerChildren: {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  /**
   * Stagger children (fast) - quicker stagger for lists
   */
  staggerChildrenFast: {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  } as Variants,
};

/**
 * Scroll Animation Configuration
 *
 * Settings for IntersectionObserver-based scroll animations.
 */
export const scrollAnimationConfig = {
  /**
   * Percentage of element that must be visible to trigger animation
   */
  threshold: 0.1,

  /**
   * Whether animation should only trigger once
   */
  triggerOnce: true,

  /**
   * Margin around the viewport for early/late triggering
   */
  rootMargin: '-50px 0px',
};

/**
 * Transition Presets
 *
 * Reusable transition configurations.
 */
export const transitionPresets = {
  /**
   * Spring transition - bouncy, natural feel
   */
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  } as Transition,

  /**
   * Smooth transition - ease out curve
   */
  smooth: {
    duration: 0.4,
    ease: 'easeOut',
  } as Transition,

  /**
   * Fast transition - quick response
   */
  fast: {
    duration: 0.2,
    ease: 'easeOut',
  } as Transition,

  /**
   * Slow transition - deliberate, elegant
   */
  slow: {
    duration: 0.8,
    ease: 'easeInOut',
  } as Transition,
};

/**
 * Hover Animation Presets
 *
 * Common hover effects for interactive elements.
 */
export const hoverAnimations = {
  /**
   * Scale up slightly on hover
   */
  scale: {
    scale: 1.05,
    transition: transitionPresets.fast,
  },

  /**
   * Scale up with glow effect (use with box-shadow)
   */
  scaleGlow: {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: transitionPresets.fast,
  },

  /**
   * Lift up (translate Y)
   */
  lift: {
    y: -4,
    transition: transitionPresets.fast,
  },

  /**
   * Lift with shadow
   */
  liftShadow: {
    y: -4,
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
    transition: transitionPresets.fast,
  },

  /**
   * Rotate slightly
   */
  rotate: {
    rotate: 2,
    transition: transitionPresets.fast,
  },
};

/**
 * Tap Animation Presets
 *
 * Feedback animations for tap/click interactions.
 */
export const tapAnimations = {
  /**
   * Scale down on tap
   */
  scale: {
    scale: 0.95,
  },

  /**
   * Scale down more on tap
   */
  scaleDown: {
    scale: 0.9,
  },
};

/**
 * Page Transition Variants
 *
 * For page-level animations.
 */
export const pageTransitions = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Reduced Motion Check
 *
 * Utility to check if user prefers reduced motion.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get Animation Variant with Reduced Motion Support
 *
 * Returns animation variant or instant transition based on user preference.
 */
export const getAnimationVariant = (variant: Variants): Variants => {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  return variant;
};

/**
 * Get Transition with Reduced Motion Support
 *
 * Returns instant transition if reduced motion is preferred.
 */
export const getTransition = (transition: Transition): Transition => {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  return transition;
};

/**
 * Reduced Motion Variants
 *
 * Instant variants for reduced motion preference.
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

/**
 * Create Accessible Animation Variants
 *
 * Wraps animation variants to automatically respect reduced motion.
 * Use this when creating custom variants.
 *
 * @param variants - The animation variants to wrap
 * @returns Variants that respect reduced motion preference
 *
 * @example
 * ```tsx
 * const myVariants = createAccessibleVariants({
 *   hidden: { opacity: 0, y: 20 },
 *   visible: { opacity: 1, y: 0 }
 * });
 * ```
 */
export const createAccessibleVariants = (variants: Variants): Variants => {
  return prefersReducedMotion() ? reducedMotionVariants : variants;
};
