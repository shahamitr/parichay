/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove object and embed tags
  sanitized = sanitized.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');

  return sanitized;
}

/**
 * Sanitize user input for database queries
 * Note: Prisma already handles SQL injection prevention,
 * but this provides an additional layer of validation
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Trim whitespace
  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length to prevent DoS
  const maxLength = 10000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Convert to lowercase and trim
  let sanitized = email.toLowerCase().trim();

  // Remove any characters that aren't valid in email addresses
  sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '');

  return sanitized;
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  // Remove all non-numeric characters except + at the start
  let sanitized = phone.trim();

  // Keep + only if it's at the start
  const hasPlus = sanitized.startsWith('+');
  sanitized = sanitized.replace(/[^\d]/g, '');

  if (hasPlus != null) {
    sanitized = '+' + sanitized;
  }

  return sanitized;
}

/**
 * Sanitize URL to prevent open redirect vulnerabilities
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const sanitized = url.trim();

  // Only allow http, https, and relative URLs
  const urlPattern = /^(https?:\/\/|\/)/i;

  if (!urlPattern.test(sanitized)) {
    return '';
  }

  // Prevent javascript: and data: protocols
  if (/^(javascript|data):/i.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitize file names to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';

  // Remove directory traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');

  // Remove path separators
  sanitized = sanitized.replace(/[\/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.substring(0, maxLength - (ext ? ext.length + 1 : 0));
    sanitized = ext ? `${name}.${ext}` : name;
  }

  return sanitized;
}

/**
 * Validate and sanitize JSON input
 */
export function sanitizeJson<T>(input: any): T | null {
  try {
    // If it's already an object, stringify and parse to ensure it's valid JSON
    const jsonString = typeof input === 'string' ? input : JSON.stringify(input);
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Invalid JSON input:', error);
    return null;
  }
}

/**
 * Escape special characters for use in regex
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
