import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, size = 200, format = 'png' } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required for QR code generation' },
        { status: 400 }
      );
    }

    // In a real app, you would use a QR code library like 'qrcode'
    // const QRCode = require('qrcode');
    // const qrCodeDataURL = await QRCode.toDataURL(text, {
    //   width: size,
    //   margin: 2,
    //   color: {
    //     dark: '#000000',
    //     light: '#FFFFFF'
    //   }
    // });

    // For demo, create a simple SVG QR code placeholder
    const qrCodeSVG = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        <rect x="20" y="20" width="${size - 40}" height="${size - 40}" fill="black"/>
        <rect x="40" y="40" width="${size - 80}" height="${size - 80}" fill="white"/>
        <text x="${size / 2}" y="${size / 2}" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code</text>
        <text x="${size / 2}" y="${size / 2 + 15}" text-anchor="middle" font-family="Arial" font-size="8" fill="black">${text.substring(0, 20)}...</text>
      </svg>
    `;

    // Convert to base64 for demo
    const qrCodeDataURL = `data:image/svg+xml;base64,${Buffer.from(qrCodeSVG).toString('base64')}`;

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      text,
      size,
      format
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}