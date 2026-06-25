/**
 * S3 Upload Service
 * Uses AWS SDK v3 — falls back to local filesystem if S3 is not configured.
 * AWS Free Tier: 5GB storage, 20,000 GET, 2,000 PUT requests/month.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

// =============================================================================
// Configuration
// =============================================================================
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.AWS_REGION || 'ap-south-1';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

let s3Client: S3Client | null = null;

function getS3Client(): S3Client | null {
  if (!S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null;
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  return s3Client;
}

/**
 * Check if S3 is configured and available.
 */
export function isS3Configured(): boolean {
  return !!(S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

/**
 * Upload a file buffer to S3.
 * Returns the public URL (CloudFront if configured, otherwise S3 direct).
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const client = getS3Client();

  if (!client || !S3_BUCKET) {
    throw new Error('S3 is not configured');
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await client.send(command);

  // Return CloudFront URL if available, otherwise S3 direct URL
  const url = CLOUDFRONT_DOMAIN
    ? `https://${CLOUDFRONT_DOMAIN}/${key}`
    : `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

  return { url, key };
}

/**
 * Delete a file from S3.
 */
export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();

  if (!client || !S3_BUCKET) {
    throw new Error('S3 is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  await client.send(command);
}

/**
 * Generate a unique S3 key for an upload.
 */
export function generateS3Key(
  type: string,
  originalFilename: string,
  branchId?: string
): string {
  const ext = originalFilename.split('.').pop()?.toLowerCase() || 'bin';
  const uuid = uuidv4();

  if (branchId) {
    return `uploads/microsites/${branchId}/${type}/${uuid}.${ext}`;
  }

  return `uploads/${type}/${uuid}.${ext}`;
}
