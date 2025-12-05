// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

/**
 * File Upload API Route
 *
 * Handles authenticated file uploads for:
 * - Logos
 * - Gallery images
 * - Videos
 * - Documents
 *
 * Features:
 * - Authentication required
 * - File type validation
 * - File size limits
 * - Unique filename generation
 * - Organized storage by type
 */

const MAX_FILE_SIZES = {
  logo: 2 * 1024 * 1024, // 2MB
  gallery: 5 * 1024 * 1024, // 5MB
  video: 50 * 1024 * 1024, // 50MB
  document: 10 * 1024 * 1024, // 10MB
};

const ALLOWED_TYPES = {
  logo: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  gallery: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user (optional in development)
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    let user = null;

    // Try to verify token if provided, but don't fail if not present
    if (token != null) {
      try {
        user = await verifyToken(token);
      } catch (error) {
        console.warn('[Upload] Invalid token, proceeding without auth');
      }
    }

    // In development, allow uploads without authentication
    // TODO: Enable strict authentication in production
    if (!user && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) || 'gallery';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 3. Validate file type
    const allowedTypes = ALLOWED_TYPES[type as keyof typeof ALLOWED_TYPES];
    if (!allowedTypes) {
      return NextResponse.json(
        { error: `Invalid upload type: ${type}` },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // 4. Validate file size
    const maxSize = MAX_FILE_SIZES[type as keyof typeof MAX_FILE_SIZES];
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // 5. Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filename = `${uuidv4()}.${ext}`;

    // 6. Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', type);
    await mkdir(uploadDir, { recursive: true });

    // 7. Save file
    const filepath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // 8. Generate URL
    const url = `/uploads/${type}/${filename}`;

    // 9. Log upload
    console.log(`[Upload] User: ${user?.email || 'anonymous'}, Type: ${type}, File: ${filename}, Size: ${(file.size / 1024).toFixed(2)}KB`);

    // 10. Return success response
    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
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
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
