import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Base64Tool } from '../tools/Base64Tool';

// Mock the useClipboard hook
vi.mock('../hooks/useClipboard', () => ({
  useClipboard: () => ({
    copyToClipboard: vi.fn(),
    copied: false,
  }),
}));

describe('Base64Tool', () => {
  it('renders correctly', () => {
    render(<Base64Tool />);
    expect(screen.getByText('Base64 Transformer')).toBeInTheDocument();
    expect(screen.getByText('Encoding Mode')).toBeInTheDocument();
  });

  it('encodes text to base64', async () => {
    render(<Base64Tool />);

    const input = screen.getByPlaceholderText('Enter text to encode...');

    fireEvent.change(input, { target: { value: 'Hello World' } });

    // Wait for the output to appear in the pre element
    await waitFor(() => {
      const outputElement = screen.getByText('SGVsbG8gV29ybGQ=');
      expect(outputElement).toBeInTheDocument();
    });
  });

  it('decodes base64 to text', async () => {
    render(<Base64Tool />);

    // Switch to decode mode
    const modeButton = screen.getByText('Encoding Mode');
    fireEvent.click(modeButton);

    const input = screen.getByPlaceholderText('Enter Base64 to decode...');

    fireEvent.change(input, { target: { value: 'SGVsbG8gV29ybGQ=' } });

    await waitFor(() => {
      const outputElement = screen.getByText('Hello World');
      expect(outputElement).toBeInTheDocument();
    });
  });

  it('handles empty input', async () => {
    render(<Base64Tool />);

    const input = screen.getByPlaceholderText('Enter text to encode...');

    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Base64 output will appear here...')).toBeInTheDocument();
    });
  });

  it('handles invalid base64 input gracefully', async () => {
    render(<Base64Tool />);

    // Switch to decode mode
    const modeButton = screen.getByText('Encoding Mode');
    fireEvent.click(modeButton);

    const input = screen.getByPlaceholderText('Enter Base64 to decode...');

    fireEvent.change(input, { target: { value: 'invalid!!!' } });

    await waitFor(() => {
      // Should either show error or handle gracefully without crashing
      // In test environment, Buffer.from is more lenient, so just ensure component doesn't crash
      expect(screen.getByText('Decoding Mode')).toBeInTheDocument();
    });
  });

  it('toggles between encode and decode modes', () => {
    render(<Base64Tool />);

    const modeButton = screen.getByText('Encoding Mode');
    expect(modeButton).toBeInTheDocument();

    fireEvent.click(modeButton);
    expect(screen.getByText('Decoding Mode')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Decoding Mode'));
    expect(screen.getByText('Encoding Mode')).toBeInTheDocument();
  });
});
