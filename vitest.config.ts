import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', '__tests__/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
