/**
 * Review Photo Upload API
 * POST /api/reviews/[id]/photo - Attach a photo to a review
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { isS3Configured, uploadToS3, generateS3Key } from '@/lib/s3-upload';
import { getUploadsBaseDir } from '@/lib/microsite-assets';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify review exists
    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, branchId: true, brandId: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, png, webp' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `review-${uuidv4()}.${ext}`;

    let photoUrl: string;

    // Use S3 in production, local filesystem in development
    if (isS3Configured()) {
      const key = generateS3Key('gallery', filename, review.branchId);
      const result = await uploadToS3(buffer, key, file.type);
      photoUrl = result.url;
    } else {
      // Local filesystem fallback
      const uploadDir = join(getUploadsBaseDir(), 'reviews');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);
      photoUrl = `/uploads/reviews/${filename}`;
    }

    // Update review with photo URL
    await prisma.review.update({
      where: { id },
      data: { photoUrl },
    });

    return NextResponse.json({
      success: true,
      photoUrl,
    });
  } catch (error) {
    console.error('Error uploading review photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
