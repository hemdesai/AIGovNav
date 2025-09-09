import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        'dist/',
        'qa/'
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60
      }
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'qa'],
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@backend': path.resolve(__dirname, './src/backend'),
      '@frontend': path.resolve(__dirname, './src/frontend'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  }
});