import { NextRequest, NextResponse } from 'next/server';

// Mock QR codes data
const mockQRCodes = [
  {
    id: '1',
    name: 'Main Branch QR',
    url: 'https://onetouchbizcard.in/branch/main',
    type: 'microsite',
    scans: 1245,
    createdAt: '2024-01-15T10:00:00Z',
    lastScanned: '2024-01-18T14:30:00Z',
    isActive: true,
    branch: {
      name: 'Main Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    },
    analytics: {
      totalScans: 1245,
      uniqueScans: 892,
      devices: {
        mobile: 850,
        desktop: 295,
        tablet: 100
      },
      locations: [
        { country: 'India', scans: 800 },
        { country: 'USA', scans: 245 },
        { country: 'UK', scans: 200 }
      ]
    }
  },
  {
    id: '2',
    name: 'Contact vCard',
    url: 'https://onetouchbizcard.in/vcard/john-doe',
    type: 'vcard',
    scans: 892,
    createdAt: '2024-01-10T09:00:00Z',
    lastScanned: '2024-01-17T16:45:00Z',
    isActive: true,
    branch: {
      name: 'Downtown Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    },
    analytics: {
      totalScans: 892,
      uniqueScans: 654,
      devices: {
        mobile: 650,
        desktop: 142,
        tablet: 100
      },
      locations: [
        { country: 'India', scans: 600 },
        { country: 'Canada', scans: 192 },
        { country: 'Australia', scans: 100 }
      ]
    }
  },
  {
    id: '3',
    name: 'WiFi Access',
    url: 'WIFI:T:WPA;S:OfficeWiFi;P:password123;H:false;;',
    type: 'wifi',
    scans: 456,
    createdAt: '2024-01-05T11:30:00Z',
    lastScanned: '2024-01-16T12:15:00Z',
    isActive: true,
    branch: {
      name: 'Office Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    },
    analytics: {
      totalScans: 456,
      uniqueScans: 234,
      devices: {
        mobile: 400,
        desktop: 36,
        tablet: 20
      },
      locations: [
        { country: 'India', scans: 456 }
      ]
    }
  },
  {
    id: '4',
    name: 'Custom Landing Page',
    url: 'https://example.com/landing',
    type: 'custom',
    scans: 234,
    createdAt: '2024-01-12T15:20:00Z',
    lastScanned: '2024-01-15T10:30:00Z',
    isActive: false,
    branch: {
      name: 'Marketing Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    },
    analytics: {
      totalScans: 234,
      uniqueScans: 189,
      devices: {
        mobile: 180,
        desktop: 44,
        tablet: 10
      },
      locations: [
        { country: 'USA', scans: 134 },
        { country: 'India', scans: 100 }
      ]
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from database
    // const qrCodes = await db.qrCode.findMany({
    //   include: {
    //     branch: {
    //       include: {
    //         brand: true
    //       }
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      qrCodes: mockQRCodes
    });
  } catch (error) {
    console.error('Failed to fetch QR codes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, type, branchId } = body;

    // In a real app, you would create in database
    // const qrCode = await db.qrCode.create({
    //   data: {
    //     name,
    //     url,
    //     type,
    //     branchId,
    //     isActive: true
    //   }
    // });

    const newQRCode = {
      id: Date.now().toString(),
      name,
      url,
      type,
      scans: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      branch: {
        name: 'New Branch',
        brand: {
          name: 'OneTouchBizCard'
        }
      },
      analytics: {
        totalScans: 0,
        uniqueScans: 0,
        devices: {
          mobile: 0,
          desktop: 0,
          tablet: 0
        },
        locations: []
      }
    };

    return NextResponse.json({
      success: true,
      qrCode: newQRCode
    });
  } catch (error) {
    console.error('Failed to create QR code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create QR code' },
      { status: 500 }
    );
  }
}