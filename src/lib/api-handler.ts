import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';
import { z } from 'zod';

type Handler<T> = (request: NextRequest, context: any) => Promise<T | NextResponse>;

/**
 * A wrapper for API route handlers that provides centralized error handling and logging.
 * 
 * @example
 * ```ts
 * export const GET = withErrorHandler(async (req) => {
 *   const data = await prisma.user.findMany();
 *   return NextResponse.json({ data });
 * });
 * ```
 */
export function withErrorHandler<T>(handler: Handler<T>) {
  return async (request: NextRequest, context: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const url = new URL(request.url).pathname;
      const correlationId = request.headers.get('x-correlation-id') || Math.random().toString(36).substring(7);

      if (error instanceof z.ZodError) {
        logger.warn({ 
          correlationId,
          url,
          errors: error.errors 
        }, 'API Validation Error');
        
        return NextResponse.json(
          { error: 'Invalid input data', details: error.errors, correlationId },
          { status: 400 }
        );
      }

      logger.error({ 
        correlationId,
        url,
        error: error instanceof Error ? {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : error 
      }, 'API Error');

      return NextResponse.json(
        { 
          error: 'An unexpected error occurred', 
          message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
          correlationId 
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Standard API success response helper
 */
export function apiResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status }
  );
}
