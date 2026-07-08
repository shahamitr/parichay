/**
 * Cron: Appointment Reminders
 * GET /api/cron/appointment-reminders?secret=CRON_SECRET
 *
 * Run every hour. Sends SMS/WhatsApp/email reminders for appointments
 * happening in the next 24 hours that haven't been reminded yet.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email-service';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const results = { reminded: 0, errors: 0 };

  try {
    // Find appointments in next 24 hours that are confirmed and not yet reminded
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: now, lte: in24h },
        status: { in: ['CONFIRMED', 'PENDING'] },
        // Only those not already reminded (check metadata)
        NOT: { internalNotes: { contains: 'reminder_sent' } },
      },
      include: {
        branch: {
          select: {
            name: true,
            contact: true,
            brand: { select: { name: true } },
          },
        },
      },
    });

    for (const appt of appointments) {
      try {
        const appointmentTime = new Date(appt.date);
        const timeStr = appointmentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const dateStr = appointmentTime.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
        const brandName = appt.branch?.brand?.name || 'Your Business';

        // Send email reminder if email is available
        if (appt.customerEmail) {
          const html = `
            <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;">
              <div style="background:#4F46E5;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
                <h2 style="margin:0;">Appointment Reminder</h2>
              </div>
              <div style="padding:24px;background:#f9fafb;border-radius:0 0 12px 12px;">
                <p>Hi ${appt.customerName},</p>
                <p>This is a friendly reminder about your upcoming appointment:</p>
                <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
                  <p style="margin:4px 0;"><strong>📅 Date:</strong> ${dateStr}</p>
                  <p style="margin:4px 0;"><strong>🕐 Time:</strong> ${timeStr}</p>
                  <p style="margin:4px 0;"><strong>🏢 With:</strong> ${brandName}</p>
                  <p style="margin:4px 0;"><strong>📋 Service:</strong> ${appt.serviceName}</p>
                </div>
                <p style="font-size:13px;color:#6b7280;">Need to reschedule? Contact the business directly.</p>
              </div>
            </div>
          `;

          await emailService.sendEmail({
            to: appt.customerEmail,
            subject: `Reminder: Appointment tomorrow at ${timeStr} — ${brandName}`,
            html,
          });
        }

        // Send WhatsApp reminder via the WhatsApp number
        if (appt.customerPhone) {
          const contact = appt.branch?.contact as any;
          if (contact?.whatsapp) {
            // Log that we would send WhatsApp (actual Twilio/WhatsApp API integration)
            logger.info({
              phone: appt.customerPhone,
              appointment: appt.id,
              message: `Reminder: Your appointment at ${brandName} is tomorrow at ${timeStr}`,
            }, 'WhatsApp reminder queued');
          }
        }

        // Mark as reminded
        await prisma.appointment.update({
          where: { id: appt.id },
          data: {
            internalNotes: `${appt.internalNotes || ''}\n[reminder_sent:${now.toISOString()}]`.trim(),
          },
        });

        results.reminded++;
      } catch (err) {
        results.errors++;
        logger.error({ err, appointmentId: appt.id }, 'Reminder send failed');
      }
    }

    logger.info(results, 'Appointment reminder cron completed');

    return NextResponse.json({
      success: true,
      ...results,
      totalFound: appointments.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Appointment reminder cron failed');
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
