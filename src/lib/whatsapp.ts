import logger from './logger';

/**
 * WhatsApp Business API Integration
 *
 * Requires environment variables:
 * - WHATSAPP_PHONE_NUMBER_ID: Your WhatsApp Business phone number ID
 * - WHATSAPP_ACCESS_TOKEN: Your WhatsApp Business API access token
 *
 * Get credentials from: https://developers.facebook.com/apps
 */

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
}

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Check if WhatsApp integration is configured
 */
export function isWhatsAppConfigured(): boolean {
  return !!(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN);
}

/**
 * Get WhatsApp configuration from environment
 */
function getWhatsAppConfig(): WhatsAppConfig | null {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return null;
  }

  return { phoneNumberId, accessToken };
}

/**
 * Format phone number for WhatsApp API (must include country code, no spaces/dashes)
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters except leading +
  let formatted = phone.replace(/[^\d+]/g, '');

  // If starts with +, remove it (API expects just numbers)
  if (formatted.startsWith('+')) {
    formatted = formatted.slice(1);
  }

  // If it's an Indian number without country code, add 91
  if (formatted.length === 10 && !formatted.startsWith('91')) {
    formatted = '91' + formatted;
  }

  return formatted;
}

/**
 * Send a text message via WhatsApp Business API
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<SendMessageResult> {
  const config = getWhatsAppConfig();

  if (!config) {
    logger.warn('WhatsApp not configured - message not sent');
    return {
      success: false,
      error: 'WhatsApp not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.',
    };
  }

  const formattedPhone = formatPhoneNumber(to);
  const apiUrl = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'text',
        text: { body: message },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error({ error: data, phone: formattedPhone }, 'WhatsApp API error');
      return {
        success: false,
        error: data.error?.message || 'WhatsApp API error',
      };
    }

    logger.info({ messageId: data.messages?.[0]?.id, to: formattedPhone }, 'WhatsApp message sent');
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    logger.error({ error }, 'WhatsApp send failed');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send WhatsApp message',
    };
  }
}

/**
 * Send lead notification via WhatsApp
 */
export async function sendLeadNotificationWhatsApp(
  whatsappNumber: string,
  leadInfo: {
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    source: string;
    submittedAt: string;
    leadId: string;
  },
  brandName: string,
  branchName: string
): Promise<SendMessageResult> {
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

  return sendWhatsAppMessage(whatsappNumber, message);
}
