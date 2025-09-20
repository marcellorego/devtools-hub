# API Specifications

## Overview
This document outlines the API specifications for the DevTools Hub application. **Note**: This is a frontend-only application with no custom backend APIs. All functionality is implemented using browser APIs and external service calls via the fetch API.

## Architecture Notes
- **Backend**: None required - fully client-side application
- **Data Storage**: Browser localStorage/sessionStorage only
- **External Services**: OpenID Connect endpoints accessed via browser fetch
- **Authentication**: None required
- **Database**: None required

## 1. Component APIs

### 1.1 ToolSelector Component

#### Interface
```typescript
interface ToolSelectorProps {
  activeTool: string;
  onToolSelect: (toolId: string) => void;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}
```

#### Methods
- `onToolSelect(toolId: string)`: Called when user selects a tool
- Internal animation controls for circular layout

#### Events
- `onClick`: Tool selection
- `onMouseEnter/onMouseLeave`: Hover effects

### 1.2 Workspace Component

#### Interface
```typescript
interface WorkspaceProps {
  activeTool: string;
}

interface WorkspaceState {
  isLoading: boolean;
  error: Error | null;
}
```

#### Methods
- `renderTool(toolId: string)`: Dynamically renders selected tool
- `handleTransition()`: Manages page transitions

### 1.3 Tool Components Base Interface

#### Common Interface
```typescript
interface BaseToolProps {
  className?: string;
}

interface ToolState {
  input: string;
  output: string;
  error: string | null;
  isProcessing: boolean;
}
```

#### Required Methods
- `handleInputChange(value: string)`: Process user input
- `handleCopy()`: Copy output to clipboard
- `validateInput(input: string)`: Input validation

## 2. Tool-Specific APIs

### 2.1 JWT Decoder Tool

#### Input/Output Interfaces
```typescript
interface JwtInput {
  token: string;
}

interface JwtOutput {
  header: {
    alg: string;
    typ: string;
    kid?: string;
    [key: string]: any;
  };
  payload: {
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    iat?: number;
    nbf?: number;
    jti?: string;
    [key: string]: any;
  };
  signature: {
    verified: boolean;
    algorithm: string;
    error?: string;
  };
}
```

#### External APIs
- **OpenID Connect Discovery**: `GET /.well-known/openid-configuration`
- **JWKS Endpoint**: `GET /jwks_uri` (from discovery response)

### 2.2 Base64 Tool

#### Input/Output Interfaces
```typescript
interface Base64Input {
  text: string;
  mode: 'encode' | 'decode';
}

interface Base64Output {
  result: string;
  originalLength: number;
  encodedLength: number;
  success: boolean;
  error?: string;
}
```

### 2.3 Epoch Converter Tool

#### Input/Output Interfaces
```typescript
interface EpochInput {
  timestamp: number;
  timezone: string;
  format: 'local' | 'utc';
}

interface EpochOutput {
  local: string;
  utc: string;
  milliseconds: number;
  iso: string;
  relative: string;
}
```

### 2.4 UUID Generator Tool

#### Input/Output Interfaces
```typescript
interface UuidInput {
  version: 1 | 4 | 5;
  namespace?: string; // For v5
  name?: string;     // For v5
}

interface UuidOutput {
  uuid: string;
  version: number;
  variant: string;
  timestamp?: string; // For v1
}
```

### 2.5 Hash Tool

#### Input/Output Interfaces
```typescript
interface HashInput {
  text: string;
  algorithm: 'SHA-256' | 'SHA-1' | 'MD5';
  encoding: 'hex' | 'base64';
}

interface HashOutput {
  hash: string;
  algorithm: string;
  inputLength: number;
  processingTime: number;
}
```

## 3. External Service Integrations

### 3.1 OpenID Connect Integration

#### Discovery Endpoint
```typescript
interface OpenIdConfiguration {
  issuer: string;
  jwks_uri: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  revocation_endpoint: string;
  end_session_endpoint: string;
}
```

