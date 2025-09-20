# Development Guide

## Getting Started

### Prerequisites
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher (or pnpm/yarn)
- **Git**: 2.30 or higher
- **VS Code**: Recommended with TypeScript and React extensions

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd devtools-hub

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Project Structure

```
devtools-hub/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ToolSelector.tsx # Circular floating navigation
│   │   └── Workspace.tsx    # Main content area
│   ├── tools/              # Tool-specific components
│   │   ├── Base64Tool.tsx   # Base64 encoder/decoder
│   │   └── ...             # Other tool components
│   ├── hooks/              # Custom React hooks
│   │   └── useClipboard.ts  # Clipboard functionality
│   ├── styles/             # Global styles and animations
│   │   └── globals.css      # Tailwind and custom styles
│   └── App.tsx             # Main application component
├── public/
│   ├── index.html          # HTML template
│   └── _redirects          # SPA routing for GitHub Pages
├── docs/                   # Documentation
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Coding Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Good: Union types for constrained values
type ToolId = 'jwt' | 'base64' | 'url' | 'epoch' | 'uuid' | 'hash';

// ✅ Good: Generic types
interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

// ❌ Avoid: any type
// ❌ Avoid: implicit any
```

#### Component Patterns
```typescript
// ✅ Good: Functional component with proper typing
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        disabled && 'btn-disabled'
      )}
    >
      {children}
    </button>
  );
};
```

### React Best Practices

#### Hooks Usage
```typescript
// ✅ Good: Custom hook for clipboard functionality
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, []);

  return { copyToClipboard, copied };
};

// ✅ Good: Effect cleanup
useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

#### Component Structure
```typescript
// ✅ Good: Clear component structure
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Hooks at the top
  const [state, setState] = useState(initialState);
  const { data, loading } = useApi();

  // 2. Computed values
  const processedData = useMemo(() => {
    return data?.map(item => ({ ...item, processed: true }));
  }, [data]);

  // 3. Event handlers
  const handleSubmit = useCallback(() => {
    // Handle form submission
  }, []);

  // 4. Effects
  useEffect(() => {
    // Side effects
  }, [dependency]);

  // 5. Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // 6. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### Styling Guidelines

#### Tailwind CSS Classes
```typescript
// ✅ Good: Consistent class ordering
<button
  className={clsx(
    // Layout
    'flex items-center justify-center',
    // Spacing
    'px-4 py-2 gap-2',
    // Colors
    'bg-blue-600 text-white',
    // Hover states
    'hover:bg-blue-700',
    // Focus states
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    // Responsive
    'md:px-6 md:py-3',
    // Dark mode
    'dark:bg-blue-500 dark:hover:bg-blue-600'
  )}
>
  Click me
</button>
```

#### Custom CSS Variables
```css
/* styles/globals.css */
:root {
  --color-primary: theme('colors.blue.600');
  --color-secondary: theme('colors.gray.600');
  --spacing-xs: theme('spacing.2');
  --spacing-sm: theme('spacing.4');
  --spacing-md: theme('spacing.6');
}
```

### Error Handling

