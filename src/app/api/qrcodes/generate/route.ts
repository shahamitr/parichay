// @ts-nocheck
/**
 * Public QR Code Generation API
 * POST /api/qrcodes/generate - Generate QR code without authentication (for public microsites)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateQRCode, validateQRCodeUrl } from '@/lib/qrcode-generator';
import { z } from 'zod';

const generateQRCodeSchema = z.object({
  url: z.string().url(),
  format: z.enum(['png', 'svg', 'dataurl']).default('dataurl'),
  size: z.number().min(128).max(2048).optional().default(512),
  brandColors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = generateQRCodeSchema.parse(body);
    const { url, format, size, brandColors } = validatedData;

    // Validate URL
    if (!validateQRCodeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodeResult = await generateQRCode({
      url,
      format,
      brandColors,
      size,
    });

    return NextResponse.json({
      qrCode: qrCodeResult.data,
      format: qrCodeResult.format,
      url: qrCodeResult.url,
    });
  } catch (error) {
    console.error('QR code generation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
