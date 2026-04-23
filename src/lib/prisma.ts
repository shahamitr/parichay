import { PrismaClient } from '../generated/prisma';
import logger from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaInitialized: boolean | undefined;
};

// Create Prisma client only once
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['error', 'warn'] // Removed 'query' to reduce noise
      : ['error'],
    // Connection pooling configuration
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Log slow queries in development - only register once
  if (process.env.NODE_ENV === 'development') {
    client.$on('query' as never, (e: any) => {
      if (e.duration > 1000) {
        logger.warn({
          query: e.query,
          duration: e.duration,
        }, 'Slow query detected');
      }
    });
  }

  return client;
}

// Use existing client or create new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Store in global to prevent multiple instances during hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}