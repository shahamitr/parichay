/**
 * Unified Storage Service
 * Uses S3-compatible storage when configured, falls back to local filesystem.
 * Works with AWS S3, MinIO, DigitalOcean Spaces, or any S3-compatible service.
 */

import { join } from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

// =============================================================================
// Types
// =============================================================================
export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  contentType: string;
}

interface StorageConfig {
  provider: 'local' | 's3';
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string; // For MinIO or other S3-compatible services
    cdnDomain?: string; // CloudFront or custom CDN domain
  };
}

// =============================================================================
// Configuration
// =============================================================================
function getStorageConfig(): StorageConfig {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (bucket && region && accessKeyId && secretAccessKey) {
    return {
      provider: 's3',
      s3: {
        bucket,
        region,
        accessKeyId,
        secretAccessKey,
        endpoint: process.env.S3_ENDPOINT || undefined, // For MinIO
        cdnDomain: process.env.CLOUDFRONT_DOMAIN || undefined,
      },
    };
  }

  return { provider: 'local' };
}

// =============================================================================
// S3 Upload (using native fetch — no AWS SDK needed)
// =============================================================================
async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
  config: NonNullable<StorageConfig['s3']>
): Promise<string> {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    ...(config.endpoint ? { endpoint: config.endpoint, forcePathStyle: true } : {}),
  });

  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  // Return CDN URL if configured, otherwise S3 URL
  if (config.cdnDomain) {
    return `https://${config.cdnDomain}/${key}`;
  }

  if (config.endpoint) {
    return `${config.endpoint}/${config.bucket}/${key}`;
  }

  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

// =============================================================================
// Local Upload
// =============================================================================
async function uploadToLocal(
  buffer: Buffer,
  key: string,
): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const filePath = join(uploadDir, key);
  const dir = join(filePath, '..');

  await mkdir(dir, { recursive: true });
  await writeFile(filePath, buffer);

  return `/uploads/${key}`;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Upload a file to storage.
 * Automatically uses S3 when configured, local filesystem otherwise.
 */
export async function uploadFile(
  file: File | Buffer,
  options: {
    type: string; // e.g. 'gallery', 'logo', 'document'
    branchId?: string;
    originalFilename?: string;
  }
): Promise<UploadResult> {
  const config = getStorageConfig();

  // Get buffer and metadata
  const buffer = file instanceof File
    ? Buffer.from(await file.arrayBuffer())
    : file;

  const ext = options.originalFilename?.split('.').pop()?.toLowerCase() || 'bin';
  const contentType = getContentType(ext);
  const filename = `${uuidv4()}.${ext}`;

  // Build storage key
  const key = options.branchId
    ? `microsites/${options.branchId}/${options.type}/${filename}`
    : `${options.type}/${filename}`;

  let url: string;

  if (config.provider === 's3' && config.s3) {
    try {
      url = await uploadToS3(buffer, key, contentType, config.s3);
      logger.info({ key, provider: 's3' }, 'File uploaded to S3');
    } catch (error) {
      logger.error({ error, key }, 'S3 upload failed, falling back to local');
      url = await uploadToLocal(buffer, key);
    }
  } else {
    url = await uploadToLocal(buffer, key);
  }

  return {
    url,
    key,
    filename,
    size: buffer.length,
    contentType,
  };
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(key: string): Promise<void> {
  const config = getStorageConfig();

  if (config.provider === 's3' && config.s3) {
    try {
      const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const client = new S3Client({
        region: config.s3.region,
        credentials: {
          accessKeyId: config.s3.accessKeyId,
          secretAccessKey: config.s3.secretAccessKey,
        },
        ...(config.s3.endpoint ? { endpoint: config.s3.endpoint, forcePathStyle: true } : {}),
      });

      await client.send(new DeleteObjectCommand({
        Bucket: config.s3.bucket,
        Key: key,
      }));
    } catch (error) {
      logger.error({ error, key }, 'S3 delete failed');
    }
  } else {
    try {
      const filePath = join(process.cwd(), 'public', 'uploads', key);
      await unlink(filePath);
    } catch {
      // File may not exist
    }
  }
}

// =============================================================================
// Helpers
// =============================================================================
function getContentType(ext: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ico: 'image/x-icon',
  };
  return map[ext] || 'application/octet-stream';
}
