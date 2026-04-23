/**
 * Microsite Asset Management (Server-Only)
 *
 * This module contains server-side file system operations.
 * For client-safe types and functions, use @/lib/microsite-assets-types
 */
import { join } from 'path';
import { mkdir, readdir, stat, rm, rename } from 'fs/promises';
import { existsSync } from 'fs';

// Re-export types and client-safe functions from the types module
export {
  type AssetType,
  type AssetConfig,
  ASSET_CONFIGS,
  getMicrositeAssetUrl,
  parseMicrositeAssetUrl,
  validateAsset,
  formatBytes,
} from './microsite-assets-types';

import type { AssetType } from './microsite-assets-types';
import { ASSET_CONFIGS, getMicrositeAssetUrl } from './microsite-assets-types';

/**
 * Get the base uploads directory
 */
export function getUploadsBaseDir(): string {
  return join(process.cwd(), 'public', 'uploads');
}

/**
 * Get the directory path for a microsite's assets
 */
export function getMicrositeDir(branchId: string): string {
  return join(getUploadsBaseDir(), 'microsites', branchId);
}

/**
 * Get the directory path for a specific asset type within a microsite
 */
export function getMicrositeAssetDir(branchId: string, assetType: AssetType): string {
  return join(getMicrositeDir(branchId), assetType);
}

/**
 * Ensure the directory exists for a microsite asset type
 */
export async function ensureMicrositeAssetDir(branchId: string, assetType: AssetType): Promise<string> {
  const dir = getMicrositeAssetDir(branchId, assetType);
  await mkdir(dir, { recursive: true });
  return dir;
}

/**
 * Get the full file path for a microsite asset
 */
export function getMicrositeAssetPath(branchId: string, assetType: AssetType, filename: string): string {
  return join(getMicrositeAssetDir(branchId, assetType), filename);
}

/**
 * List all assets for a microsite
 */
export async function listMicrositeAssets(branchId: string): Promise<{
  [key in AssetType]?: string[];
}> {
  const micrositeDir = getMicrositeDir(branchId);
  const result: { [key in AssetType]?: string[] } = {};

  if (!existsSync(micrositeDir)) {
    return result;
  }

  try {
    const assetTypes = await readdir(micrositeDir);

    for (const assetType of assetTypes) {
      const assetDir = join(micrositeDir, assetType);
      const stats = await stat(assetDir);

      if (stats.isDirectory() && assetType in ASSET_CONFIGS) {
        const files = await readdir(assetDir);
        result[assetType as AssetType] = files.map((f) =>
          getMicrositeAssetUrl(branchId, assetType as AssetType, f)
        );
      }
    }
  } catch (error) {
    console.error('Error listing microsite assets:', error);
  }

  return result;
}

/**
 * Get storage usage for a microsite (in bytes)
 */
export async function getMicrositeStorageUsage(branchId: string): Promise<{
  total: number;
  byType: { [key in AssetType]?: number };
}> {
  const micrositeDir = getMicrositeDir(branchId);
  const byType: { [key in AssetType]?: number } = {};
  let total = 0;

  if (!existsSync(micrositeDir)) {
    return { total: 0, byType };
  }

  try {
    const assetTypes = await readdir(micrositeDir);

    for (const assetType of assetTypes) {
      const assetDir = join(micrositeDir, assetType);
      const dirStats = await stat(assetDir);

      if (dirStats.isDirectory() && assetType in ASSET_CONFIGS) {
        const files = await readdir(assetDir);
        let typeTotal = 0;

        for (const file of files) {
          const filePath = join(assetDir, file);
          const fileStats = await stat(filePath);
          typeTotal += fileStats.size;
        }

        byType[assetType as AssetType] = typeTotal;
        total += typeTotal;
      }
    }
  } catch (error) {
    console.error('Error calculating storage usage:', error);
  }

  return { total, byType };
}

/**
 * Delete a specific asset
 */
export async function deleteMicrositeAsset(
  branchId: string,
  assetType: AssetType,
  filename: string
): Promise<boolean> {
  try {
    const filePath = getMicrositeAssetPath(branchId, assetType, filename);
    if (existsSync(filePath)) {
      await rm(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  }
}

/**
 * Delete all assets for a microsite (use with caution)
 */
export async function deleteAllMicrositeAssets(branchId: string): Promise<boolean> {
  try {
    const micrositeDir = getMicrositeDir(branchId);
    if (existsSync(micrositeDir)) {
      await rm(micrositeDir, { recursive: true, force: true });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting all microsite assets:', error);
    return false;
  }
}

/**
 * Move assets from old structure to new microsite structure
 * Useful for migration
 */
export async function migrateAssetToMicrosite(
  oldUrl: string,
  branchId: string,
  assetType: AssetType
): Promise<string | null> {
  try {
    // Parse old URL (e.g., /uploads/gallery/uuid.jpg)
    const match = oldUrl.match(/\/uploads\/([^/]+)\/([^/]+)$/);
    if (!match) return null;

    const [, , filename] = match;
    const oldPath = join(getUploadsBaseDir(), match[1], filename);

    if (!existsSync(oldPath)) {
      return null;
    }

    // Create new directory
    const newDir = await ensureMicrositeAssetDir(branchId, assetType);
    const newPath = join(newDir, filename);

    // Move file
    await rename(oldPath, newPath);

    return getMicrositeAssetUrl(branchId, assetType, filename);
  } catch (error) {
    console.error('Error migrating asset:', error);
    return null;
  }
}
