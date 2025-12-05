/**
 * Font Options for Theme Customization
 */

import { FontOption } from '@/types/theme';

export const fontOptions: FontOption[] = [
  // Sans-serif fonts
  {
    name: 'Inter',
    family: 'Inter, system-ui, sans-serif',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    googleFont: true,
  },
  {
    name: 'Roboto',
    family: 'Roboto, sans-serif',
    category: 'sans-serif',
    weights: [400, 500, 700],
    googleFont: true,
  },
  {
    name: 'Open Sans',
    family: 'Open Sans, sans-serif',
    category: 'sans-serif',
    weights: [400, 600, 700],
    googleFont: true,
  },
  {
    name: 'Lato',
    family: 'Lato, sans-serif',
    category: 'sans-serif',
    weights: [400, 700],
    googleFont: true,
  },
  {
    name: 'Poppins',
    family: 'Poppins, sans-serif',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    googleFont: true,
  },
  {
    name: 'Montserrat',
    family: 'Montserrat, sans-serif',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    googleFont: true,
  },

  // Serif fonts
  {
    name: 'Playfair Display',
    family: 'Playfair Display, serif',
    category: 'serif',
    weights: [400, 700],
    googleFont: true,
  },
  {
    name: 'Merriweather',
    family: 'Merriweather, serif',
    category: 'serif',
    weights: [400, 700],
    googleFont: true,
  },
  {
    name: 'Lora',
    family: 'Lora, serif',
    category: 'serif',
    weights: [400, 600, 700],
    googleFont: true,
  },

  // Display fonts
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue, display',
    category: 'display',
    weights: [400],
    googleFont: true,
  },
  {
    name: 'Oswald',
    family: 'Oswald, display',
    category: 'display',
    weights: [400, 600, 700],
    googleFont: true,
  },

  // System fonts
  {
    name: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    googleFont: false,
  },
];

/**
 * Get font option by family name
 */
export function getFontByFamily(family: string): FontOption | undefined {
  return fontOptions.find(font => font.family === family);
}

/**
 * Get fonts by category
 */
export function getFontsByCategory(category: FontOption['category']): FontOption[] {
  return fontOptions.filter(font => font.category === category);
}

/**
 * Generate Google Fonts URL for selected fonts
 */
export function generateGoogleFontsUrl(fonts: FontOption[]): string {
  const googleFonts = fonts.filter(font => font.googleFont);

  if (googleFonts.length === 0) {
    return '';
  }

  const fontFamilies = googleFonts.map(font => {
    const weights = font.weights.join(';');
    return `${font.name.replace(/ /g, '+')}:wght@${weights}`;
  });

  return `https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap`;
}
