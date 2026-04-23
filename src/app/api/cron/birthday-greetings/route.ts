import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * POST /api/cron/birthday-greetings
 * Send birthday greetings to leads with birthdays today
 *
 * Should be called by a cron job daily at 8 AM
 * Vercel Cron: "0 8 * * *"
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();

    logger.info({ month: currentMonth, day: currentDay, year: currentYear }, 'Birthday Cron running');

    // Find all leads with birthdays today
    const birthdayLeads = await prisma.lead.findMany({
      where: {
        birthdayMonth: currentMonth,
        birthdayDay: currentDay,
        email: { not: null },
        // Exclude leads that already received greeting this year
        NOT: {
          birthdayLogs: {
            some: {
              year: currentYear,
            },
          },
        },
      },
      include: {
        branch: {
          include: {
            brand: true,
            birthdayTemplate: true,
          },
        },
      },
    });

    logger.info({ count: birthdayLeads.length }, 'Birthday leads found');

    if (birthdayLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No birthdays today',
        processed: 0,
      });
    }

    const transporter = createTransporter();
    const results: { leadId: string; status: string; error?: string }[] = [];

    for (const lead of birthdayLeads) {
      const template = lead.branch.birthdayTemplate;

      // Skip if template not active
      if (!template?.isActive) {
        results.push({
          leadId: lead.id,
          status: 'skipped',
          error: 'Template not active',
        });
        continue;
      }

      // Skip if no email and sending via email
      if ((template.sendVia === 'email' || template.sendVia === 'both') && !lead.email) {
        results.push({
          leadId: lead.id,
          status: 'skipped',
          error: 'No email address',
        });
        continue;
      }

      try {
        // Prepare email content
        const businessName = lead.branch.brand.name;
        const discountCode = template.discountCode || '';
        const discountText = template.discountPercent
          ? `${template.discountPercent}% off with code: ${discountCode}`
          : discountCode;

        // Replace placeholders in message
        let message = template.message
          .replace(/\{\{name\}\}/g, lead.name)
          .replace(/\{\{businessName\}\}/g, businessName)
          .replace(/\{\{discount\}\}/g, discountText)
          .replace(/\{\{discountCode\}\}/g, discountCode)
          .replace(/\{\{discountPercent\}\}/g, template.discountPercent?.toString() || '');

        let subject = template.subject
          .replace(/\{\{name\}\}/g, lead.name)
          .replace(/\{\{businessName\}\}/g, businessName);

        // Send email
        if (template.sendVia === 'email' || template.sendVia === 'both') {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"${businessName}" <noreply@parichay.app>`,
            to: lead.email!,
            subject: subject,
            text: message,
            html: formatEmailHtml(lead.name, message, businessName, template.discountCode, template.discountPercent),
          });
        }

        // Log the sent greeting
        await prisma.birthdayLog.create({
          data: {
            leadId: lead.id,
            branchId: lead.branchId,
            year: currentYear,
            channel: template.sendVia,
            status: 'sent',
            metadata: {
              discountCode: template.discountCode,
              discountPercent: template.discountPercent,
            },
          },
        });

        // Create analytics event
        await prisma.analyticsEvent.create({
          data: {
            branchId: lead.branchId,
            brandId: lead.branch.brandId,
            eventType: 'BIRTHDAY_EMAIL_SENT',
            metadata: {
              leadId: lead.id,
              leadName: lead.name,
              channel: template.sendVia,
            },
          },
        });

        results.push({
          leadId: lead.id,
          status: 'sent',
        });

        logger.debug({ name: lead.name, email: lead.email }, 'Greeting sent');
      } catch (error: any) {

        logger.error({ error: error.message, leadId: lead.id }, 'Error sending birthday greeting');

        // Log failed attempt
        await prisma.birthdayLog.create({
          data: {
            leadId: lead.id,
            branchId: lead.branchId,
            year: currentYear,
            channel: template.sendVia,
            status: 'failed',
            metadata: {
              error: error.message,
            },
          },
        });

        results.push({
          leadId: lead.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    logger.info({ sent, failed, skipped }, 'Birthday Cron complete');

    return NextResponse.json({
      success: true,
      message: `Processed ${birthdayLeads.length} birthdays`,
      stats: {
        total: birthdayLeads.length,
        sent,
        failed,
        skipped,
      },
      results,
    });
  } catch (error) {
    logger.error({ error }, 'Birthday Cron critical error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}

function formatEmailHtml(
  name: string,
  message: string,
  businessName: string,
  discountCode?: string | null,
  discountPercent?: number | null
): string {
  const formattedMessage = message.replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 12px; margin-top: 20px; margin-bottom: 20px;">
    <!-- Birthday Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 64px; margin-bottom: 10px;">🎂</div>
      <h1 style="color: #1f2937; font-size: 28px; margin: 0;">Happy Birthday, ${name}!</h1>
    </div>

    <!-- Message -->
    <div style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      ${formattedMessage}
    </div>

    ${discountCode ? `
    <!-- Discount Code Box -->
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
      <p style="color: white; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Birthday Discount</p>
      <div style="background-color: white; border-radius: 8px; padding: 16px; display: inline-block;">
        <span style="font-size: 24px; font-weight: bold; color: #d97706; letter-spacing: 2px;">${discountCode}</span>
      </div>
      ${discountPercent ? `<p style="color: white; margin: 12px 0 0 0; font-size: 18px; font-weight: bold;">${discountPercent}% OFF</p>` : ''}
    </div>
    ` : ''}

    <!-- Footer -->
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 14px; margin: 0;">
        With warm wishes,<br>
        <strong style="color: #4b5563;">${businessName}</strong>
      </p>
    </div>
  </div>

  <!-- Email Footer -->
  <div style="text-align: center; padding: 20px;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      Sent with ❤️ via Parichay
    </p>
  </div>
</body>
</html>
  `.trim();
}
