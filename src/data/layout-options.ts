export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'creative' | 'minimal' | 'bold' | 'elegant';
  preview: string;
  sections: {
    hero: 'full-width' | 'centered' | 'split' | 'minimal' | 'video-bg' | 'parallax' | 'gradient-wave';
    about: 'single-column' | 'two-column' | 'card-grid' | 'timeline' | 'accordion' | 'magazine';
    services: 'grid' | 'carousel' | 'list' | 'masonry' | 'tabs' | 'flip-cards';
    gallery: 'masonry' | 'grid' | 'carousel' | 'lightbox' | 'filmstrip' | 'pinterest';
    contact: 'split' | 'centered' | 'sidebar' | 'full-width' | 'floating' | 'compact';
    testimonials: 'carousel' | 'grid' | 'stacked' | 'quote-wall' | 'video-grid';
  };
  spacing: 'compact' | 'normal' | 'spacious' | 'generous';
  containerWidth: 'narrow' | 'normal' | 'wide' | 'full';
  typography: 'classic' | 'modern' | 'playful' | 'elegant' | 'bold';
  corners: 'sharp' | 'rounded' | 'pill' | 'mixed';
  animations: 'none' | 'subtle' | 'moderate' | 'dynamic';
  colorScheme: 'light-first' | 'dark-first' | 'alternating' | 'gradient-sections';
}

export const layoutOptions: LayoutOption[] = [
  // ============== BUSINESS LAYOUTS ==============
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Clean, professional layout ideal for corporations and agencies',
    category: 'business',
    preview: '/layouts/modern-business.jpg',
    sections: {
      hero: 'centered',
      about: 'two-column',
      services: 'grid',
      gallery: 'masonry',
      contact: 'split',
      testimonials: 'carousel'
    },
    spacing: 'normal',
    containerWidth: 'normal',
    typography: 'modern',
    corners: 'rounded',
    animations: 'subtle',
    colorScheme: 'light-first'
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Traditional corporate layout with structured sections',
    category: 'business',
    preview: '/layouts/corporate-professional.jpg',
    sections: {
      hero: 'split',
      about: 'timeline',
      services: 'grid',
      gallery: 'grid',
      contact: 'full-width',
      testimonials: 'grid'
    },
    spacing: 'normal',
    containerWidth: 'normal',
    typography: 'classic',
    corners: 'sharp',
    animations: 'none',
    colorScheme: 'light-first'
  },
  {
    id: 'consulting-firm',
    name: 'Consulting Firm',
    description: 'Authoritative design for consultants and advisors',
    category: 'business',
    preview: '/layouts/consulting-firm.jpg',
    sections: {
      hero: 'minimal',
      about: 'magazine',
      services: 'tabs',
      gallery: 'lightbox',
      contact: 'sidebar',
      testimonials: 'stacked'
    },
    spacing: 'spacious',
    containerWidth: 'normal',
    typography: 'elegant',
    corners: 'sharp',
    animations: 'subtle',
    colorScheme: 'alternating'
  },

  // ============== CREATIVE LAYOUTS ==============
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Visual-first layout for creative professionals',
    category: 'creative',
    preview: '/layouts/creative-portfolio.jpg',
    sections: {
      hero: 'full-width',
      about: 'single-column',
      services: 'masonry',
      gallery: 'pinterest',
      contact: 'floating',
      testimonials: 'quote-wall'
    },
    spacing: 'spacious',
    containerWidth: 'wide',
    typography: 'playful',
    corners: 'rounded',
    animations: 'dynamic',
    colorScheme: 'gradient-sections'
  },
  {
    id: 'photographer-studio',
    name: 'Photographer Studio',
    description: 'Image-centric layout for photographers',
    category: 'creative',
    preview: '/layouts/photographer-studio.jpg',
    sections: {
      hero: 'video-bg',
      about: 'single-column',
      services: 'flip-cards',
      gallery: 'filmstrip',
      contact: 'compact',
      testimonials: 'video-grid'
    },
    spacing: 'generous',
    containerWidth: 'full',
    typography: 'modern',
    corners: 'sharp',
    animations: 'moderate',
    colorScheme: 'dark-first'
  },
  {
    id: 'startup-dynamic',
    name: 'Startup Dynamic',
    description: 'Modern, dynamic layout for tech startups',
    category: 'creative',
    preview: '/layouts/startup-dynamic.jpg',
    sections: {
      hero: 'gradient-wave',
      about: 'card-grid',
      services: 'carousel',
      gallery: 'carousel',
      contact: 'split',
      testimonials: 'carousel'
    },
    spacing: 'spacious',
    containerWidth: 'wide',
    typography: 'bold',
    corners: 'pill',
    animations: 'dynamic',
    colorScheme: 'gradient-sections'
  },

  // ============== MINIMAL LAYOUTS ==============
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Minimalist design with focus on content',
    category: 'minimal',
    preview: '/layouts/minimal-clean.jpg',
    sections: {
      hero: 'minimal',
      about: 'single-column',
      services: 'list',
      gallery: 'grid',
      contact: 'centered',
      testimonials: 'stacked'
    },
    spacing: 'compact',
    containerWidth: 'narrow',
    typography: 'modern',
    corners: 'sharp',
    animations: 'none',
    colorScheme: 'light-first'
  },
  {
    id: 'zen-spa',
    name: 'Zen & Wellness',
    description: 'Calming layout for spas and wellness centers',
    category: 'minimal',
    preview: '/layouts/zen-spa.jpg',
    sections: {
      hero: 'parallax',
      about: 'two-column',
      services: 'carousel',
      gallery: 'lightbox',
      contact: 'centered',
      testimonials: 'carousel'
    },
    spacing: 'generous',
    containerWidth: 'normal',
    typography: 'elegant',
    corners: 'rounded',
    animations: 'subtle',
    colorScheme: 'light-first'
  },
  {
    id: 'nordic-simple',
    name: 'Nordic Simple',
    description: 'Scandinavian-inspired clean design',
    category: 'minimal',
    preview: '/layouts/nordic-simple.jpg',
    sections: {
      hero: 'centered',
      about: 'accordion',
      services: 'list',
      gallery: 'pinterest',
      contact: 'compact',
      testimonials: 'stacked'
    },
    spacing: 'spacious',
    containerWidth: 'narrow',
    typography: 'modern',
    corners: 'rounded',
    animations: 'subtle',
    colorScheme: 'alternating'
  },

  // ============== BOLD LAYOUTS ==============
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'High-impact design with strong visuals',
    category: 'bold',
    preview: '/layouts/bold-impact.jpg',
    sections: {
      hero: 'video-bg',
      about: 'magazine',
      services: 'flip-cards',
      gallery: 'masonry',
      contact: 'full-width',
      testimonials: 'quote-wall'
    },
    spacing: 'normal',
    containerWidth: 'wide',
    typography: 'bold',
    corners: 'mixed',
    animations: 'dynamic',
    colorScheme: 'dark-first'
  },
  {
    id: 'event-venue',
    name: 'Event & Venue',
    description: 'Eye-catching layout for events and venues',
    category: 'bold',
    preview: '/layouts/event-venue.jpg',
    sections: {
      hero: 'parallax',
      about: 'card-grid',
      services: 'tabs',
      gallery: 'carousel',
      contact: 'floating',
      testimonials: 'video-grid'
    },
    spacing: 'spacious',
    containerWidth: 'full',
    typography: 'bold',
    corners: 'pill',
    animations: 'moderate',
    colorScheme: 'gradient-sections'
  },
  {
    id: 'fitness-energy',
    name: 'Fitness & Energy',
    description: 'Dynamic layout for fitness and sports',
    category: 'bold',
    preview: '/layouts/fitness-energy.jpg',
    sections: {
      hero: 'full-width',
      about: 'timeline',
      services: 'masonry',
      gallery: 'filmstrip',
      contact: 'split',
      testimonials: 'grid'
    },
    spacing: 'compact',
    containerWidth: 'wide',
    typography: 'bold',
    corners: 'sharp',
    animations: 'dynamic',
    colorScheme: 'dark-first'
  },

  // ============== ELEGANT LAYOUTS ==============
  {
    id: 'luxury-boutique',
    name: 'Luxury Boutique',
    description: 'Sophisticated design for luxury brands',
    category: 'elegant',
    preview: '/layouts/luxury-boutique.jpg',
    sections: {
      hero: 'centered',
      about: 'magazine',
      services: 'carousel',
      gallery: 'lightbox',
      contact: 'sidebar',
      testimonials: 'stacked'
    },
    spacing: 'generous',
    containerWidth: 'normal',
    typography: 'elegant',
    corners: 'sharp',
    animations: 'subtle',
    colorScheme: 'light-first'
  },
  {
    id: 'restaurant-hospitality',
    name: 'Restaurant & Hospitality',
    description: 'Visual layout perfect for restaurants and hospitality',
    category: 'elegant',
    preview: '/layouts/restaurant-hospitality.jpg',
    sections: {
      hero: 'parallax',
      about: 'two-column',
      services: 'masonry',
      gallery: 'pinterest',
      contact: 'sidebar',
      testimonials: 'carousel'
    },
    spacing: 'normal',
    containerWidth: 'wide',
    typography: 'elegant',
    corners: 'rounded',
    animations: 'subtle',
    colorScheme: 'alternating'
  },
  {
    id: 'wedding-planner',
    name: 'Wedding & Events',
    description: 'Romantic design for wedding planners and event organizers',
    category: 'elegant',
    preview: '/layouts/wedding-planner.jpg',
    sections: {
      hero: 'parallax',
      about: 'single-column',
      services: 'flip-cards',
      gallery: 'pinterest',
      contact: 'centered',
      testimonials: 'quote-wall'
    },
    spacing: 'generous',
    containerWidth: 'normal',
    typography: 'elegant',
    corners: 'pill',
    animations: 'subtle',
    colorScheme: 'light-first'
  }
];

