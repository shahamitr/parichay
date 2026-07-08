import { describe, it, expect } from 'vitest';
import {
  detectBot,
  hasFilledHoneypot,
  isSubmittedTooFast,
  validateFormSubmission,
} from '@/lib/bot-protection';

// Mock NextRequest
function mockRequest(headers: Record<string, string> = {}, method = 'POST') {
  return {
    method,
    headers: {
      get: (key: string) => headers[key.toLowerCase()] || null,
    },
  } as any;
}

describe('Bot Protection Module', () => {
  describe('detectBot', () => {
    it('should detect missing user-agent as suspicious', () => {
      const result = detectBot(mockRequest({}));
      expect(result.score).toBeGreaterThanOrEqual(40);
    });

    it('should detect short user-agent as suspicious', () => {
      const result = detectBot(mockRequest({ 'user-agent': 'curl' }));
      expect(result.score).toBeGreaterThanOrEqual(40);
    });

    it('should detect known bot patterns', () => {
      const bots = ['python-requests/2.28', 'curl/7.88.0 libcurl', 'Selenium WebDriver', 'Puppeteer/1.0 HeadlessChrome', 'go-http-client/1.1'];
      for (const ua of bots) {
        const result = detectBot(mockRequest({ 'user-agent': ua, 'content-type': 'application/json' }));
        expect(result.isBot).toBe(true);
      }
    });

    it('should allow real browser user-agents', () => {
      const browsers = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      ];
      for (const ua of browsers) {
        const result = detectBot(mockRequest({
          'user-agent': ua,
          'accept-language': 'en-US,en;q=0.9',
          'accept': 'text/html',
        }));
        expect(result.isBot).toBe(false);
        expect(result.score).toBeLessThan(70);
      }
    });

    it('should allow Googlebot on GET requests', () => {
      const result = detectBot(mockRequest({
        'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        'accept-language': 'en',
        'accept': '*/*',
      }, 'GET'));
      expect(result.isBot).toBe(false);
    });

    it('should block Googlebot on POST requests', () => {
      const result = detectBot(mockRequest({
        'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        'accept-language': 'en',
        'accept': '*/*',
        'content-type': 'application/json',
      }, 'POST'));
      // Googlebot on POST gets the bot UA penalty
      expect(result.score).toBeGreaterThanOrEqual(60);
    });

    it('should penalize missing accept-language header', () => {
      const withLang = detectBot(mockRequest({
        'user-agent': 'Mozilla/5.0 Chrome/120.0',
        'accept-language': 'en-US',
        'accept': 'text/html',
      }));
      const withoutLang = detectBot(mockRequest({
        'user-agent': 'Mozilla/5.0 Chrome/120.0',
        'accept': 'text/html',
      }));
      expect(withoutLang.score).toBeGreaterThan(withLang.score);
    });
  });

  describe('hasFilledHoneypot', () => {
    it('should return false for clean submissions', () => {
      expect(hasFilledHoneypot({ name: 'John', email: 'john@test.com' })).toBe(false);
    });

    it('should detect filled honeypot fields', () => {
      expect(hasFilledHoneypot({ name: 'John', website_url: 'http://spam.com' })).toBe(true);
      expect(hasFilledHoneypot({ feedback_website: 'filled' })).toBe(true);
      expect(hasFilledHoneypot({ fax_number: '123' })).toBe(true);
      expect(hasFilledHoneypot({ _hp_check: 'anything' })).toBe(true);
    });

    it('should allow empty honeypot fields', () => {
      expect(hasFilledHoneypot({ website_url: '', name: 'John' })).toBe(false);
      expect(hasFilledHoneypot({ website_url: null })).toBe(false);
    });
  });

  describe('isSubmittedTooFast', () => {
    it('should return false if no timing info', () => {
      expect(isSubmittedTooFast({})).toBe(false);
    });

    it('should return true if submitted within 2 seconds', () => {
      expect(isSubmittedTooFast({ _form_loaded_at: Date.now() - 500 })).toBe(true);
      expect(isSubmittedTooFast({ _form_loaded_at: Date.now() - 1000 })).toBe(true);
    });

    it('should return false if submitted after threshold', () => {
      expect(isSubmittedTooFast({ _form_loaded_at: Date.now() - 5000 })).toBe(false);
      expect(isSubmittedTooFast({ _form_loaded_at: Date.now() - 10000 })).toBe(false);
    });
  });

  describe('validateFormSubmission', () => {
    it('should allow legitimate submissions', () => {
      const req = mockRequest({
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0',
        'accept-language': 'en-IN',
        'accept': 'application/json',
        'content-type': 'application/json',
      });
      const body = { name: 'John', _form_loaded_at: Date.now() - 10000 };
      const result = validateFormSubmission(req, body);
      expect(result.allowed).toBe(true);
    });

    it('should reject bot user-agents', () => {
      const req = mockRequest({
        'user-agent': 'python-requests/2.28',
        'content-type': 'application/json',
      });
      const result = validateFormSubmission(req, { name: 'Bot' });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('bot-ua');
    });

    it('should reject filled honeypot', () => {
      const req = mockRequest({
        'user-agent': 'Mozilla/5.0 Chrome/120.0',
        'accept-language': 'en-US',
        'accept': 'application/json',
        'content-type': 'application/json',
      });
      const body = { name: 'John', website_url: 'http://spam.com' };
      const result = validateFormSubmission(req, body);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('honeypot');
    });

    it('should reject instant submissions', () => {
      const req = mockRequest({
        'user-agent': 'Mozilla/5.0 Chrome/120.0',
        'accept-language': 'en-US',
        'accept': 'application/json',
        'content-type': 'application/json',
      });
      const body = { name: 'Fast', _form_loaded_at: Date.now() - 100 };
      const result = validateFormSubmission(req, body);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('too-fast');
    });
  });
});
