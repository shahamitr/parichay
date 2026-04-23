// Animation fallback utilities for when Framer Motion has issues

export const createFallbackAnimation = (element: HTMLElement, animation: string) => {
  if (!element) return;

  // Add CSS class for animation
  element.classList.add(`animate-${animation}`);

  // Remove animation class after completion
  setTimeout(() => {
    element.classList.remove(`animate-${animation}`);
  }, 1000);
};

export const animationFallbacks = {
  fadeIn: 'fade-in',
  slideUp: 'slide-up-fade',
  slideDown: 'slide-down-fade',
  slideLeft: 'slide-left-fade',
  slideRight: 'slide-right-fade',
  scaleIn: 'zoom-in',
  bounceIn: 'bounce-in',
};

// Check if Framer Motion is available
export const isFramerMotionAvailable = () => {
  try {
    // Try to import framer-motion dynamically
    return typeof window !== 'undefined' && 'motion' in window;
  } catch {
    return false;
  }
};

// Graceful animation wrapper
export const withAnimationFallback = (
  component: React.ComponentType<any>,
  fallbackAnimation?: string
) => {
  return (props: any) => {
    const isMotionAvailable = isFramerMotionAvailable();

    if (isMotionAvailable) {
      return React.createElement(component, props);
    }

    // Return a div with CSS animation fallback
    return React.createElement('div', {
      ...props,
      className: `${props.className || ''} ${fallbackAnimation ? `animate-${fallbackAnimation}` : ''}`,
    });
  };
};