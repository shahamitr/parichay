import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        micrositeConfig: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const config = (branch.micrositeConfig as any) || { sections: {} };
    const messagingConfig = config.sections?.messaging || {
      whatsapp: { enabled: false, number: '', message: '' },
      email: { enabled: false, address: '', subject: '' },
      phone: { enabled: false, number: '', displayText: '' },
      livechat: { enabled: false, welcomeMessage: '', offlineMessage: '', position: 'bottom-right' },
      businessHours: { enabled: false, timezone: 'Asia/Kolkata', schedule: {} },
      autoResponses: { enabled: false, responses: [] }
    };

    return NextResponse.json({
      success: true,
      messaging: messagingConfig,
    });

  } catch (error) {
    console.error('Error fetching messaging config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messaging configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const { messaging } = await request.json();

    // Get current config
    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
      select: { micrositeConfig: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const currentConfig = (branch.micrositeConfig as any) || { sections: {} };

    // Update messaging section
    const updatedConfig = {
      ...currentConfig,
      sections: {
        ...currentConfig.sections,
        messaging,
      },
    };

    // Save to database
    await prisma.branch.update({
      where: { id: params.id },
      data: { micrositeConfig: updatedConfig },
    });

    return NextResponse.json({
      success: true,
      messaging,
    });

  } catch (error) {
    console.error('Error updating messaging config:', error);
    return NextResponse.json(
      { error: 'Failed to update messaging configuration' },
      { status: 500 }
    );
  }
}