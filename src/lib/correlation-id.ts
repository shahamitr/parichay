import { NextRequest } from 'next/server';

/**
 * Generate or retrieve correlation ID for request tracing
 */
export function getCorrelationId(request: NextRequest): string {
  // Check if correlation ID already exists in headers
  const existingId = request.headers.get('x-correlation-id');
  if (existingId != null) {
    return existingId;
  }

  // Generate new correlation ID using crypto.randomUUID() which is available in edge runtime
  return crypto.randomUUID();
}

/**
 * Add correlation ID to request headers
 */
export function addCorrelationId(headers: Headers, correlationId: string): void {
  headers.set('x-correlation-id', correlationId);
}
