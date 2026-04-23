import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import {
  AssetType,
  ASSET_CONFIGS,
  ensureMicrositeAssetDir,
  getMicrositeAssetUrl,
  validateAsset,
  getUploadsBaseDir,
} from '@/lib/microsite-assets';
import { mkdir } from 'fs/promises';

/**
 * File Upload API Route
 *
 * Handles authenticated file uploads with microsite-based organization.
 *
 * Files are stored in:
 * - With branchId: /uploads/microsites/{branchId}/{type}/{filename}
 * - Without branchId (legacy/shared): /uploads/{type}/{filename}
 *
 * Asset Types:
 * - logo: Brand/branch logos (2MB, images)
 * - gallery: Photo gallery images (5MB, images)
 * - video: Video content (100MB, videos)
 * - voice: Voice intros and audio (10MB, audio)
 * - document: PDFs, documents (10MB, docs)
 * - hero: Hero backgrounds (5MB, images)
 * - testimonials: Testimonial images (2MB, images)
 * - team: Team member photos (2MB, images)
 * - portfolio: Portfolio images (5MB, images)
 * - favicon: Favicon icons (500KB, ico/png)
 * - og-image: Open Graph images (2MB, images)
 *
 * Features:
 * - Authentication REQUIRED
 * - Microsite-based folder organization
 * - File type validation
 * - File size limits
 * - Unique filename generation
 */

export async function POST(request: NextRequest) {
  try {
    // 1. REQUIRE Authentication - no anonymous uploads allowed
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get file and metadata from form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as AssetType) || 'gallery';
    const branchId = formData.get('branchId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 3. Validate asset type exists
    const config = ASSET_CONFIGS[type];
    if (!config) {
      const validTypes = Object.keys(ASSET_CONFIGS).join(', ');
      return NextResponse.json(
        { error: `Invalid upload type: ${type}. Valid types: ${validTypes}` },
        { status: 400 }
      );
    }

    // 4. Validate file using microsite-assets helper
    const validation = validateAsset(file, type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 5. Generate secure unique filename (UUID prevents path traversal)
    const originalExt = file.name.split('.').pop()?.toLowerCase();
    const filename = `${uuidv4()}.${originalExt}`;

    // 6. Determine upload path based on branchId
    let uploadDir: string;
    let url: string;

    if (branchId) {
      // Microsite-based storage (new structure)
      uploadDir = await ensureMicrositeAssetDir(branchId, type);
      url = getMicrositeAssetUrl(branchId, type, filename);
    } else {
      // Legacy/shared storage (for backwards compatibility)
      uploadDir = join(getUploadsBaseDir(), type);
      await mkdir(uploadDir, { recursive: true });
      url = `/uploads/${type}/${filename}`;
    }

    // 7. Save file
    const filepath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // 8. Return success response
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

// Handle OPTIONS for CORS
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
