import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'system-settings.json');

// Default settings
const defaultSettings = {
  siteName: 'OneTouch BizCard',
  siteUrl: 'http://localhost:3000',
  supportEmail: 'support@onetouchbizcard.in',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpFrom: 'noreply@onetouchbizcard.in',
  storageProvider: 'local',
  enableRegistration: true,
  enableCustomDomains: true,
  enableAnalytics: true,
  enableNotifications: true,
  maxBrandsPerUser: 10,
  maxBranchesPerBrand: 50,
  maxFileSize: 5,
  stripePublicKey: '',
  stripeSecretKey: '',
  enablePayments: false,
};

// GET /api/system/settings - Get system settings
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = defaultSettings;

    // Try to read settings from file
    if (fs.existsSync(SETTINGS_FILE)) {
      const fileContent = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      settings = { ...defaultSettings, ...JSON.parse(fileContent) };
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/system/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.siteName || !body.siteUrl || !body.supportEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save settings to file
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(body, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: body
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
