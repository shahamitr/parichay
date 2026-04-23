/**
 * Microsite Asset Types
 * Shared types that can be used in both client and server components
 */

export type AssetType =
  | 'logo'
  | 'gallery'
  | 'video'
  | 'voice'
  | 'document'
  | 'hero'
  | 'testimonials'
  | 'team'
  | 'portfolio'
  | 'favicon'
  | 'og-image';

export interface AssetConfig {
  maxSize: number; // in bytes
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

// Configuration for each asset type
export const ASSET_CONFIGS: Record<AssetType, AssetConfig> = {
  logo: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'],
    allowedExtensions: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
  },
  gallery: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
    allowedExtensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    allowedExtensions: ['mp4', 'webm', 'ogg', 'mov'],
  },
  voice: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/m4a', 'audio/x-m4a'],
    allowedExtensions: ['mp3', 'wav', 'ogg', 'webm', 'm4a'],
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    allowedExtensions: ['pdf', 'doc', 'docx'],
  },
  hero: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    allowedExtensions: ['png', 'jpg', 'jpeg', 'webp'],
  },
  testimonials: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    allowedExtensions: ['png', 'jpg', 'jpeg', 'webp'],
  },
  team: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    allowedExtensions: ['png', 'jpg', 'jpeg', 'webp'],
  },
  portfolio: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
    allowedExtensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  },
  favicon: {
    maxSize: 500 * 1024, // 500KB
    allowedMimeTypes: ['image/png', 'image/x-icon', 'image/ico', 'image/vnd.microsoft.icon'],
    allowedExtensions: ['png', 'ico'],
  },
  'og-image': {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    allowedExtensions: ['png', 'jpg', 'jpeg'],
  },
};

/**
 * Get the public URL for a microsite asset
 */
export function getMicrositeAssetUrl(branchId: string, assetType: AssetType, filename: string): string {
  return `/uploads/microsites/${branchId}/${assetType}/${filename}`;
}

/**
 * Parse a microsite asset URL to extract components
 */
export function parseMicrositeAssetUrl(url: string): {
  branchId: string;
  assetType: AssetType;
  filename: string;
} | null {
  const match = url.match(/\/uploads\/microsites\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  return {
    branchId: match[1],
    assetType: match[2] as AssetType,
    filename: match[3],
  };
}

/**
 * Validate a file against asset type configuration (client-safe)
 */
export function validateAsset(
  file: File,
  assetType: AssetType
): { valid: boolean; error?: string } {
  const config = ASSET_CONFIGS[assetType];

  if (!config) {
    return { valid: false, error: `Invalid asset type: ${assetType}` };
  }

  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` };
  }

  // Check MIME type
  if (!config.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: ${config.allowedMimeTypes.join(', ')}`,
    };
  }

  // Check extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !config.allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${config.allowedExtensions.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
