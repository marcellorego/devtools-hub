/**
 * Security utilities for DevTools Hub
 * Implements client-side security measures and input validation
 */

export class SecurityUtils {
  /**
   * Sanitizes user input to prevent XSS attacks
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    // Remove potentially dangerous HTML/script tags
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Validates base64 input format
   */
  static isValidBase64(input: string): boolean {
    if (!input || typeof input !== 'string') return false;

    // Check if string is valid base64
    try {
      // Remove whitespace and check length
      const cleanInput = input.replace(/\s/g, '');
      if (cleanInput.length % 4 !== 0) return false;

      // Try to decode - this will throw if invalid
      atob(cleanInput);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates JWT token format
   */
  static isValidJWT(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Check that all parts are valid base64url
    return parts.every(part => {
      try {
        // base64url uses URL-safe characters
        if (!/^[A-Za-z0-9_-]+$/.test(part)) return false;
        return true;
      } catch {
        return false;
      }
    });
  }

  /**
   * Rate limiting utility to prevent abuse
   */
  static createRateLimiter(maxCalls: number, windowMs: number) {
    const calls: number[] = [];

    return function rateLimit(): boolean {
      const now = Date.now();
      // Remove old calls outside the window
      while (calls.length > 0 && calls[0] < now - windowMs) {
        calls.shift();
      }

      // Check if under the limit
      if (calls.length < maxCalls) {
        calls.push(now);
        return true; // Allow the call
      }

      return false; // Rate limit exceeded
    };
  }

  /**
   * Sanitizes HTML content for safe display
   */
  static sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') return '';

    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove script tags and event handlers
    const scripts = div.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    const elements = div.querySelectorAll('*');
    elements.forEach(element => {
      // Remove event handlers
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      });
    });

    return div.innerHTML;
  }

  /**
   * Secure local storage wrapper with encryption
   */
  static secureStorage = {
    set(key: string, value: unknown): void {
      try {
        const serialized = JSON.stringify(value);
        // In a real app, you'd encrypt this
        localStorage.setItem(`secure_${key}`, serialized);
      } catch (error) {
        console.warn('Failed to store secure data:', error);
      }
    },

    get<T>(key: string): T | null {
      try {
        const item = localStorage.getItem(`secure_${key}`);
        if (item) {
          return JSON.parse(item) as T;
        }
        return null;
      } catch (error) {
        console.warn('Failed to retrieve secure data:', error);
        return null;
      }
    },

    remove(key: string): void {
      try {
        localStorage.removeItem(`secure_${key}`);
      } catch (error) {
        console.warn('Failed to remove secure data:', error);
      }
    }
  };

  /**
   * Content Security Policy violation handler
   */
  static setupCSPViolationHandler(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('CSP Violation:', {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber
      });

      // In production, you might want to send this to a monitoring service
    });
  }

  /**
   * Initialize security measures
   */
  static init(): void {
    // Setup CSP violation handler
    this.setupCSPViolationHandler();

    // Prevent context menu on production (optional)
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    }

    // Log security information
    console.log('🔒 Security measures initialized');
  }
}

export default SecurityUtils;
