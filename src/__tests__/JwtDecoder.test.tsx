import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JwtDecoder } from '../tools/JwtDecoder';

// Mock the useClipboard hook
vi.mock('../hooks/useClipboard', () => ({
  useClipboard: () => ({
    copyToClipboard: vi.fn(),
    copied: false,
  }),
}));

describe('JwtDecoder', () => {
  it('renders correctly', () => {
    render(<JwtDecoder />);
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
    expect(screen.getByText('Paste your JWT token below')).toBeInTheDocument();
  });

  it('decodes valid JWT token', async () => {
    render(<JwtDecoder />);

    // A simple JWT token for testing: header.payload.signature
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: testToken } });

    await waitFor(() => {
      // Should show decoded header
      expect(screen.getByText(/Header/)).toBeInTheDocument();
      expect(screen.getByText(/Payload/)).toBeInTheDocument();
    });
  });

  it('shows decoded header correctly', async () => {
    render(<JwtDecoder />);

    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: testToken } });

    await waitFor(() => {
      // Should show decoded header content
      expect(screen.getByText(/alg.*HS256/)).toBeInTheDocument();
      expect(screen.getByText(/typ.*JWT/)).toBeInTheDocument();
    });
  });

  it('shows decoded payload correctly', async () => {
    render(<JwtDecoder />);

    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: testToken } });

    await waitFor(() => {
      // Should show decoded payload content
      expect(screen.getByText(/sub.*1234567890/)).toBeInTheDocument();
      expect(screen.getByText(/name.*John Doe/)).toBeInTheDocument();
    });
  });

  it('handles invalid JWT format', async () => {
    render(<JwtDecoder />);

    const invalidToken = 'invalid.jwt.token';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: invalidToken } });

    await waitFor(() => {
      // Should show error message
      expect(screen.getByText(/Invalid JWT/)).toBeInTheDocument();
    });
  });

  it('handles malformed base64', async () => {
    render(<JwtDecoder />);

    const malformedToken = 'invalid!base64.header.invalid!base64.payload.signature';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: malformedToken } });

    await waitFor(() => {
      // Should show error message
      expect(screen.getByText(/Invalid/)).toBeInTheDocument();
    });
  });

  it('shows signature verification section', async () => {
    render(<JwtDecoder />);

    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: testToken } });

    await waitFor(() => {
      // Should show signature section
      expect(screen.getByText(/Signature/)).toBeInTheDocument();
    });
  });

  it('displays token parts visually', async () => {
    render(<JwtDecoder />);

    const testToken = 'header.payload.signature';

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: testToken } });

    await waitFor(() => {
      // Should show the three parts of the token
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('payload')).toBeInTheDocument();
      expect(screen.getByText('signature')).toBeInTheDocument();
    });
  });

  it('handles empty input gracefully', () => {
    render(<JwtDecoder />);

    const input = screen.getByPlaceholderText('Paste your JWT token here (header.payload.signature)...');
    fireEvent.change(input, { target: { value: '' } });

    // Should show placeholder content
    expect(screen.getByText('Paste your JWT token below')).toBeInTheDocument();
  });
});
