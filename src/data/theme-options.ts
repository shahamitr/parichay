export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'creative' | 'minimal' | 'bold' | 'nature' | 'tech';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    hero: string;
    section: string;
    button: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: number;
    bodyWeight: number;
  };
  effects: {
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
    shadows: 'none' | 'subtle' | 'medium' | 'strong';
    animations: 'none' | 'subtle' | 'smooth' | 'dynamic';
  };
}

export const themeOptions: ThemeOption[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Professional blue theme with ocean-inspired gradients',
    category: 'business',
    preview: '/themes/ocean-blue.jpg',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#64748B'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      section: 'linear-gradient(to right, #F8FAFC, #E2E8F0)',
      button: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingWeight: 700,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'medium',
      shadows: 'medium',
      animations: 'smooth'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm, energetic theme with sunset colors',
    category: 'creative',
    preview: '/themes/sunset-orange.jpg',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#EF4444',
      background: '#FFFBEB',
      surface: '#FEF3C7',
      text: '#92400E',
      textSecondary: '#D97706'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #EF4444 100%)',
      section: 'linear-gradient(to right, #FFFBEB, #FEF3C7)',
      button: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Open Sans',
      headingWeight: 600,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'large',
      shadows: 'strong',
      animations: 'dynamic'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural, eco-friendly theme with forest greens',
    category: 'nature',
    preview: '/themes/forest-green.jpg',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#F59E0B',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#064E3B',
      textSecondary: '#065F46'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      section: 'linear-gradient(to right, #F0FDF4, #DCFCE7)',
      button: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
    },
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Source Sans Pro',
      headingWeight: 600,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'medium',
      shadows: 'subtle',
      animations: 'smooth'
    }
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Elegant dark theme with purple accents',
    category: 'bold',
    preview: '/themes/midnight-purple.jpg',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: '#0F0F23',
      surface: '#1E1B4B',
      text: '#E2E8F0',
      textSecondary: '#94A3B8'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      section: 'linear-gradient(to right, #0F0F23, #1E1B4B)',
      button: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
      headingWeight: 700,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'large',
      shadows: 'strong',
      animations: 'dynamic'
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Elegant rose gold theme for luxury brands',
    category: 'creative',
    preview: '/themes/rose-gold.jpg',
    colors: {
      primary: '#E11D48',
      secondary: '#BE185D',
      accent: '#F59E0B',
      background: '#FFF7ED',
      surface: '#FED7AA',
      text: '#7C2D12',
      textSecondary: '#A16207'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #E11D48 0%, #BE185D 100%)',
      section: 'linear-gradient(to right, #FFF7ED, #FED7AA)',
      button: 'linear-gradient(135deg, #E11D48 0%, #BE185D 100%)'
    },
    typography: {
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Lato',
      headingWeight: 600,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'full',
      shadows: 'medium',
      animations: 'smooth'
    }
  },
  {
    id: 'tech-cyan',
    name: 'Tech Cyan',
    description: 'Modern tech theme with cyan and electric blue',
    category: 'tech',
    preview: '/themes/tech-cyan.jpg',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#F59E0B',
      background: '#F0F9FF',
      surface: '#E0F7FA',
      text: '#0F172A',
      textSecondary: '#475569'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      section: 'linear-gradient(to right, #F0F9FF, #E0F7FA)',
      button: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      headingWeight: 700,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'small',
      shadows: 'subtle',
      animations: 'dynamic'
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean black and white minimalist theme',
    category: 'minimal',
    preview: '/themes/monochrome.jpg',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #000000 0%, #374151 100%)',
      section: 'linear-gradient(to right, #FFFFFF, #F9FAFB)',
      button: 'linear-gradient(135deg, #000000 0%, #374151 100%)'
    },
    typography: {
      headingFont: 'IBM Plex Sans',
      bodyFont: 'IBM Plex Sans',
      headingWeight: 600,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'none',
      shadows: 'none',
      animations: 'subtle'
    }
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Vibrant coral theme with tropical vibes',
    category: 'bold',
    preview: '/themes/coral-reef.jpg',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FF5722',
      accent: '#4ECDC4',
      background: '#FFF5F5',
      surface: '#FED7D7',
      text: '#2D3748',
      textSecondary: '#718096'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FF6B6B 0%, #FF5722 100%)',
      section: 'linear-gradient(to right, #FFF5F5, #FED7D7)',
      button: 'linear-gradient(135deg, #FF6B6B 0%, #FF5722 100%)'
    },
    typography: {
      headingFont: 'Nunito',
      bodyFont: 'Nunito Sans',
      headingWeight: 700,
      bodyWeight: 400
    },
    effects: {
      borderRadius: 'large',
      shadows: 'medium',
      animations: 'dynamic'
    }
  }
];