/**
 * Simple structured logging
 */
class Logger {
  private correlationId?: string;

  constructor(correlationId?: string) {
    this.correlationId = correlationId;
  }

  private formatMessage(level: string, messageOrData: string | Record<string, any>, data?: any) {
    const timestamp = new Date().toISOString();

    // Support both patterns: (message, data) and (data, message)
    let message: string;
    let logData: Record<string, any>;

    if (typeof messageOrData === 'string') {
      // Pattern: (message: string, data?: any)
      message = messageOrData;
      logData = {
        timestamp,
        level,
        message,
        ...(this.correlationId && { correlationId: this.correlationId }),
        ...(data && { data }),
      };
    } else {
      // Pattern: (data: object, message?: string)
      message = (typeof data === 'string') ? data : '';
      logData = {
        timestamp,
        level,
        ...(message && { message }),
        ...(this.correlationId && { correlationId: this.correlationId }),
        ...messageOrData,
      };
    }

    return JSON.stringify(logData);
  }

  trace(messageOrData: string | Record<string, any>, data?: any) {
    if (process.env.LOG_LEVEL === 'trace') {
      console.log(this.formatMessage('trace', messageOrData, data));
    }
  }

  debug(messageOrData: string | Record<string, any>, data?: any) {
    if (process.env.LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'trace') {
      console.log(this.formatMessage('debug', messageOrData, data));
    }
  }

  info(messageOrData: string | Record<string, any>, data?: any) {
    console.log(this.formatMessage('info', messageOrData, data));
  }

  warn(messageOrData: string | Record<string, any>, data?: any) {
    console.warn(this.formatMessage('warn', messageOrData, data));
  }

  error(messageOrData: string | Record<string, any>, data?: any) {
    console.error(this.formatMessage('error', messageOrData, data));
  }

  fatal(messageOrData: string | Record<string, any>, data?: any) {
    console.error(this.formatMessage('fatal', messageOrData, data));
  }

  child(options: { correlationId: string }) {
    return new Logger(options.correlationId);
  }
}

const logger = new Logger();

/**
 * Create a child logger with correlation ID
 */
export function createLogger(correlationId?: string) {
  if (correlationId != null) {
    return logger.child({ correlationId });
  }
  return logger;
}

/**
 * Log levels:
 * - trace: Very detailed logs
 * - debug: Debug information
 * - info: General information
 * - warn: Warning messages
 * - error: Error messages
 * - fatal: Fatal errors
 */
export default logger;
