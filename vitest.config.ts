/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    // CI-friendly configuration
    testTimeout: 10000, // 10 seconds for individual tests
    hookTimeout: 10000, // 10 seconds for hooks
    globals: true,
    // Retry flaky tests in CI
    retry: process.env.CI ? 2 : 0,
    // Additional environment configuration for CI stability
    // happy-dom doesn't need specific environment options
    // Pool options for better CI compatibility
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: process.env.CI ? true : false,
      },
    },
    // Try to exclude problematic dependencies
    server: {
      deps: {
        // Force include problematic modules for proper handling
        inline: ['whatwg-url', 'webidl-conversions'],
      },
    },
  },
  // Node.js polyfills for better compatibility
  define: {
    global: 'globalThis',
  },
})