#### JWKS Response
```typescript
interface JwksResponse {
  keys: JwkKey[];
}

interface JwkKey {
  kty: string;
  use: string;
  kid: string;
  n: string;
  e: string;
  x5c: string[];
  [key: string]: any;
}
```

### 3.2 Browser APIs

#### Clipboard API
```typescript
interface ClipboardAPI {
  writeText(text: string): Promise<void>;
  readText(): Promise<string>;
}

// Fallback for older browsers
interface DocumentExecCommand {
  execCommand(command: 'copy'): boolean;
}
```

#### Web Crypto API
```typescript
interface WebCrypto {
  subtle: {
    digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer>;
    importKey(format: string, keyData: any, algorithm: any, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>;
    verify(algorithm: any, key: CryptoKey, signature: Uint8Array, data: Uint8Array): Promise<boolean>;
  };
}
```

## 4. State Management API

### 4.1 Global State Interface
```typescript
interface AppState {
  // Navigation
  activeTool: string;

  // UI State
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;

  // User Interactions
  copiedText: string | null;
  lastUsedTool: string;

  // Error Handling
  globalError: Error | null;
  isLoading: boolean;

  // Settings
  autoCopy: boolean;
  soundEnabled: boolean;
}

// Action creators
interface AppActions {
  setActiveTool: (tool: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCopiedText: (text: string | null) => void;
  setGlobalError: (error: Error | null) => void;
  setLoading: (loading: boolean) => void;
}
```

### 4.2 Tool State Interfaces
```typescript
interface ToolState {
  id: string;
  name: string;
  input: string;
  output: string;
  error: string | null;
  isProcessing: boolean;
  lastUsed: Date;
  settings: Record<string, any>;
}
```

## 5. Error Handling API

### 5.1 Error Types
```typescript
enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  PROCESSING = 'processing',
  BROWSER_API = 'browser_api',
  UNKNOWN = 'unknown'
}

interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  tool?: string;
}
```

### 5.2 Error Boundary Interface
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

## 6. Configuration API

### 6.1 Application Configuration
```typescript
interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  api: {
    timeout: number;
    retries: number;
    baseUrl?: string;
  };
  features: {
    jwtVerification: boolean;
    advancedHash: boolean;
    exportFunctionality: boolean;
  };
  limits: {
    maxInputLength: number;
    maxFileSize: number;
    rateLimit: number;
  };
}
```

### 6.2 Tool Configuration
```typescript
interface ToolConfig {
  id: string;
  enabled: boolean;
  priority: number;
  settings: {
    autoProcess: boolean;
    showAdvanced: boolean;
    defaultFormat: string;
  };
}
```

## 7. Testing APIs

### 7.1 Unit Test Interfaces
```typescript
interface TestFixture {
  setup(): Promise<void>;
  teardown(): Promise<void>;
}

interface ToolTestSuite {
  name: string;
  tests: TestCase[];
}

interface TestCase {
  name: string;
  input: any;
  expectedOutput: any;
  shouldFail?: boolean;
}
```

### 7.2 Mock Services
```typescript
interface MockClipboard {
  writeText: jest.MockedFunction<(text: string) => Promise<void>>;
  readText: jest.MockedFunction<() => Promise<string>>;
}

interface MockWebCrypto {
  subtle: {
    digest: jest.MockedFunction<(algorithm: string, data: Uint8Array) => Promise<ArrayBuffer>>;
  };
}
```

## 8. Performance Monitoring API

### 8.1 Metrics Interface
```typescript
interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number;        // Largest Contentful Paint
  fid: number;        // First Input Delay
  cls: number;        // Cumulative Layout Shift

  // Custom metrics
  toolLoadTime: number;
  processingTime: number;
  bundleSize: number;
  memoryUsage: number;
}

interface PerformanceTracker {
  startTracking(metric: string): void;
  endTracking(metric: string): number;
  recordMetric(metric: string, value: number): void;
  getMetrics(): PerformanceMetrics;
}
```

This API specification provides the complete interface definitions needed for implementing the DevTools Hub application.
