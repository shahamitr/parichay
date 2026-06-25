import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';
import { z } from 'zod';
import { UserRole } from '@/generated/prisma';
import { getAuthenticatedUser, RequestUser } from './auth-utils';
import { RateLimiter, rateLimiters } from './rate-limiter';

// =============================================================================
// Types
// =============================================================================
type Handler = (request: NextRequest, context: any) => Promise<NextResponse>;
type AuthenticatedHandler = (
  request: NextRequest,
  context: any,
  user: RequestUser
) => Promise<NextResponse>;

interface ApiHandlerOptions {
  /** Require authentication; optionally restrict to specific roles */
  auth?: boolean | { roles: UserRole[] };
  /** Apply rate limiting with a named limiter */
  rateLimit?: keyof typeof rateLimiters;
}

// =============================================================================
// Core wrapper: withErrorHandler
// =============================================================================

/**
 * Wraps an API route handler with centralized error handling, logging,
 * and optional auth/rate-limiting.
 *
 * @example Basic (no auth)
 * ```ts
 * export const GET = withErrorHandler(async (req) => {
 *   const data = await prisma.item.findMany();
 *   return NextResponse.json({ data });
 * });
 * ```
 *
 * @example With auth + rate limiting
 * ```ts
 * export const POST = withApiHandler(
 *   { auth: { roles: ['SUPER_ADMIN'] }, rateLimit: 'api' },
 *   async (req, ctx, user) => {
 *     // user is guaranteed to be authenticated
 *     return NextResponse.json({ success: true });
 *   }
 * );
 * ```
 */
export function withErrorHandler(handler: Handler) {
  return async (request: NextRequest, context: any) => {
    const correlationId =
      request.headers.get('x-correlation-id') ||
      crypto.randomUUID().slice(0, 8);
    const url = new URL(request.url).pathname;

    try {
      const response = await handler(request, context);
      // Attach correlation ID to all responses
      if (response instanceof NextResponse) {
        response.headers.set('x-correlation-id', correlationId);
      }
      return response;
    } catch (error) {
      return handleError(error, url, correlationId);
    }
  };
}

// =============================================================================
// Enhanced wrapper: withApiHandler (auth + rate limit + error handling)
// =============================================================================

export function withApiHandler(
  options: ApiHandlerOptions,
  handler: AuthenticatedHandler
): (request: NextRequest, context: any) => Promise<NextResponse>;
export function withApiHandler(
  options: ApiHandlerOptions & { auth: false },
  handler: Handler
): (request: NextRequest, context: any) => Promise<NextResponse>;
export function withApiHandler(
  options: ApiHandlerOptions,
  handler: AuthenticatedHandler | Handler
) {
  return async (request: NextRequest, context: any): Promise<NextResponse> => {
    const correlationId =
      request.headers.get('x-correlation-id') ||
      crypto.randomUUID().slice(0, 8);
    const url = new URL(request.url).pathname;

    try {
      // 1. Rate limiting
      if (options.rateLimit) {
        const limiter = rateLimiters[options.rateLimit];
        if (limiter) {
          const identifier = limiter.getIdentifier(request);
          const rlResult = await limiter.checkLimit(identifier);
          if (!rlResult.allowed) {
            const retryAfter = Math.ceil((rlResult.resetTime - Date.now()) / 1000);
            return NextResponse.json(
              { error: 'Rate limit exceeded. Please try again later.', correlationId },
              {
                status: 429,
                headers: {
                  'Retry-After': retryAfter.toString(),
                  'X-RateLimit-Remaining': '0',
                  'x-correlation-id': correlationId,
                },
              }
            );
          }
        }
      }

      // 2. Authentication
      if (options.auth !== false && options.auth !== undefined) {
        const user = await getAuthenticatedUser(request);

        if (!user) {
          return NextResponse.json(
            { error: 'Authentication required', correlationId },
            { status: 401, headers: { 'x-correlation-id': correlationId } }
          );
        }

        // Role check
        if (typeof options.auth === 'object' && options.auth.roles) {
          if (!options.auth.roles.includes(user.role)) {
            return NextResponse.json(
              { error: 'Insufficient permissions', correlationId },
              { status: 403, headers: { 'x-correlation-id': correlationId } }
            );
          }
        }

        const response = await (handler as AuthenticatedHandler)(request, context, user);
        if (response instanceof NextResponse) {
          response.headers.set('x-correlation-id', correlationId);
        }
        return response;
      }

      // No auth required
      const response = await (handler as Handler)(request, context);
      if (response instanceof NextResponse) {
        response.headers.set('x-correlation-id', correlationId);
      }
      return response;
    } catch (error) {
      return handleError(error, url, correlationId);
    }
  };
}

// =============================================================================
// Shared error handler
// =============================================================================
function handleError(error: unknown, url: string, correlationId: string): NextResponse {
  // Zod validation errors
  if (error instanceof z.ZodError) {
    logger.warn({ correlationId, url, errors: error.errors }, 'API Validation Error');
    return NextResponse.json(
      { error: 'Invalid input data', details: error.errors, correlationId },
      { status: 400, headers: { 'x-correlation-id': correlationId } }
    );
  }

  // Known application errors
  if (error instanceof Error) {
    // Auth errors thrown by requireAuth/requireRole
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required', correlationId },
        { status: 401, headers: { 'x-correlation-id': correlationId } }
      );
    }
    if (error.message === 'Insufficient permissions' || error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: error.message, correlationId },
        { status: 403, headers: { 'x-correlation-id': correlationId } }
      );
    }

    // Database connection errors
    const msg = error.message.toLowerCase();
    if (msg.includes('connect') || msg.includes('econnrefused') || msg.includes('etimedout')) {
      logger.error({ correlationId, url, error: error.message }, 'Database connection error');
      return NextResponse.json(
        { error: 'Service temporarily unavailable', correlationId },
        { status: 503, headers: { 'x-correlation-id': correlationId } }
      );
    }
  }

  // Unknown errors
  logger.error({
    correlationId,
    url,
    error: error instanceof Error
      ? { message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined }
      : error,
  }, 'Unhandled API Error');

  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      correlationId,
    },
    { status: 500, headers: { 'x-correlation-id': correlationId } }
  );
}

// =============================================================================
// Helpers
// =============================================================================

/** Standard API success response */
export function apiSuccess<T extends Record<string, unknown>>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

/** Standard API error response */
export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}
