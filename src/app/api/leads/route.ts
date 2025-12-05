import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const where: any = {};

    // Branch or Brand filter (optional - if not provided, fetch all leads for admin)
    if (branchId) {
      where.branchId = branchId;
    } else if (brandId) {
      where.branch = {
        brandId: brandId,
      };
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Source filter
    if (source) {
      where.source = source;
    }

    // Search filter (name, email, phone)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          branch: {
            include: {
              brand: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branchId, brandId, name, email, phone, message, source, branchContact, ...otherFields } = body;

    // Validation
    if (!branchId) {
      return NextResponse.json(
        { error: 'Branch ID is required' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { brand: true },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Create lead record
    const lead = await prisma.lead.create({
      data: {
        branchId,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        message: message?.trim() || null,
        source: source || 'microsite_form',
        metadata: {
          ...otherFields,
          submittedAt: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || undefined,
        },
      },
    });

    // Route lead to branch contact channels
    try {
      await routeLeadToContacts(lead, branch, branchContact);
    } catch (notificationError) {
      console.error('Error routing lead notification:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Your inquiry has been submitted successfully. We will contact you soon.',
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function routeLeadToContacts(lead: any, branch: any, branchContact?: any) {
  const contact = branchContact || (branch.contact as any);
  const brandName = branch.brand.name;
  const branchName = branch.name;

  // Get notification preferences
  const micrositeConfig = branch.micrositeConfig as any;
  const notificationPreferences = micrositeConfig?.notificationPreferences || {
    email: true,
    whatsapp: false,
    inApp: true,
  };

  // Prepare lead information for routing
  const leadInfo = {
    leadId: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    source: lead.source,
    submittedAt: new Date(lead.createdAt).toLocaleString(),
  };

  // Route to Email (if enabled)
  if (contact?.email && notificationPreferences.email) {
    try {
      await sendEmailNotification(contact.email, leadInfo, brandName, branchName);
    } catch (error) {
      console.error('Email notification failed:', error);
    }
  }

  // Route to WhatsApp with formatted message (if enabled)
  if (contact?.whatsapp && notificationPreferences.whatsapp) {
    try {
      await sendWhatsAppNotification(contact.whatsapp, leadInfo, brandName, branchName);
    } catch (error) {
      console.error('WhatsApp notification failed:', error);
    }
  }

  // Create in-app notification for branch admins (if enabled)
  if (notificationPreferences.inApp) {
    try {
      await createInAppNotification(branch.id, leadInfo, brandName, branchName);
    } catch (error) {
      console.error('In-app notification failed:', error);
    }
  }

  console.log('Lead routed successfully:', {
    leadId: lead.id,
    branchName,
    brandName,
    routedTo: {
      email: contact?.email && notificationPreferences.email ? contact.email : 'Disabled',
      whatsapp: contact?.whatsapp && notificationPreferences.whatsapp ? contact.whatsapp : 'Disabled',
      inApp: notificationPreferences.inApp ? 'Enabled' : 'Disabled',
    },
  });
}

async function sendWhatsAppNotification(
  whatsappNumber: string,
  leadInfo: any,
  brandName: string,
  branchName: string
) {
  // Format WhatsApp message
  const message = `
🎯 *New Lead Received!*

*Branch:* ${branchName}
*Brand:* ${brandName}
*Source:* ${leadInfo.source}
*Time:* ${leadInfo.submittedAt}

*Lead Details:*
👤 *Name:* ${leadInfo.name}
📧 *Email:* ${leadInfo.email || 'Not provided'}
📱 *Phone:* ${leadInfo.phone || 'Not provided'}
${leadInfo.message ? `💬 *Message:* ${leadInfo.message}` : ''}

⚡ Please follow up with this lead as soon as possible!

_Lead ID: ${leadInfo.leadId}_
  `.trim();

  // Log WhatsApp message (In production, integrate with WhatsApp Business API)
  console.log('WhatsApp notification:', {
    to: whatsappNumber,
    message,
  });

  // TODO: Integrate with WhatsApp Business API
  // Example integration:
  // const whatsappApiUrl = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  // await fetch(whatsappApiUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     messaging_product: 'whatsapp',
  //     to: whatsappNumber,
  //     type: 'text',
  //     text: { body: message },
  //   }),
  // });
}

async function createInAppNotification(
  branchId: string,
  leadInfo: any,
  brandName: string,
  branchName: string
) {
  // Find all branch admins
  const branchAdmins = await prisma.user.findMany({
    where: {
      branches: {
        some: {
          id: branchId,
        },
      },
      isActive: true,
    },
  });

  // Create notification for each admin
  const notifications = branchAdmins.map((admin) =>
    prisma.notification.create({
      data: {
        userId: admin.id,
        type: 'NEW_LEAD',
        title: `New Lead from ${branchName}`,
        message: `${leadInfo.name} submitted an inquiry via ${leadInfo.source}`,
        metadata: {
          leadId: leadInfo.leadId,
          branchId,
          brandName,
          branchName,
          leadName: leadInfo.name,
          leadEmail: leadInfo.email,
          leadPhone: leadInfo.phone,
          source: leadInfo.source,
        },
      },
    })
  );

  await Promise.all(notifications);
}

async function sendEmailNotification(
  toEmail: string,
  leadInfo: any,
  brandName: string,
  branchName: string
) {
  const { emailService } = await import('@/lib/email-service');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .lead-details { background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .source-badge { display: inline-block; padding: 4px 12px; background-color: #10B981; color: white; border-radius: 12px; font-size: 12px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Lead Received!</h1>
          </div>
          <div class="content">
            <p><strong>Branch:</strong> ${branchName}</p>
            <p><strong>Brand:</strong> ${brandName}</p>
            <p><strong>Submitted:</strong> ${leadInfo.submittedAt}</p>
            <p><strong>Source:</strong> <span class="source-badge">${leadInfo.source}</span></p>

            <div class="lead-details">
              <h3>Lead Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span> ${leadInfo.name}
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span> ${leadInfo.email || 'Not provided'}
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span> ${leadInfo.phone || 'Not provided'}
              </div>
              ${leadInfo.message ? `
              <div class="detail-row">
                <span class="detail-label">Message:</span><br/>
                ${leadInfo.message}
              </div>
              ` : ''}
            </div>

            <p style="margin-top: 20px; padding: 15px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
              ⚡ <strong>Action Required:</strong> Please follow up with this lead as soon as possible to maximize conversion.
            </p>

            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Lead ID: ${leadInfo.leadId}
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} OneTouch BizCard. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await emailService.sendEmail({
      to: toEmail,
      subject: `🎯 New Lead from ${brandName} - ${branchName}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send lead email notification:', error);
    throw error;
  }
}