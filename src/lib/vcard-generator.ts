/**
 * vCard Generator Utility
 * Generates vCard 3.0 format for contact information
 */

import { MicrositeData } from '@/types/microsite';

export interface VCardData {
  branch: {
    name: string;
    contact: {
      phone?: string;
      whatsapp?: string;
      email?: string;
    };
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
    };
    businessHours?: {
      [day: string]: {
        open: string;
        close: string;
        closed: boolean;
      };
    };
  };
  brand: {
    name: string;
    logo?: string | null;
    tagline?: string | null;
  };
  micrositeUrl: string;
}

/**
 * Generate vCard 3.0 format string
 * @param data - Microsite data containing branch and brand information
 * @returns vCard formatted string
 */
export function generateVCard(data: VCardData): string {
  const { branch, brand, micrositeUrl } = data;
  const { contact, address, socialMedia, businessHours } = branch;

  // Start vCard
  const vCardLines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  // Full name (branch name)
  vCardLines.push(`FN:${escapeVCardValue(branch.name)}`);

  // Organization (brand name)
  vCardLines.push(`ORG:${escapeVCardValue(brand.name)}`);

  // Title/Role (brand tagline if available)
  if (brand.tagline) {
    vCardLines.push(`TITLE:${escapeVCardValue(brand.tagline)}`);
  }

  // Phone numbers
  if (contact.phone) {
    vCardLines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(contact.phone)}`);
  }

  if (contact.whatsapp && contact.whatsapp !== contact.phone) {
    vCardLines.push(`TEL;TYPE=CELL:${escapeVCardValue(contact.whatsapp)}`);
  }

  // Email
  if (contact.email) {
    vCardLines.push(`EMAIL;TYPE=INTERNET,WORK:${escapeVCardValue(contact.email)}`);
  }

  // Address
  if (address != null) {
    // ADR format: ;;street;city;state;zipCode;country
    const adrValue = [
      '', // PO Box (empty)
      '', // Extended address (empty)
      escapeVCardValue(address.street),
      escapeVCardValue(address.city),
      escapeVCardValue(address.state),
      escapeVCardValue(address.zipCode),
      escapeVCardValue(address.country),
    ].join(';');
    vCardLines.push(`ADR;TYPE=WORK:${adrValue}`);

    // Formatted address label
    const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    vCardLines.push(`LABEL;TYPE=WORK:${escapeVCardValue(formattedAddress)}`);
  }

  // Website URL (microsite URL)
  vCardLines.push(`URL:${escapeVCardValue(micrositeUrl)}`);

  // Social media URLs
  if (socialMedia != null) {
    if (socialMedia.facebook) {
      vCardLines.push(`URL;TYPE=Facebook:${escapeVCardValue(socialMedia.facebook)}`);
    }
    if (socialMedia.instagram) {
      vCardLines.push(`URL;TYPE=Instagram:${escapeVCardValue(socialMedia.instagram)}`);
    }
    if (socialMedia.linkedin) {
      vCardLines.push(`URL;TYPE=LinkedIn:${escapeVCardValue(socialMedia.linkedin)}`);
    }
    if (socialMedia.twitter) {
      vCardLines.push(`URL;TYPE=Twitter:${escapeVCardValue(socialMedia.twitter)}`);
    }
  }

  // Business hours in NOTE field
  if (businessHours != null) {
    const hoursText = formatBusinessHours(businessHours);
    if (hoursText != null) {
      vCardLines.push(`NOTE:${escapeVCardValue(hoursText)}`);
    }
  }

  // Logo/Photo (if available and is a URL)
  if (brand.logo) {
    // For vCard 3.0, we can include the URL to the logo
    // Note: Some vCard readers support PHOTO;VALUE=URI
    vCardLines.push(`PHOTO;VALUE=URI:${escapeVCardValue(brand.logo)}`);
  }

  // End vCard
  vCardLines.push('END:VCARD');

  return vCardLines.join('\r\n');
}

/**
 * Escape special characters in vCard values
 * @param value - String value to escape
 * @returns Escaped string
 */
function escapeVCardValue(value: string): string {
  if (!value) return '';

  return value
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/;/g, '\\;')    // Escape semicolons
    .replace(/,/g, '\\,')    // Escape commas
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '');     // Remove carriage returns
}

/**
 * Format business hours for NOTE field
 * @param businessHours - Business hours object
 * @returns Formatted business hours string
 */
function formatBusinessHours(businessHours: {
  [day: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}): string {
  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const lines: string[] = ['Business Hours:'];

  for (const day of daysOrder) {
    const hours = businessHours[day];
    if (hours != null) {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      if (hours.closed) {
        lines.push(`${dayName}: Closed`);
      } else {
        lines.push(`${dayName}: ${hours.open} - ${hours.close}`);
      }
    }
  }

  return lines.length > 1 ? lines.join('\n') : '';
}

/**
 * Generate vCard filename
 * @param branchName - Branch name
 * @returns Sanitized filename
 */
export function generateVCardFilename(branchName: string): string {
  return `${branchName.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
}
