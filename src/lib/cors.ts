import { NextResponse } from 'next/server';

/**
 * CORS configuration for API security
 */
export interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultOptions: CorsOptions = {
  origin: process.env.APP_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(
  response: NextResponse,
  origin: string | null,
  options: CorsOptions = defaultOptions
): NextResponse {
  const opts = { ...defaultOptions, ...options };

  // Check if origin is allowed
  const allowedOrigin = isOriginAllowed(origin, opts.origin);

  if (allowedOrigin != null) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  }

  if (opts.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (opts.methods) {
    response.headers.set('Access-Control-Allow-Methods', opts.methods.join(', '));
  }

  if (opts.allowedHeaders) {
    response.headers.set('Access-Control-Allow-Headers', opts.allowedHeaders.join(', '));
  }

  if (opts.exposedHeaders) {
    response.headers.set('Access-Control-Expose-Headers', opts.exposedHeaders.join(', '));
  }

  if (opts.maxAge) {
    response.headers.set('Access-Control-Max-Age', opts.maxAge.toString());
  }

  return response;
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, allowedOrigin?: string | string[]): string | null {
  if (!origin) return null;

  if (!allowedOrigin) return null;

  if (typeof allowedOrigin === 'string') {
    return allowedOrigin === '*' || allowedOrigin === origin ? origin : null;
  }

  if (Array.isArray(allowedOrigin)) {
    return allowedOrigin.includes(origin) ? origin : null;
  }

  return null;
}

/**
 * Handle preflight OPTIONS request
 */
export function handleCorsPreflightRequest(origin: string | null, options?: CorsOptions): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return applyCorsHeaders(response, origin, options);
}