#### Error Boundaries
```typescript
// ✅ Good: Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

#### Input Validation
```typescript
// ✅ Good: Input validation with proper error handling
export const validateJwt = (token: string): { isValid: boolean; error?: string } => {
  if (!token || typeof token !== 'string') {
    return { isValid: false, error: 'Token is required' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Invalid JWT format' };
  }

  try {
    // Validate each part is valid base64url
    parts.forEach((part, index) => {
      if (!isValidBase64Url(part)) {
        throw new Error(`Invalid ${['header', 'payload', 'signature'][index]}`);
      }
    });
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};
```

## Testing Guidelines

### Unit Tests
```typescript
// ✅ Good: Comprehensive test coverage
describe('Base64Tool', () => {
  beforeEach(() => {
    // Reset any global state
  });

  it('encodes text correctly', () => {
    render(<Base64Tool />);

    const input = screen.getByPlaceholderText('Enter text to encode...');
    const output = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { value: 'Hello World' } });

    expect(output).toHaveValue('SGVsbG8gV29ybGQ=');
  });

  it('handles empty input', () => {
    render(<Base64Tool />);

    const input = screen.getByPlaceholderText('Enter text to encode...');
    const output = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { value: '' } });

    expect(output).toHaveValue('');
  });

  it('shows error for invalid base64 in decode mode', () => {
    render(<Base64Tool />);

    // Switch to decode mode
    const modeButton = screen.getByText('Decoding Mode');
    fireEvent.click(modeButton);

    const input = screen.getByPlaceholderText('Enter Base64 to decode...');
    fireEvent.change(input, { target: { value: 'invalid!!!' } });

    expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe('Tool Navigation', () => {
  it('switches between tools correctly', () => {
    render(<App />);

    // Click on Base64 tool
    const base64Tool = screen.getByLabelText('Base64');
    fireEvent.click(base64Tool);

    expect(screen.getByText('Base64 Transformer')).toBeInTheDocument();

    // Click on JWT tool
    const jwtTool = screen.getByLabelText('JWT Decoder');
    fireEvent.click(jwtTool);

    expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting
```typescript
// ✅ Good: Lazy loading for tools
const JwtDecoder = lazy(() => import('./tools/JwtDecoder'));
const Base64Tool = lazy(() => import('./tools/Base64Tool'));

// In component
<Suspense fallback={<LoadingSpinner />}>
  {activeTool === 'jwt' && <JwtDecoder />}
  {activeTool === 'base64' && <Base64Tool />}
</Suspense>
```

### Memoization
```typescript
// ✅ Good: Memoize expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(data);
}, [data]);

// ✅ Good: Memoize callbacks
const handleSubmit = useCallback((formData) => {
  onSubmit(formData);
}, [onSubmit]);
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/static/js/*.js

# Check for unused dependencies
npx depcheck

# Analyze performance
npm run lighthouse
```

## Git Workflow

### Branch Naming
```
feature/tool-jwt-decoder
fix/base64-encoding-bug
docs/update-readme
refactor/component-structure
test/add-unit-tests
chore/update-dependencies
```

### Commit Messages
```
feat(jwt): add signature verification with JWKS
fix(base64): handle invalid characters gracefully
docs(readme): add installation instructions
style(button): update hover effects
refactor(tools): extract common validation logic
test(utils): add input validation tests
chore(deps): update React to v18.2.0
```

### Pull Request Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
<!-- Add screenshots of UI changes -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

## Deployment

### Environment Setup
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables (Optional)
```bash
# .env.local - Only needed for analytics or external services
VITE_ENVIRONMENT=development
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID  # Optional
```

### GitHub Pages Deployment (Primary)

#### Automatic Deployment via GitHub Actions
1. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Push to main branch** - deployment happens automatically via the workflow

3. **Access your site** at: `https://[username].github.io/[repository-name]`

#### Manual Deployment (if needed)
```bash
# Install gh-pages package globally
npm install -g gh-pages

# Build and deploy manually
npm run build
npx gh-pages -d dist
```

#### Custom Domain Setup
1. Go to repository Settings → Pages
2. Add your custom domain
3. Configure DNS records as instructed
4. GitHub will automatically provision SSL certificate

### Alternative Options (if needed)

#### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

## Monitoring & Debugging

### Browser DevTools
- **React DevTools**: Inspect component tree and state
- **Network tab**: Monitor API calls and performance
- **Console**: Check for errors and warnings
- **Performance tab**: Analyze runtime performance

### Debugging Tips
```typescript
// ✅ Good: Descriptive console logs
console.log('🔍 [Base64Tool] Processing input:', input);

// ✅ Good: Error boundaries for debugging
if (process.env.NODE_ENV === 'development') {
  console.error('❌ [ErrorBoundary] Caught error:', error);
}
```

### Performance Monitoring
```typescript
// ✅ Good: Performance tracking
const startTime = performance.now();
// ... operation ...
const endTime = performance.now();
console.log(`⚡ Operation took ${endTime - startTime}ms`);
```

## Security Best Practices

### Input Sanitization
```typescript
// ✅ Good: Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML
    .trim() // Remove whitespace
    .slice(0, 1000); // Limit length
};
```

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.well-known/;
">
```

This development guide provides the standards and practices for building and maintaining the DevTools Hub application.
