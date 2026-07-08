/**
 * WhatsApp Lead Notification Service
 *
 * Sends instant WhatsApp messages to business owners when they get a new lead.
 * Uses Twilio WhatsApp Business API.
 *
 * Fallback: If Twilio not configured, logs the message and falls through to email.
 */

import logger from './logger';

interface WhatsAppNotification {
  to: string; // Business owner's WhatsApp number
  leadName: string;
  leadPhone?: string;
  leadMessage?: string;
  brandName: string;
  source: string; // "contact_form", "quote_request", "booking"
}

/**
 * Send instant WhatsApp notification to business owner about a new lead.
 * Non-blocking — never throws, never delays the main flow.
 */
export async function sendLeadWhatsAppNotification(data: WhatsAppNotification): Promise<boolean> {
  const { to, leadName, leadPhone, leadMessage, brandName, source } = data;

  if (!to) {
    logger.debug('WhatsApp notification skipped: no recipient number');
    return false;
  }

  // Clean phone number
  const cleanTo = to.replace(/[^0-9+]/g, '');
  if (cleanTo.length < 10) {
    logger.debug({ to: cleanTo }, 'WhatsApp notification skipped: invalid number');
    return false;
  }

  // Build message
  const sourceLabel = {
    'contact_form': 'Contact Form',
    'quote_request': 'Quote Request',
    'booking': 'Appointment Booking',
    'microsite_form': 'Your Profile',
    'question': 'Customer Question',
  }[source] || 'Your Profile';

  const message = buildMessage(leadName, leadPhone, leadMessage, brandName, sourceLabel);

  // Check if Twilio is configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    // Log the notification instead (useful for testing)
    logger.info({
      type: 'WHATSAPP_NOTIFICATION_QUEUED',
      to: cleanTo,
      message,
      brandName,
      leadName,
    }, `WhatsApp notification (Twilio not configured): New lead for ${brandName}`);
    return false;
  }

  try {
    // Dynamic import to avoid loading Twilio if not needed
    const twilio = await import('twilio');
    const client = twilio.default(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${cleanTo}`,
    });

    logger.info({ to: cleanTo, brandName, leadName }, 'WhatsApp lead notification sent');
    return true;
  } catch (error) {
    logger.error({ error, to: cleanTo }, 'WhatsApp notification failed');
    return false;
  }
}

function buildMessage(
  leadName: string,
  leadPhone: string | undefined,
  leadMessage: string | undefined,
  brandName: string,
  sourceLabel: string
): string {
  let msg = `🔔 *New Lead for ${brandName}!*\n\n`;
  msg += `👤 *Name:* ${leadName}\n`;
  if (leadPhone) msg += `📞 *Phone:* ${leadPhone}\n`;
  msg += `📍 *Source:* ${sourceLabel}\n`;
  if (leadMessage) msg += `💬 *Message:* ${leadMessage.slice(0, 200)}\n`;
  msg += `\n⚡ Reply quickly to win this customer!\n`;
  msg += `\n_Sent via Parichay_`;
  return msg;
}

/**
 * Send appointment reminder via WhatsApp
 */
export async function sendAppointmentReminder(data: {
  to: string;
  customerName: string;
  businessName: string;
  date: string;
  time: string;
  service: string;
}): Promise<boolean> {
  const message = `📅 *Appointment Reminder*\n\nHi ${data.customerName},\n\nThis is a reminder about your appointment:\n\n🏢 *${data.businessName}*\n📋 *Service:* ${data.service}\n📅 *Date:* ${data.date}\n🕐 *Time:* ${data.time}\n\nSee you soon! Reply "CANCEL" if you need to reschedule.\n\n_Sent via Parichay_`;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    logger.info({ to: data.to, message }, 'WhatsApp reminder (Twilio not configured)');
    return false;
  }

  try {
    const twilio = await import('twilio');
    const client = twilio.default(accountSid, authToken);
    await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${data.to.replace(/[^0-9+]/g, '')}`,
    });
    return true;
  } catch (error) {
    logger.error({ error }, 'WhatsApp reminder failed');
    return false;
  }
}
