/**
 * QR Code Scan Tracking API
 * POST /api/qrcodes/[id]/scan - Track QR code scan
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Get location data from IP address
 * In production, you would use a service like ipapi.co or ip-api.com
 */
async function getLocationFromIP(ipAddress: string): Promise<{
  country?: string;
  city?: string;
} | null> {
  try {
    // Skip for localhost/private IPs
    if (
      ipAddress === '127.0.0.1' ||
      ipAddress === '::1' ||
      ipAddress.startsWith('192.168.') ||
      ipAddress.startsWith('10.') ||
      ipAddress.startsWith('172.')
    ) {
      return null;
    }

    // Use a free IP geolocation service
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        'User-Agent': 'OneTouch-BizCard/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city,
    };
  } catch (error) {
    console.error('IP geolocation error:', error);
    return null;
  }
}

/**
 * Extract IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default
  return '127.0.0.1';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the QR code
    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = getClientIP(request);

    // Get location data (async, don't block the response)
    const locationPromise = getLocationFromIP(ipAddress);

    // Increment scan count
    const updatedQRCode = await prisma.qRCode.update({
      where: { id },
      data: {
        scanCount: {
          increment: 1,
        },
      },
    });

    // Wait for location data
    const location = await locationPromise;

    // Create analytics event for the scan
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'QR_SCAN',
        branchId: qrCode.branchId,
        brandId: qrCode.brandId,
        userAgent,
        ipAddress,
        location: location || undefined,
        metadata: {
          qrCodeId: qrCode.id,
          url: qrCode.url,
        },
      },
    });

    return NextResponse.json({
      success: true,
      scanCount: updatedQRCode.scanCount,
      redirectUrl: qrCode.url,
    });
  } catch (error) {
    console.error('QR code scan tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track scan' },
      { status: 500 }
    );
  }
}
