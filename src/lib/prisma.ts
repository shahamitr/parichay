import { PrismaClient } from '../generated/prisma';
import logger from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
  // Connection pooling configuration
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Log slow queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    if (e.duration > 1000) {
      logger.warn({
        query: e.query,
        duration: e.duration,
      }, 'Slow query detected');
    }
  });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;