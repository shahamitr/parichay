import { NextRequest, NextResponse } from 'next/server';
import { JWTEdgeService } from './lib/jwt-edge';
import { applySecurityHeaders } from './lib/security-headers';
import { applyRateLimit, rateLimiters } from './lib/rate-limiter';
import { getCorrelationId, addCorrelationId } from './lib/correlation-id';

// Define protected routes
const protectedRoutes = ['/dashboard', '/admin', '/executive', '/api/brands', '/api/branches'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const hostname = request.headers.get('host') || '';

  // Debug logging
  console.log('Middleware:', {
    pathname,
    hasToken: !!accessToken,
    isProtected: protectedRoutes.some(r => pathname.startsWith(r)),
    isAuth: authRoutes.some(r => pathname.startsWith(r))
  });

  // Generate or retrieve correlation ID for request tracing
  const correlationId = getCorrelationId(request);

  // Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const limiter = getRateLimiterForPath(pathname);
    const rateLimitResult = await applyRateLimit(request, limiter);

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );

      // Add rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return applySecurityHeaders(response);
    }
  }

  // Handle custom domain routing (skip for IP addresses and localhost)
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(hostname.split(':')[0]);
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const isMainDomain = hostname.includes('onetouchbizcard.in');

  if (!isIpAddress && !isLocalhost && !isMainDomain) {
    return handleCustomDomain(request, hostname);
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it
  if (accessToken != null) {
    const payload = await JWTEdgeService.verifyToken(accessToken);
    console.log('🔍 Token verification:', { hasPayload: !!payload, isAuthRoute, pathname });

    // If token is invalid, clear cookies and redirect to login
    if (!payload && isProtectedRoute) {
      console.log('❌ Invalid token, clearing cookies and redirecting to login');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return applySecurityHeaders(response);
    }

    // If user is authenticated and trying to access auth routes, redirect based on role
    if (payload && isAuthRoute) {
      const redirectUrl = payload.role === 'EXECUTIVE' ? '/executive' : '/dashboard';
      console.log('🔄 Middleware redirecting authenticated user from', pathname, 'to', redirectUrl);
      const response = NextResponse.redirect(new URL(redirectUrl, request.url));

      // Preserve cookies in redirect
      if (accessToken != null) {
        response.cookies.set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
      }

      const refreshToken = request.cookies.get('refreshToken')?.value;
      if (refreshToken != null) {
        response.cookies.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }

      console.log('✅ Redirect response created with cookies preserved');
      return applySecurityHeaders(response);
    }

    // Redirect executives trying to access admin dashboard to executive portal
    // BUT allow access to microsite editor (both branch and brand level)
    if (payload && payload.role === 'EXECUTIVE' && pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/microsite') && !pathname.includes('/microsite')) {
      const response = NextResponse.redirect(new URL('/executive', request.url));

      // Preserve cookies in redirect
      if (accessToken != null) {
        response.cookies.set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
      }

      const refreshToken = request.cookies.get('refreshToken')?.value;
      if (refreshToken != null) {
        response.cookies.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }

      return applySecurityHeaders(response);
    }

    // Add user info to headers for API routes
    if (payload && pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-role', payload.role);
      if (payload.brandId) {
        requestHeaders.set('x-brand-id', payload.brandId);
      }
      addCorrelationId(requestHeaders, correlationId);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      addCorrelationId(response.headers, correlationId);
      return applySecurityHeaders(response);
    }
  }

  const response = NextResponse.next();
  addCorrelationId(response.headers, correlationId);
  return applySecurityHeaders(response);
}

// Get appropriate rate limiter based on path
function getRateLimiterForPath(pathname: string) {
  if (pathname.startsWith('/api/auth/')) {
    return rateLimiters.auth;
  }
  if (pathname.startsWith('/api/payments/')) {
    return rateLimiters.payment;
  }
  if (pathname.startsWith('/api/')) {
    return rateLimiters.api;
  }
  return rateLimiters.public;
}

// Handle custom domain routing
async function handleCustomDomain(request: NextRequest, hostname: string) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    const response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  try {
    // In production, query database to find brand by custom domain
    // For now, we'll add the custom domain info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-custom-domain', hostname);

    // Extract branch slug from pathname
    // Custom domain URL structure: customdomain.com/{branch-slug}
    const pathParts = pathname.split('/').filter(Boolean);
    const branchSlug = pathParts[0];

    if (branchSlug != null) {
      // Rewrite to microsite route with custom domain context
      const url = request.nextUrl.clone();
      url.pathname = `/api/microsites/custom-domain/${hostname}/${branchSlug}`;

      const response = NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });

      return applySecurityHeaders(response);
    }

    // If no branch slug, show brand landing page or 404
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return applySecurityHeaders(response);
  } catch (error) {
    console.error('Custom domain routing error:', error);
    const response = NextResponse.next();
    return applySecurityHeaders(response);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};