import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Mock browser APIs that are not available in JSDOM
Object.defineProperty(window, 'btoa', {
  writable: true,
  value: (str: string) => Buffer.from(str, 'utf8').toString('base64'),
});

Object.defineProperty(window, 'atob', {
  writable: true,
  value: (str: string) => Buffer.from(str, 'base64').toString('utf8'),
});

// Mock crypto.subtle for HashTool tests
Object.defineProperty(window, 'crypto', {
  writable: true,
  value: {
    subtle: {
      digest: vi.fn(async (algorithm: string, data: Uint8Array) => {
        // Simple mock implementation for testing
        const hash = new Uint8Array(32);
        for (let i = 0; i < hash.length; i++) {
          hash[i] = data[i % data.length] ^ i;
        }
        return hash.buffer;
      }),
    },
    getRandomValues: vi.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),
  },
});

// Clean up after each test
afterEach(() => {
  cleanup();
});
