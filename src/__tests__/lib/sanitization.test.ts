import { describe, it, expect } from 'vitest';
import {
  sanitizeHtml,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeFileName,
  escapeRegex,
} from '@/lib/sanitization';

describe('Sanitization Module', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      expect(sanitizeHtml(input)).toBe('Hello  World');
    });

    it('should remove event handlers', () => {
      const input = '<img src="x" onerror="alert(1)">';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('onerror');
    });

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('javascript:');
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="http://evil.com"></iframe>';
      expect(sanitizeHtml(input)).toBe('');
    });

    it('should preserve safe HTML', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      expect(sanitizeHtml(input)).toBe(input);
    });

    it('should handle empty input', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove null bytes', () => {
      expect(sanitizeInput('hello\0world')).toBe('helloworld');
    });

    it('should truncate at 10000 characters', () => {
      const longInput = 'a'.repeat(15000);
      expect(sanitizeInput(longInput).length).toBe(10000);
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should lowercase and trim', () => {
      expect(sanitizeEmail('  TEST@Email.COM  ')).toBe('test@email.com');
    });

    it('should remove invalid characters', () => {
      // sanitizeEmail only removes chars not valid in email addresses
      // angle brackets get stripped since < > are invalid in emails
      const result = sanitizeEmail('test<script>@email.com');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('@email.com');
    });

    it('should preserve valid email characters', () => {
      expect(sanitizeEmail('user+tag@domain.co.in')).toBe('user+tag@domain.co.in');
    });
  });

  describe('sanitizePhone', () => {
    it('should keep only digits and leading +', () => {
      expect(sanitizePhone('+91 98765-43210')).toBe('+919876543210');
    });

    it('should handle phone without +', () => {
      expect(sanitizePhone('9876543210')).toBe('+9876543210');
    });

    it('should handle empty input', () => {
      expect(sanitizePhone('')).toBe('');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should allow http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should allow relative URLs', () => {
      expect(sanitizeUrl('/path/to/page')).toBe('/path/to/page');
    });

    it('should reject javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    });

    it('should reject data: protocol', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('should reject invalid protocols', () => {
      expect(sanitizeUrl('ftp://evil.com')).toBe('');
    });
  });

  describe('sanitizeFileName', () => {
    it('should remove directory traversal', () => {
      expect(sanitizeFileName('../../etc/passwd')).toBe('etcpasswd');
    });

    it('should remove path separators', () => {
      expect(sanitizeFileName('path/to/file.txt')).toBe('pathtofile.txt');
      expect(sanitizeFileName('path\\to\\file.txt')).toBe('pathtofile.txt');
    });

    it('should truncate long filenames', () => {
      const longName = 'a'.repeat(300) + '.pdf';
      const result = sanitizeFileName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
      expect(result.endsWith('.pdf')).toBe(true);
    });

    it('should remove null bytes', () => {
      expect(sanitizeFileName('file\0name.pdf')).toBe('filename.pdf');
    });
  });

  describe('escapeRegex', () => {
    it('should escape special regex characters', () => {
      expect(escapeRegex('hello.world')).toBe('hello\\.world');
      expect(escapeRegex('price: $100+')).toBe('price: \\$100\\+');
      expect(escapeRegex('[test](value)')).toBe('\\[test\\]\\(value\\)');
    });
  });
});
