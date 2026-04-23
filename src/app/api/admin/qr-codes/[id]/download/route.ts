import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In a real app, you would:
    // 1. Fetch QR code data from database
    // 2. Generate QR code image using a library like 'qrcode'
    // 3. Return the image as a blob

    // For demo purposes, we'll create a simple SVG QR code placeholder
    const qrCodeSVG = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code ${id}</text>
        <rect x="60" y="60" width="80" height="80" fill="black"/>
        <rect x="70" y="70" width="60" height="60" fill="white"/>
        <rect x="80" y="80" width="40" height="40" fill="black"/>
      </svg>
    `;

    // Convert SVG to PNG (in a real app, use a proper QR code library)
    const response = new NextResponse(qrCodeSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="qr-code-${id}.svg"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}