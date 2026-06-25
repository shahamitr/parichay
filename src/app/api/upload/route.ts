import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import {
  AssetType,
  ASSET_CONFIGS,
  ensureMicrositeAssetDir,
  getMicrositeAssetUrl,
  validateAsset,
  getUploadsBaseDir,
} from '@/lib/microsite-assets';
import { isS3Configured, uploadToS3, generateS3Key } from '@/lib/s3-upload';

/**
 * File Upload API Route
 * Uses S3 when configured (production), falls back to local filesystem (development).
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as AssetType) || 'gallery';
    const branchId = formData.get('branchId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const config = ASSET_CONFIGS[type];
    if (!config) {
      return NextResponse.json(
        { error: `Invalid upload type: ${type}. Valid: ${Object.keys(ASSET_CONFIGS).join(', ')}` },
        { status: 400 }
      );
    }

    const validation = validateAsset(file, type);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;
    let filename: string;

    // Use S3 in production, local filesystem in development
    if (isS3Configured()) {
      const key = generateS3Key(type, file.name, branchId || undefined);
      const result = await uploadToS3(buffer, key, file.type);
      url = result.url;
      filename = key.split('/').pop() || key;
    } else {
      // Local filesystem fallback
      const ext = file.name.split('.').pop()?.toLowerCase();
      filename = `${uuidv4()}.${ext}`;

      let uploadDir: string;
      if (branchId) {
        uploadDir = await ensureMicrositeAssetDir(branchId, type);
        url = getMicrositeAssetUrl(branchId, type, filename);
      } else {
        uploadDir = join(getUploadsBaseDir(), type);
        await mkdir(uploadDir, { recursive: true });
        url = `/uploads/${type}/${filename}`;
      }

      await writeFile(join(uploadDir, filename), buffer);
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
      assetType: type,
      branchId: branchId || null,
      uploadedBy: user.id,
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
