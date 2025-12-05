import logger from './logger';

/**
 * Error tracking and monitoring
 * This is a placeholder for Sentry or similar error tracking service
 */

interface ErrorContext {
  userId?: string;
  correlationId?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
}

/**
 * Capture and track errors
 */
export function captureError(error: Error, context?: ErrorContext): void {
  // Log error with context
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context,
  }, 'Error captured');

  // In production, send to Sentry or similar service
  if (process.env.SENTRY_DSN) {
    // Example Sentry integration (requires @sentry/nextjs package):
    // Sentry.captureException(error, {
    //   user: context?.userId ? { id: context.userId } : undefined,
    //   tags: {
    //     correlationId: context?.correlationId,
    //   },
    //   extra: context?.metadata,
    // });
  }
}

/**
 * Capture message for tracking
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
  // Map 'warning' to 'warn' for logger
  const logLevel = level === 'warning' ? 'warn' : level;
  logger[logLevel]({ context }, message);

  // In production, send to Sentry
  if (process.env.SENTRY_DSN) {
    // Sentry.captureMessage(message, level);
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string): void {
  // In production, set user context in Sentry
  if (process.env.SENTRY_DSN) {
    // Sentry.setUser({ id: userId, email });
  }
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  // In production, clear user context in Sentry
  if (process.env.SENTRY_DSN) {
    // Sentry.setUser(null);
  }
}
