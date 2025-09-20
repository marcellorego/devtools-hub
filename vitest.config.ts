/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // CI-friendly configuration
    testTimeout: 10000, // 10 seconds for individual tests
    hookTimeout: 10000, // 10 seconds for hooks
    globals: true,
    // Retry flaky tests in CI
    retry: process.env.CI ? 2 : 0,
    // Additional environment configuration for CI stability
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously',
      },
    },
    // Pool options for better CI compatibility
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: process.env.CI ? true : false,
      },
    },
  },
})
