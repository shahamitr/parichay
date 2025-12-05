// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/sms-service';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const templates = smsService.getAllTemplates();
    const templateDetails = templates.map((type) => {
      const template = smsService.getTemplate(type);
      return {
        type,
        preview: template?.template({
          amount: '100.00',
          invoiceNumber: 'INV-001',
          planName: 'Premium',
          daysUntilExpiry: 7,
          leadName: 'John Doe',
          branchName: 'Main Branch',
          leadContact: '+1234567890',
          message: 'Sample alert message',
          renewUrl: 'https://example.com/renew'
        }),
      };
    });

    return NextResponse.json({ templates: templateDetails });
  } catch (error) {
    console.error('Get SMS templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMS templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, template } = body;

    if (!type || !template) {
      return NextResponse.json(
        { error: 'Template type and template function are required' },
        { status: 400 }
      );
    }

    // Create template function from string
    const templateFn = new Function('params', `return \`${template}\`;`);
    smsService.addTemplate(type, templateFn);

    return NextResponse.json({
      message: 'SMS template added successfully',
      type,
    });
  } catch (error) {
    console.error('Add SMS template error:', error);
    return NextResponse.json(
      { error: 'Failed to add SMS template' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'Template type is required' },
        { status: 400 }
      );
    }

    const deleted = smsService.removeTemplate(type);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'SMS template deleted successfully',
      type,
    });
  } catch (error) {
    console.error('Delete SMS template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete SMS template' },
      { status: 500 }
    );
  }
}
