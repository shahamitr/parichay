/**
 * Bot Protection Module
 *
 * Server-side utilities for detecting and blocking automated/bot traffic.
 * Used across all public-facing API routes.
 */

import { NextRequest } from 'next/server';
import logger from './logger';

// =============================================================================
// Known bot User-Agent patterns (block these on form submissions)
// =============================================================================
const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /curl/i, /wget/i,
  /python-requests/i, /httpx/i, /axios/i, /node-fetch/i,
  /go-http-client/i, /java\//i, /libwww/i, /lwp-/i,
  /phantom/i, /headless/i, /selenium/i, /puppeteer/i,
  /playwright/i, /cypress/i,
];

// User-Agents we allow (search engines for GET, but block on POST)
const ALLOWED_CRAWLERS_GET_ONLY = [
  /googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i,
];

// =============================================================================
// Bot Detection Result
// =============================================================================
export interface BotCheckResult {
  isBot: boolean;
  reason?: string;
  score: number; // 0 = definitely human, 100 = definitely bot
}

// =============================================================================
// Main Detection Function
// =============================================================================

/**
 * Analyze a request for bot-like characteristics.
 * Returns a score (0-100) and whether to block.
 * Threshold: score >= 70 = block
 */
export function detectBot(request: NextRequest): BotCheckResult {
  let score = 0;
  const reasons: string[] = [];
  const ua = request.headers.get('user-agent') || '';
  const method = request.method;

  // 1. No User-Agent header at all (very suspicious)
  if (!ua || ua.length < 10) {
    score += 40;
    reasons.push('missing-or-short-ua');
  }

  // 2. Known bot User-Agent patterns
  if (BOT_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
    // Allow search engine bots on GET requests only
    if (method === 'GET' && ALLOWED_CRAWLERS_GET_ONLY.some((p) => p.test(ua))) {
      // This is a legitimate crawler on GET — don't penalize
    } else {
      score += 60;
      reasons.push('bot-ua-pattern');
    }
  }

  // 3. Missing standard browser headers (real browsers send these)
  if (!request.headers.get('accept-language')) {
    score += 15;
    reasons.push('no-accept-language');
  }
  if (!request.headers.get('accept')) {
    score += 10;
    reasons.push('no-accept');
  }

  // 4. Suspicious header combinations
  const connection = request.headers.get('connection');
  if (connection === 'close' && !ua.includes('Mobile')) {
    score += 5;
    reasons.push('connection-close-desktop');
  }

  // 5. Content-Length on POST without proper content-type
  if (method === 'POST') {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('json') && !contentType.includes('form')) {
      score += 20;
      reasons.push('post-without-content-type');
    }
  }

  return {
    isBot: score >= 70,
    reason: reasons.join(', '),
    score,
  };
}

// =============================================================================
// Honeypot Validation (server-side)
// =============================================================================

/**
 * Check if a request body contains filled honeypot fields.
 * The client form includes hidden fields that humans never fill.
 * Bot frameworks auto-fill all fields including these.
 */
export function hasFilledHoneypot(body: Record<string, unknown>): boolean {
  const honeypotFields = [
    'website_url',     // Hidden field in contact forms
    'feedback_website', // Hidden field in feedback forms
    'fax_number',      // No one has a fax anymore
    'company_url',     // Hidden secondary field
    '_hp_check',       // Generic honeypot
  ];

  return honeypotFields.some((field) => {
    const value = body[field];
    return value !== undefined && value !== null && value !== '';
  });
}

// =============================================================================
// Timing Validation (server-side)
// =============================================================================

/**
 * Check if the form was submitted too quickly.
 * Client sends a `_form_loaded_at` timestamp; if the delta is < threshold,
 * it's likely a bot.
 */
export function isSubmittedTooFast(
  body: Record<string, unknown>,
  thresholdMs: number = 2000
): boolean {
  const loadedAt = body._form_loaded_at;
  if (!loadedAt || typeof loadedAt !== 'number') {
    // No timing info — can't determine, allow but note
    return false;
  }
  return Date.now() - loadedAt < thresholdMs;
}

// =============================================================================
// Combined Server-Side Validation for Public Form Submissions
// =============================================================================

export interface BotValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Full bot check for any public form submission API route.
 * Call this at the top of any POST handler that accepts public input.
 *
 * @example
 * ```ts
 * const botCheck = validateFormSubmission(request, body);
 * if (!botCheck.allowed) {
 *   return NextResponse.json({ success: true }); // Silent reject
 * }
 * ```
 */
export function validateFormSubmission(
  request: NextRequest,
  body: Record<string, unknown>
): BotValidationResult {
  // 1. UA-based bot detection
  const botCheck = detectBot(request);
  if (botCheck.isBot) {
    logger.warn({ reason: botCheck.reason, score: botCheck.score }, 'Bot detected via UA');
    return { allowed: false, reason: `bot-ua: ${botCheck.reason}` };
  }

  // 2. Honeypot check
  if (hasFilledHoneypot(body)) {
    logger.warn({}, 'Bot detected via honeypot');
    return { allowed: false, reason: 'honeypot-filled' };
  }

  // 3. Timing check
  if (isSubmittedTooFast(body)) {
    logger.warn({}, 'Bot detected via timing (submitted too fast)');
    return { allowed: false, reason: 'submitted-too-fast' };
  }

  return { allowed: true };
}
