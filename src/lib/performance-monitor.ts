import logger from './logger';

/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  correlationId?: string;
  metadata?: Record<string, any>;
}

/**
 * Track performance metrics
 */
export function trackPerformance(metric: PerformanceMetric): void {
  logger.info({
    type: 'PERFORMANCE',
    metric: metric.name,
    duration: metric.duration,
    correlationId: metric.correlationId,
    metadata: metric.metadata,
  }, `Performance: ${metric.name} took ${metric.duration}ms`);

  // In production, send to monitoring service (e.g., New Relic, DataDog)
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to monitoring service
  }
}

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private startTime: number;
  private name: string;
  private correlationId?: string;
  private metadata?: Record<string, any>;

  constructor(name: string, correlationId?: string, metadata?: Record<string, any>) {
    this.name = name;
    this.correlationId = correlationId;
    this.metadata = metadata;
    this.startTime = Date.now();
  }

  /**
   * End timer and track performance
   */
  end(): number {
    const duration = Date.now() - this.startTime;
    trackPerformance({
      name: this.name,
      duration,
      correlationId: this.correlationId,
      metadata: this.metadata,
    });
    return duration;
  }
}

/**
 * Measure async function performance
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  correlationId?: string
): Promise<T> {
  const timer = new PerformanceTimer(name, correlationId);
  try {
    const result = await fn();
    timer.end();
    return result;
  } catch (error) {
    timer.end();
    throw error;
  }
}
