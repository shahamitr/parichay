import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =============================================================================
// Bot Detection (lightweight, edge-compatible)
// =============================================================================
const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /curl/i, /wget/i,
  /python-requests/i, /httpx/i, /node-fetch/i,
  /go-http-client/i, /java\//i, /libwww/i, /lwp-/i,
  /phantom/i, /headless/i, /selenium/i, /puppeteer/i,
  /playwright/i, /cypress/i,
];

const ALLOWED_CRAWLERS = [/googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i];

function isBotRequest(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') || '';
  if (!ua || ua.length < 10) return true;
  if (BOT_UA_PATTERNS.some((p) => p.test(ua))) {
    // Allow known search crawlers on GET
    if (request.method === 'GET' && ALLOWED_CRAWLERS.some((p) => p.test(ua))) {
      return false;
    }
    return true;
  }
  return false;
}

// =============================================================================
// Routes Configuration
// =============================================================================
const PROTECTED_ROUTES = ['/admin', '/business-owner', '/executive', '/customer-dashboard'];
// Routes that should redirect authenticated users away
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

// Role-based route mapping
const ROLE_ROUTES: Record<string, string[]> = {
  SUPER_ADMIN: ['/admin'],
  BRAND_MANAGER: ['/admin'],
  BRANCH_ADMIN: ['/admin'],
  EXECUTIVE: ['/admin', '/executive'],
  BUSINESS_OWNER: ['/business-owner', '/admin'],
  CUSTOMER: ['/customer-dashboard'],
};

// Default redirect for each role after login
const ROLE_DASHBOARD: Record<string, string> = {
  SUPER_ADMIN: '/admin/dashboard',
  BRAND_MANAGER: '/admin/dashboard',
  BRANCH_ADMIN: '/admin/dashboard',
  EXECUTIVE: '/admin/dashboard',
  BUSINESS_OWNER: '/business-owner/dashboard',
  CUSTOMER: '/customer-dashboard',
};

function parseJWT(token: string): { userId: string; role: string; email: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.userId || !payload.role) return null;
    return { userId: payload.userId, role: payload.role, email: payload.email };
  } catch {
    return null;
  }
}

/**
 * Apply security headers to every response passing through middleware.
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)'
  );

  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content Security Policy
  const isDev = process.env.NODE_ENV !== 'production';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://js.stripe.com https://checkout.razorpay.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://api.razorpay.com https://*.sentry.io",
    "frame-src 'self' https://js.stripe.com https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const user = accessToken ? parseJWT(accessToken) : null;

  // Check if trying to access protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api');
  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

  // ─── BOT BLOCKING ───
  // Block bots on all write API requests (POST/PUT/PATCH/DELETE)
  // and on auth page loads (login, register — prevents credential stuffing tools)
  if ((isApiRoute && isWriteMethod) || isAuthRoute) {
    if (isBotRequest(request)) {
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({ error: 'Access denied' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // For page requests, serve a 403 page
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  if (isProtectedRoute && !user) {
    // Not authenticated, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (isAuthRoute && user) {
    // Already authenticated, redirect to their dashboard
    const dashboard = ROLE_DASHBOARD[user.role] || '/admin/dashboard';
    return applySecurityHeaders(NextResponse.redirect(new URL(dashboard, request.url)));
  }

  // Role-based access control for protected routes
  if (isProtectedRoute && user) {
    const allowedRoutes = ROLE_ROUTES[user.role] || [];
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      // Redirect to their correct dashboard
      const dashboard = ROLE_DASHBOARD[user.role] || '/admin/dashboard';
      return applySecurityHeaders(NextResponse.redirect(new URL(dashboard, request.url)));
    }
  }

  // For API routes, pass authenticated user info via headers
  // so route handlers can use getUserFromRequest() without re-parsing JWT
  if (isApiRoute && user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-role', user.role);
    if (user.email) requestHeaders.set('x-user-email', user.email);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    return applySecurityHeaders(response);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    // Protected routes
    '/admin/:path*',
    '/business-owner/:path*',
    '/executive/:path*',
    '/customer-dashboard/:path*',
    // Auth routes (redirect if logged in)
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    // API routes (for security headers + user context injection)
    '/api/:path*',
  ],
};
