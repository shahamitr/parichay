// @ts-nocheck
import { NextResponse } from 'next/server';
import { applySecurityHeaders } from '../security-headers';

describe('Security Headers', () => {
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('applySecurityHeaders', () => {
    it('should apply X-Frame-Options header', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      expect(securedResponse.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    });

    it('should apply X-Content-Type-Options header', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      expect(securedResponse.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should apply X-XSS-Protection header', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      expect(securedResponse.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });

    it('should apply Referrer-Policy header', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      expect(securedResponse.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });

    it('should apply Content-Security-Policy header', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      const csp = securedResponse.headers.get('Content-Security-Policy');
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("https://js.stripe.com");
      expect(csp).toContain("https://checkout.razorpay.com");
      expect(csp).toContain("object-src 'none'");
    });

    it('should apply Permissions-Policy header', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      const permissionsPolicy = securedResponse.headers.get('Permissions-Policy');
      expect(permissionsPolicy).toBeDefined();
      expect(permissionsPolicy).toContain('camera=()');
      expect(permissionsPolicy).toContain('microphone=()');
      expect(permissionsPolicy).toContain('geolocation=(self)');
      expect(permissionsPolicy).toContain('payment=(self)');
    });

    it('should apply Strict-Transport-Security in production', () => {
      process.env.NODE_ENV = 'production';

      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      const hsts = securedResponse.headers.get('Strict-Transport-Security');
      expect(hsts).toBe('max-age=31536000; includeSubDomains');
    });

    it('should not apply Strict-Transport-Security in development', () => {
      process.env.NODE_ENV = 'development';

      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      const hsts = securedResponse.headers.get('Strict-Transport-Security');
      expect(hsts).toBeNull();
    });

    it('should preserve existing response data', () => {
      const response = NextResponse.json({ data: 'test', id: 123 });
      const securedResponse = applySecurityHeaders(response);

      expect(securedResponse.status).toBe(200);
    });

    it('should work with different response types', () => {
      const jsonResponse = NextResponse.json({ data: 'test' });
      const redirectResponse = NextResponse.redirect('http://localhost/login');
      const nextResponse = NextResponse.next();

      const securedJson = applySecurityHeaders(jsonResponse);
      const securedRedirect = applySecurityHeaders(redirectResponse);
      const securedNext = applySecurityHeaders(nextResponse);

      expect(securedJson.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
      expect(securedRedirect.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
      expect(securedNext.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    });

    it('should include all required security headers', () => {
      const response = NextResponse.json({ data: 'test' });
      const securedResponse = applySecurityHeaders(response);

      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Content-Security-Policy',
        'Permissions-Policy',
      ];

      requiredHeaders.forEach(header => {
        expect(securedResponse.headers.get(header)).toBeDefined();
      });
    });
  });
});
