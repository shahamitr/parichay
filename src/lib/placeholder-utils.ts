/**
 * Utility functions for generating placeholder images and avatars
 */

/**
 * Generate a placeholder avatar with initials
 * @param name - Full name or text to generate initials from
 * @param size - Size in pixels (default: 200)
 * @param bgColor - Background color hex (default: random based on name)
 * @returns Data URL for the placeholder image
 */
export function generateAvatarPlaceholder(
  name: string,
  size: number = 200,
  bgColor?: string
): string {
  // Get initials (first letter of first two words)
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');

  // Generate color based on name if not provided
  if (!bgColor) {
    const colors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#8B5CF6', // Purple
      '#F59E0B', // Orange
      '#06B6D4', // Cyan
      '#EC4899', // Pink
      '#84CC16', // Lime
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    bgColor = colors[hash % colors.length];
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Draw initials
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.4}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL();
}

/**
 * Get placeholder image URL from various services
 */
export const PlaceholderService = {
  /**
   * UI Avatars - Generates avatar with initials
   */
  uiAvatars: (name: string, size: number = 200, bgColor?: string, textColor?: string) => {
    const bg = bgColor?.replace('#', '') || 'random';
    const color = textColor?.replace('#', '') || 'ffffff';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=${bg}&color=${color}&bold=true`;
  },

  /**
   * DiceBear - Generates unique avatar based on seed
   */
  diceBear: (seed: string, style: 'avataaars' | 'bottts' | 'identicon' | 'initials' = 'initials', size: number = 200) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
  },

  /**
   * Boring Avatars - Generates colorful abstract avatars
   */
  boringAvatars: (name: string, variant: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus' = 'marble', size: number = 200) => {
    return `https://source.boringavatars.com/${variant}/${size}/${encodeURIComponent(name)}`;
  },

  /**
   * Placehold.co - Reliable colored placeholder (alternative to via.placeholder.com)
   */
  placeholder: (width: number = 200, height: number = 200, bgColor: string = 'CCCCCC', textColor: string = '333333', text?: string) => {
    const displayText = text ? `?text=${encodeURIComponent(text)}` : '';
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}${displayText}`;
  },

  /**
   * Unsplash - Random photos (for business/product images)
   */
  unsplash: (width: number = 800, height: number = 600, query?: string) => {
    const searchQuery = query ? `?${query}` : '';
    return `https://source.unsplash.com/random/${width}x${height}${searchQuery}`;
  },

  /**
   * Picsum - Random photos (Lorem Picsum)
   */
  picsum: (width: number = 800, height: number = 600, id?: number, grayscale: boolean = false, blur: boolean = false) => {
    const imageId = id ? `/${id}` : '';
    const effects = [];
    if (grayscale) effects.push('grayscale');
    if (blur) effects.push('blur');
    const effectsQuery = effects.length > 0 ? `?${effects.join('&')}` : '';
    return `https://picsum.photos${imageId}/${width}/${height}${effectsQuery}`;
  },
};

/**
 * Get appropriate placeholder based on context
 */
export function getPlaceholder(type: 'avatar' | 'logo' | 'photo' | 'product' | 'banner', name?: string, size?: number): string {
  const defaultName = name || 'User';
  const defaultSize = size || 200;

  switch (type) {
    case 'avatar':
      return PlaceholderService.uiAvatars(defaultName, defaultSize);

    case 'logo':
      // Use UI Avatars for logo with initials - more reliable than DiceBear
      return PlaceholderService.uiAvatars(defaultName, defaultSize, '3B82F6', 'FFFFFF');

    case 'photo':
      // Use Picsum with random ID for variety in gallery
      const randomId = Math.floor(Math.random() * 1000);
      return PlaceholderService.picsum(defaultSize, defaultSize, randomId);

    case 'product':
      // Use Picsum for product images - more reliable and looks better
      return PlaceholderService.picsum(defaultSize, defaultSize);

    case 'banner':
      return PlaceholderService.placeholder(1200, 400, 'E5E7EB', '6B7280', 'Banner');

    default:
      return PlaceholderService.placeholder(defaultSize, defaultSize);
  }
}

/**
 * React component helper for image with fallback
 */
export function getImageWithFallback(src: string | null | undefined, fallbackType: 'avatar' | 'logo' | 'photo' | 'product' | 'banner', name?: string): string {
  if (src && src.trim() !== '') {
    return src;
  }
  return getPlaceholder(fallbackType, name);
}

/**
 * Generate gradient background for cards/sections
 */
export function generateGradientBackground(color1?: string, color2?: string): string {
  const c1 = color1 || '#3B82F6';
  const c2 = color2 || '#8B5CF6';
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

/**
 * Get color from string (consistent color for same string)
 */
export function getColorFromString(str: string): string {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#8B5CF6',
    '#F59E0B', '#06B6D4', '#EC4899', '#84CC16',
    '#6366F1', '#F43F5E', '#14B8A6', '#A855F7',
  ];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
