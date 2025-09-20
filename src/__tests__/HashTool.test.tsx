import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HashTool } from '../tools/HashTool';

// Mock the useClipboard hook
vi.mock('../hooks/useClipboard', () => ({
  useClipboard: () => ({
    copyToClipboard: vi.fn(),
    copied: false,
  }),
}));

describe('HashTool', () => {
  it('renders correctly', () => {
    render(<HashTool />);
    expect(screen.getByText('Hash Tool')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SHA-256')).toBeInTheDocument();
  });

  it('supports all hash algorithms', () => {
    render(<HashTool />);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const select = screen.getByDisplayValue('SHA-256');

    algorithms.forEach(algorithm => {
      fireEvent.change(select, { target: { value: algorithm } });
      expect(screen.getByDisplayValue(algorithm)).toBeInTheDocument();
    });
  });

  it('shows algorithm name in output header', () => {
    render(<HashTool />);

    expect(screen.getByText('SHA-256 Hash (Hex)')).toBeInTheDocument();

    const select = screen.getByDisplayValue('SHA-256');
    fireEvent.change(select, { target: { value: 'SHA-1' } });

    expect(screen.getByText('SHA-1 Hash (Hex)')).toBeInTheDocument();
  });

  it('handles empty input', () => {
    render(<HashTool />);

    const input = screen.getByPlaceholderText('Enter text to hash...');
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText('Hash will appear here...')).toBeInTheDocument();
  });

  it('shows input text', () => {
    render(<HashTool />);

    const input = screen.getByPlaceholderText('Enter text to hash...');
    fireEvent.change(input, { target: { value: 'test input' } });

    expect(input).toHaveValue('test input');
  });
});
