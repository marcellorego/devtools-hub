import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UrlCoder } from '../tools/UrlCoder';

// Mock the useClipboard hook
vi.mock('../hooks/useClipboard', () => ({
  useClipboard: () => ({
    copyToClipboard: vi.fn(),
    copied: false,
  }),
}));

describe('UrlCoder', () => {
  it('renders correctly', () => {
    render(<UrlCoder />);
    expect(screen.getByText('URL Coder')).toBeInTheDocument();
    expect(screen.getByText('Encoding Mode')).toBeInTheDocument();
  });

  it('encodes URLs correctly', async () => {
    render(<UrlCoder />);

    const input = screen.getByPlaceholderText('Enter URL to encode (e.g., https://example.com/path?query=value&other=123)');

    fireEvent.change(input, { target: { value: 'https://example.com/path?query=value&other=123' } });

    await waitFor(() => {
      const output = screen.getByText('https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue%26other%3D123');
      expect(output).toBeInTheDocument();
    });
  });

  it('decodes URLs correctly', async () => {
    render(<UrlCoder />);

    // Switch to decode mode
    const modeButton = screen.getByText('Encoding Mode');
    fireEvent.click(modeButton);

    const input = screen.getByPlaceholderText('Enter encoded URL to decode (e.g., https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue%26other%3D123)');

    fireEvent.change(input, { target: { value: 'https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue%26other%3D123' } });

    await waitFor(() => {
      const output = screen.getByText('https://example.com/path?query=value&other=123');
      expect(output).toBeInTheDocument();
    });
  });

  it('handles special characters', async () => {
    render(<UrlCoder />);

    const input = screen.getByPlaceholderText('Enter URL to encode (e.g., https://example.com/path?query=value&other=123)');

    fireEvent.change(input, { target: { value: 'Hello World!' } });

    await waitFor(() => {
      const output = screen.getByText('Hello%20World!');
      expect(output).toBeInTheDocument();
    });
  });

  it('toggles between encode and decode modes', () => {
    render(<UrlCoder />);

    expect(screen.getByText('Encoding Mode')).toBeInTheDocument();
    expect(screen.getByText('Original URL')).toBeInTheDocument();

    const modeButton = screen.getByText('Encoding Mode');
    fireEvent.click(modeButton);

    expect(screen.getByText('Decoding Mode')).toBeInTheDocument();
    expect(screen.getByText('Encoded URL')).toBeInTheDocument();
  });

  it('handles empty input', async () => {
    render(<UrlCoder />);

    const input = screen.getByPlaceholderText('Enter URL to encode (e.g., https://example.com/path?query=value&other=123)');

    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      // Should show placeholder text when empty
      const placeholder = screen.getByText('Encoded URL will appear here...');
      expect(placeholder).toBeInTheDocument();
    });
  });

  it('shows error for invalid decode input', async () => {
    render(<UrlCoder />);

    // Switch to decode mode
    const modeButton = screen.getByText('Encoding Mode');
    fireEvent.click(modeButton);

    const input = screen.getByPlaceholderText('Enter encoded URL to decode (e.g., https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue%26other%3D123)');

    fireEvent.change(input, { target: { value: '%' } });

    await waitFor(() => {
      expect(screen.getByText('Invalid input for decode operation')).toBeInTheDocument();
    });
  });
});
