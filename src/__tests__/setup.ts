/**
 * Vitest Setup File
 * Runs before all tests. Configures testing environment.
 */

import '@testing-library/jest-dom/vitest';

// Mock environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long-for-tests';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';
