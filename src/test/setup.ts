import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Polyfill for webidl-conversions and whatwg-url compatibility
if (typeof globalThis.Map === 'undefined') {
  globalThis.Map = Map;
}
if (typeof globalThis.Set === 'undefined') {
  globalThis.Set = Set;
}
if (typeof globalThis.WeakMap === 'undefined') {
  globalThis.WeakMap = WeakMap;
}
if (typeof globalThis.WeakSet === 'undefined') {
  globalThis.WeakSet = WeakSet;
}

// Fix for webidl-conversions Map issue
if (typeof global !== 'undefined') {
  global.Map = global.Map || Map;
  global.Set = global.Set || Set;
  global.WeakMap = global.WeakMap || WeakMap;
  global.WeakSet = global.WeakSet || WeakSet;
}

// Mock browser APIs that are not available in JSDOM
Object.defineProperty(window, 'btoa', {
  writable: true,
  value: (str: string) => Buffer.from(str, 'utf8').toString('base64'),
});

Object.defineProperty(window, 'atob', {
  writable: true,
  value: (str: string) => Buffer.from(str, 'base64').toString('utf8'),
});

// Mock URL for WHATWG URL compatibility
if (typeof global.URL === 'undefined') {
  global.URL = URL;
}
if (typeof global.URLSearchParams === 'undefined') {
  global.URLSearchParams = URLSearchParams;
}

// Mock fetch for JWT decoder tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
) as typeof fetch;

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
      importKey: vi.fn(async () => ({})),
      verify: vi.fn(async () => false),
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
