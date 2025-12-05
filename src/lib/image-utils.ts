/**
 * Image Utilities
 * Handles image validation, compression, and processing
 *
 * Performance Optimizations:
 * - Multi-size generation for responsive images
 * - Advanced compression with quality presets
 * - Lazy loading support
 * - WebP conversion for modern browsers
 */

/**
 * Image size presets for responsive images
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, quality: 0.8 },
  small: { width: 320, height: 320, quality: 0.85 },
  medium: { width: 640, height: 640, quality: 0.85 },
  large: { width: 1024, height: 1024, quality: 0.85 },
  xlarge: { width: 1920, height: 1920, quality: 0.9 },
} as const;

/**
 * Quality presets for different use cases
 */
export const QUALITY_PRESETS = {
  thumbnail: 0.7,
  preview: 0.8,
  standard: 0.85,
  high: 0.9,
  maximum: 0.95,
} as const;

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const {
      maxSizeMB = 5,
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
    } = options;

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      resolve({
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      });
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      resolve({
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      });
      return;
    }

    // Check dimensions if specified
    if (minWidth || minHeight || maxWidth || maxHeight) {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        if (minWidth && img.width < minWidth) {
          resolve({
            valid: false,
            error: `Image width must be at least ${minWidth}px`,
          });
          return;
        }

        if (minHeight && img.height < minHeight) {
          resolve({
            valid: false,
            error: `Image height must be at least ${minHeight}px`,
          });
          return;
        }

        if (maxWidth && img.width > maxWidth) {
          resolve({
            valid: false,
            error: `Image width must be at most ${maxWidth}px`,
          });
          return;
        }

        if (maxHeight && img.height > maxHeight) {
          resolve({
            valid: false,
            error: `Image height must be at most ${maxHeight}px`,
          });
          return;
        }

        resolve({ valid: true });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'Failed to load image',
        });
      };

      img.src = url;
    } else {
      resolve({ valid: true });
    }
  });
}

/**
 * Compress image file
 */
export function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob != null) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Convert image to data URL
 */
export function imageToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Generate multiple image sizes for responsive images
 */
export async function generateResponsiveImages(
  file: File,
  options: {
    sizes?: Array<keyof typeof IMAGE_SIZES>;
    format?: 'original' | 'webp';
  } = {}
): Promise<Array<{ size: string; width: number; height: number; dataUrl: string }>> {
  const { sizes = ['small', 'medium', 'large'], format = 'original' } = options;

  const results = await Promise.all(
    sizes.map(async (sizeName) => {
      const sizeConfig = IMAGE_SIZES[sizeName];
      const blob = await compressImage(file, {
        maxWidth: sizeConfig.width,
        maxHeight: sizeConfig.height,
        quality: sizeConfig.quality,
      });

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      return {
        size: sizeName,
        width: sizeConfig.width,
        height: sizeConfig.height,
        dataUrl,
      };
    })
  );

  return results;
}

/**
 * Generate favicon sizes
 */
export function generateFaviconSizes(
  file: File
): Promise<{ size: number; dataUrl: string }[]> {
  const sizes = [16, 32, 48, 64, 128, 256];

  return Promise.all(
    sizes.map(async (size) => {
      const blob = await compressImage(file, {
        maxWidth: size,
        maxHeight: size,
        quality: 1,
      });

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      return { size, dataUrl };
    })
  );
}

/**
 * Compress image with quality preset
 */
export function compressImageWithPreset(
  file: File,
  preset: keyof typeof QUALITY_PRESETS = 'standard',
  maxDimension?: number
): Promise<Blob> {
  const quality = QUALITY_PRESETS[preset];
  return compressImage(file, {
    maxWidth: maxDimension,
    maxHeight: maxDimension,
    quality,
  });
}

/**
 * Generate blur placeholder for lazy loading
 */
export async function generateBlurPlaceholder(file: File): Promise<string> {
  // Generate a tiny 10x10 version for blur placeholder
  const blob = await compressImage(file, {
    maxWidth: 10,
    maxHeight: 10,
    quality: 0.5,
  });

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Batch compress multiple images
 */
export async function batchCompressImages(
  files: File[],
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<Blob[]> {
  const results: Blob[] = [];

  for (let i = 0; i < files.length; i++) {
    const compressed = await compressImage(files[i], options);
    results.push(compressed);

    if (options.onProgress) {
      options.onProgress(i + 1, files.length);
    }
  }

  return results;
}

/**
 * Get optimal image dimensions based on container size
 */
export function getOptimalImageSize(
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio: number = 1
): { width: number; height: number } {
  // Account for device pixel ratio (retina displays)
  const targetWidth = Math.ceil(containerWidth * devicePixelRatio);
  const targetHeight = Math.ceil(containerHeight * devicePixelRatio);

  // Find the closest predefined size
  const sizes = Object.values(IMAGE_SIZES);
  const closest = sizes.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev.width - targetWidth);
    const currDiff = Math.abs(curr.width - targetWidth);
    return currDiff < prevDiff ? curr : prev;
  });

  return { width: closest.width, height: closest.height };
}

/**
 * Validate favicon dimensions (should be square)
 */
export function validateFavicon(file: File): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width !== img.height) {
        resolve({
          valid: false,
          error: 'Favicon must be square (equal width and height)',
        });
        return;
      }

      if (img.width < 16 || img.width > 512) {
        resolve({
          valid: false,
          error: 'Favicon dimensions must be between 16x16 and 512x512 pixels',
        });
        return;
      }

      resolve({ valid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Failed to load image',
      });
    };

    img.src = url;
  });
}
