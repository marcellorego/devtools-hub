import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UuidGenerator } from '../tools/UuidGenerator';

// Mock the useClipboard hook
vi.mock('../hooks/useClipboard', () => ({
  useClipboard: () => ({
    copyToClipboard: vi.fn(),
    copied: false,
  }),
}));

describe('UuidGenerator', () => {
  it('renders correctly', () => {
    render(<UuidGenerator />);
    expect(screen.getByText('UUID Generator')).toBeInTheDocument();
    expect(screen.getByText('UUID v4 (Random)')).toBeInTheDocument();
  });

  it('generates UUID v4 by default', () => {
    render(<UuidGenerator />);

    const generateButton = screen.getByText('Generate UUID V4');
    expect(generateButton).toBeInTheDocument();

    fireEvent.click(generateButton);

    // Should show generated UUID
    const uuidOutput = screen.getByText(/^[^-]+-[^-]+-[^-]+-[^-]+-[^-]+$/);
    expect(uuidOutput).toBeInTheDocument();
  });

  it('switches between v4 and v5 modes', () => {
    render(<UuidGenerator />);

    // Should start in v4 mode
    expect(screen.getByText('UUID v4 (Random)')).toHaveClass('bg-gradient-to-r');

    // Switch to v5 mode
    const v5Button = screen.getByText('UUID v5 (Name-based)');
    fireEvent.click(v5Button);

    expect(screen.getByText('UUID v5 (Name-based)')).toHaveClass('bg-gradient-to-r');
    expect(screen.getByText('Generate UUID V5')).toBeInTheDocument();
  });

  it('shows v5 configuration options', () => {
    render(<UuidGenerator />);

    // Switch to v5 mode
    const v5Button = screen.getByText('UUID v5 (Name-based)');
    fireEvent.click(v5Button);

    // Should show namespace input
    expect(screen.getByPlaceholderText('e.g., 6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., example.com')).toBeInTheDocument();
  });

  it('generates UUID v5 with custom inputs', () => {
    render(<UuidGenerator />);

    // Switch to v5 mode
    const v5Button = screen.getByText('UUID v5 (Name-based)');
    fireEvent.click(v5Button);

    // Set custom namespace and name
    const namespaceInput = screen.getByPlaceholderText('e.g., 6ba7b810-9dad-11d1-80b4-00c04fd430c8');
    const nameInput = screen.getByPlaceholderText('e.g., example.com');

    fireEvent.change(namespaceInput, { target: { value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' } });
    fireEvent.change(nameInput, { target: { value: 'test.example.com' } });

    // Generate UUID
    const generateButton = screen.getByText('Generate UUID V5');
    fireEvent.click(generateButton);

    // Should show generated UUID
    const uuidOutput = screen.getByText(/^[^-]+-[^-]+-[^-]+-[^-]+-[^-]+$/);
    expect(uuidOutput).toBeInTheDocument();
  });

  it('shows generation timestamp', () => {
    render(<UuidGenerator />);

    const generateButton = screen.getByText('Generate UUID V4');
    fireEvent.click(generateButton);

    // Should show timestamp
    expect(screen.getByText(/Generated at:/)).toBeInTheDocument();
  });

  it('displays UUID in proper format', () => {
    render(<UuidGenerator />);

    const generateButton = screen.getByText('Generate UUID V4');
    fireEvent.click(generateButton);

    // UUID should be in standard format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuidOutput = screen.getByText(uuidRegex);
    expect(uuidOutput).toBeInTheDocument();
  });

  it('shows helpful namespace examples', () => {
    render(<UuidGenerator />);

    // Switch to v5 mode
    const v5Button = screen.getByText('UUID v5 (Name-based)');
    fireEvent.click(v5Button);

    // Should show namespace examples
    expect(screen.getByText(/DNS:/)).toBeInTheDocument();
    expect(screen.getByText(/URL:/)).toBeInTheDocument();
  });
});
