// @ts-nocheck
export interface ThemeConfig {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  colors: {
 string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  layout: {
    style: 'modern' | 'classic' | 'minimal' | 'bold';
    spacing: 'compact' | 'normal' | 'spacious';
    borderRadius: 'none' | 'small' | 'medium' | 'large';
    shadows: 'none' | 'subtle' | 'normal' | 'prominent';
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'business-professional',
    name: 'Professional Blue',
    categoryId: 'business-owners',
    description: 'Classic professional theme with blue tones',
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'Roboto Mono',
    },
    layout: {
      style: 'modern',
      spacing: 'normal',
      borderRadius: 'medium',
      shadows: 'normal',
    },
  },
  {
    id: 'corporate-executive',
    name: 'Executive Dark',
    categoryId: 'corporate-professionals',
    description: 'Sophisticated dark theme for corporate professionals',
    colors: {
      primary: '#0F172A',
      secondary: '#334155',
      accent: '#64748B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#0F172A',
      textSecondary: '#475569',
      border: '#E2E8F0',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    layout: {
      style: 'classic',
      spacing: 'normal',
      borderRadius: 'small',
      shadows: 'subtle',
    },
  },
  {
    id: 'event-elegant',
    name: 'Elegant Pink',
    categoryId: 'event-planners',
    description: 'Elegant theme with pink and rose tones',
    colors: {
      primary: '#DB2777',
      secondary: '#EC4899',
      accent: '#F472B6',
      background: '#FFF1F2',
      surface: '#FFFFFF',
      text: '#881337',
      textSecondary: '#9F1239',
      border: '#FECDD3',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
      mono: 'Courier Prime',
    },
    layout: {
      style: 'classic',
      spacing: 'spacious',
      borderRadius: 'large',
      shadows: 'subtle',
    },
  },
  {
    id: 'freelancer-purple',
    name: 'Creative Purple',
    categoryId: 'freelancers-consultants',
    description: 'Modern purple theme for creative professionals',
    colors: {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#18181B',
      textSecondary: '#52525B',
      border: '#E4E4E7',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'Fira Code',
    },
    layout: {
      style: 'minimal',
      spacing: 'spacious',
      borderRadius: 'medium',
      shadows: 'none',
    },
  },
  {
    id: 'education-green',
    name: 'Academic Green',
    categoryId: 'educational-institutions',
    description: 'Fresh green theme for educational institutions',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      text: '#064E3B',
      textSecondary: '#065F46',
      border: '#D1FAE5',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Open Sans',
      mono: 'Source Code Pro',
    },
    layout: {
      style: 'classic',
      spacing: 'normal',
      borderRadius: 'medium',
      shadows: 'normal',
    },
  },
  {
    id: 'creative-orange',
    name: 'Bold Orange',
    categoryId: 'creatives-designers',
    description: 'Bold and vibrant orange theme for creatives',
    colors: {
      primary: '#EA580C',
      secondary: '#F97316',
      accent: '#FB923C',
      background: '#FFFBEB',
      surface: '#FFFFFF',
      text: '#7C2D12',
      textSecondary: '#9A3412',
      border: '#FED7AA',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: 'Bebas Neue',
      body: 'Roboto',
      mono: 'IBM Plex Mono',
    },
    layout: {
      style: 'bold',
      spacing: 'spacious',
      borderRadius: 'large',
      shadows: 'prominent',
    },
  },
];
