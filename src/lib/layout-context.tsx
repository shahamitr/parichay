'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { LayoutOption, getLayoutById, getLayoutClasses, layoutOptions } from '@/data/layout-options';

// Layout context type
interface LayoutContextType {
  layout: LayoutOption;
  classes: ReturnType<typeof getLayoutClasses>;
  // Section-specific layout variants
  hero: LayoutOption['sections']['hero'];
  about: LayoutOption['sections']['about'];
  services: LayoutOption['sections']['services'];
  gallery: LayoutOption['sections']['gallery'];
  contact: LayoutOption['sections']['contact'];
  testimonials: LayoutOption['sections']['testimonials'];
  // Style preferences
  spacing: LayoutOption['spacing'];
  typography: LayoutOption['typography'];
  corners: LayoutOption['corners'];
  animations: LayoutOption['animations'];
  colorScheme: LayoutOption['colorScheme'];
  containerWidth: LayoutOption['containerWidth'];
  // Utility functions
  getAnimationClass: (element?: string) => string;
  getContainerClass: () => string;
  getSectionClass: () => string;
  getCardClass: (variant?: 'default' | 'elevated' | 'bordered') => string;
  getButtonClass: (variant?: 'primary' | 'secondary' | 'outline') => string;
  getTypographyClass: () => string;
}

// Default layout
const defaultLayout = layoutOptions[0]; // modern-business

const LayoutContext = createContext<LayoutContextType | null>(null);

interface LayoutProviderProps {
  children: ReactNode;
  layoutId?: string;
}

export function LayoutProvider({ children, layoutId = 'modern-business' }: LayoutProviderProps) {
  const layout = useMemo(() => {
    return getLayoutById(layoutId) || defaultLayout;
  }, [layoutId]);

  const classes = useMemo(() => getLayoutClasses(layout), [layout]);

  const value = useMemo<LayoutContextType>(() => ({
    layout,
    classes,
    // Section variants
    hero: layout.sections.hero,
    about: layout.sections.about,
    services: layout.sections.services,
    gallery: layout.sections.gallery,
    contact: layout.sections.contact,
    testimonials: layout.sections.testimonials,
    // Style preferences
    spacing: layout.spacing,
    typography: layout.typography,
    corners: layout.corners,
    animations: layout.animations,
    colorScheme: layout.colorScheme,
    containerWidth: layout.containerWidth,
    // Utility functions
    getAnimationClass: (element?: string) => {
      if (layout.animations === 'none') return '';
      const animationClasses = {
        subtle: 'transition-all duration-300 ease-out',
        moderate: 'transition-all duration-500 ease-out transform hover:scale-[1.02]',
        dynamic: 'transition-all duration-700 ease-out transform hover:scale-105 hover:-translate-y-1'
      };
      return animationClasses[layout.animations] || '';
    },
    getContainerClass: () => classes.container,
    getSectionClass: () => classes.section,
    getCardClass: (variant = 'default') => {
      const base = classes.card;
      const variants = {
        default: `${base} bg-white dark:bg-gray-800`,
        elevated: `${base} bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl`,
        bordered: `${base} bg-transparent border border-gray-200 dark:border-gray-700`
      };
      return variants[variant];
    },
    getButtonClass: (variant = 'primary') => {
      const base = classes.button;
      const variants = {
        primary: `${base} bg-brand-primary text-white hover:opacity-90`,
        secondary: `${base} bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600`,
        outline: `${base} bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white`
      };
      return variants[variant];
    },
    getTypographyClass: () => classes.text
  }), [layout, classes]);

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (!context) {
    // Return default layout values if not wrapped in provider
    const defaultClasses = getLayoutClasses(defaultLayout);
    return {
      layout: defaultLayout,
      classes: defaultClasses,
      hero: defaultLayout.sections.hero,
      about: defaultLayout.sections.about,
      services: defaultLayout.sections.services,
      gallery: defaultLayout.sections.gallery,
      contact: defaultLayout.sections.contact,
      testimonials: defaultLayout.sections.testimonials,
      spacing: defaultLayout.spacing,
      typography: defaultLayout.typography,
      corners: defaultLayout.corners,
      animations: defaultLayout.animations,
      colorScheme: defaultLayout.colorScheme,
      containerWidth: defaultLayout.containerWidth,
      getAnimationClass: () => '',
      getContainerClass: () => defaultClasses.container,
      getSectionClass: () => defaultClasses.section,
      getCardClass: () => defaultClasses.card,
      getButtonClass: () => defaultClasses.button,
      getTypographyClass: () => defaultClasses.text
    };
  }
  return context;
}

// Section-specific layout hooks
export function useHeroLayout() {
  const { hero, getAnimationClass, colorScheme } = useLayout();

  return {
    variant: hero,
    isFullWidth: hero === 'full-width',
    isSplit: hero === 'split',
    isCentered: hero === 'centered',
    isMinimal: hero === 'minimal',
    hasVideoBackground: hero === 'video-bg',
    hasParallax: hero === 'parallax',
    hasGradientWave: hero === 'gradient-wave',
    animationClass: getAnimationClass('hero'),
    isDarkFirst: colorScheme === 'dark-first'
  };
}

export function useServicesLayout() {
  const { services, getAnimationClass, getCardClass, corners } = useLayout();

  return {
    variant: services,
    isGrid: services === 'grid',
    isCarousel: services === 'carousel',
    isList: services === 'list',
    isMasonry: services === 'masonry',
    isTabs: services === 'tabs',
    isFlipCards: services === 'flip-cards',
    animationClass: getAnimationClass('services'),
    cardClass: getCardClass('elevated'),
    gridCols: services === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : '',
    corners
  };
}

export function useGalleryLayout() {
  const { gallery, getAnimationClass, corners } = useLayout();

  return {
    variant: gallery,
    isMasonry: gallery === 'masonry',
    isGrid: gallery === 'grid',
    isCarousel: gallery === 'carousel',
    isLightbox: gallery === 'lightbox',
    isFilmstrip: gallery === 'filmstrip',
    isPinterest: gallery === 'pinterest',
    animationClass: getAnimationClass('gallery'),
    corners
  };
}

export function useContactLayout() {
  const { contact, getAnimationClass, getCardClass } = useLayout();

  return {
    variant: contact,
    isSplit: contact === 'split',
    isCentered: contact === 'centered',
    hasSidebar: contact === 'sidebar',
    isFullWidth: contact === 'full-width',
    isFloating: contact === 'floating',
    isCompact: contact === 'compact',
    animationClass: getAnimationClass('contact'),
    cardClass: getCardClass('elevated')
  };
}

export function useTestimonialsLayout() {
  const { testimonials, getAnimationClass, getCardClass } = useLayout();

  return {
    variant: testimonials,
    isCarousel: testimonials === 'carousel',
    isGrid: testimonials === 'grid',
    isStacked: testimonials === 'stacked',
    isQuoteWall: testimonials === 'quote-wall',
    isVideoGrid: testimonials === 'video-grid',
    animationClass: getAnimationClass('testimonials'),
    cardClass: getCardClass('bordered')
  };
}

export function useAboutLayout() {
  const { about, getAnimationClass, getCardClass } = useLayout();

  return {
    variant: about,
    isSingleColumn: about === 'single-column',
    isTwoColumn: about === 'two-column',
    isCardGrid: about === 'card-grid',
    isTimeline: about === 'timeline',
    isAccordion: about === 'accordion',
    isMagazine: about === 'magazine',
    animationClass: getAnimationClass('about'),
    cardClass: getCardClass('default')
  };
}
