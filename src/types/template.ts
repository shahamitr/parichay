import { MicrositeConfig } from './microsite';

export interface MicrositeTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  previewImage: string;
  thumbnailImage: string;
  defaultConfig: Partial<MicrositeConfig>;
  features: string[];
  isPremium: boolean;
}

export type TemplateCategory =
  | 'automotive'
  | 'retail'
  | 'healthcare'
  | 'real-estate'
  | 'consulting'
  | 'restaurant'
  | 'beauty'
  | 'fitness'
  | 'technology'
  | 'general';

export interface TemplatePreview {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnailImage: string;
  isPremium: boolean;
}

export interface TemplateCustomization {
  templateId: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography?: {
    headingFont: string;
    bodyFont: string;
  };
  layout?: {
    headerStyle: 'minimal' | 'standard' | 'bold';
    sectionSpacing: 'compact' | 'standard' | 'spacious';
  };
}

export interface TemplateApiResponse {
  success: boolean;
  data?: MicrositeTemplate[];
  error?: string;
}

export interface TemplatePreviewResponse {
  success: boolean;
  data?: TemplatePreview[];
  error?: string;
}