// Helper function to get layout by ID
export function getLayoutById(id: string): LayoutOption | undefined {
  return layoutOptions.find(layout => layout.id === id);
}

// Helper function to get layouts by category
export function getLayoutsByCategory(category: LayoutOption['category']): LayoutOption[] {
  return layoutOptions.filter(layout => layout.category === category);
}

// Get CSS classes based on layout options
export function getLayoutClasses(layout: LayoutOption): {
  container: string;
  section: string;
  card: string;
  button: string;
  text: string;
} {
  const containerWidths = {
    narrow: 'max-w-4xl',
    normal: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-full'
  };

  const spacings = {
    compact: 'py-8 md:py-12',
    normal: 'py-12 md:py-16',
    spacious: 'py-16 md:py-24',
    generous: 'py-20 md:py-32'
  };

  const corners = {
    sharp: 'rounded-none',
    rounded: 'rounded-lg md:rounded-xl',
    pill: 'rounded-2xl md:rounded-3xl',
    mixed: 'rounded-lg'
  };

  const typography = {
    classic: 'font-serif',
    modern: 'font-sans',
    playful: 'font-sans',
    elegant: 'font-serif tracking-wide',
    bold: 'font-sans font-bold'
  };

  return {
    container: `${containerWidths[layout.containerWidth]} mx-auto px-4 md:px-6`,
    section: spacings[layout.spacing],
    card: corners[layout.corners],
    button: `${corners[layout.corners]} transition-all duration-300`,
    text: typography[layout.typography]
  };
}
