import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EpochConverter } from '../tools/EpochConverter';

// Mock the useClipboard hook
vi.mock('../hooks/useClipboard', () => ({
  useClipboard: () => ({
    copyToClipboard: vi.fn(),
    copied: false,
  }),
}));

describe('EpochConverter', () => {
  it('renders correctly', () => {
    render(<EpochConverter />);
    expect(screen.getByText('Time Converter')).toBeInTheDocument();
    expect(screen.getByText('Timestamp → Date')).toBeInTheDocument();
  });

  it('converts epoch to date', async () => {
    render(<EpochConverter />);

    // Find input by looking for an input with placeholder containing "1704067200"
    const input = screen.getByPlaceholderText((content) => content.includes('1704067200'));
    fireEvent.change(input, { target: { value: '1704067200' } });

    await waitFor(() => {
      // Should show date output in the result area
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });
  });

  it('converts date to epoch', async () => {
    render(<EpochConverter />);

    // Switch to date to epoch mode
    const modeButton = screen.getByText('Timestamp → Date');
    fireEvent.click(modeButton);

    const input = screen.getByPlaceholderText((content) => content.includes('2024-01-01 00:00:00'));
    fireEvent.change(input, { target: { value: '2024-01-01 00:00:00' } });

    await waitFor(() => {
      // Should show epoch timestamp output
      expect(screen.getByText(/^\d+$/)).toBeInTheDocument();
    });
  });

  it('handles timezone selection', () => {
    render(<EpochConverter />);

    const timezoneSelect = screen.getByDisplayValue('Local');
    expect(timezoneSelect).toBeInTheDocument();

    fireEvent.change(timezoneSelect, { target: { value: 'utc' } });
    expect(screen.getByDisplayValue('UTC')).toBeInTheDocument();
  });

  it('toggles milliseconds precision', () => {
    render(<EpochConverter />);

    const checkbox = screen.getByLabelText('Milliseconds');
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('shows current timestamp', () => {
    render(<EpochConverter />);

    const nowButton = screen.getByText('Now (Epoch)');
    expect(nowButton).toBeInTheDocument();

    fireEvent.click(nowButton);
    // Should populate input with current timestamp
    const input = screen.getByPlaceholderText((content) => content.includes('1704067200'));
    expect(input.value).toMatch(/^\d+$/); // Should be a numeric timestamp
  });

  it('shows current date', () => {
    render(<EpochConverter />);

    // Switch to date to epoch mode
    const modeButton = screen.getByText('Timestamp → Date');
    fireEvent.click(modeButton);

    const nowButton = screen.getByText('Now (Date)');
    expect(nowButton).toBeInTheDocument();

    fireEvent.click(nowButton);
    // Should populate input with current date
    const input = screen.getByPlaceholderText((content) => content.includes('2024-01-01 00:00:00'));
    expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}/); // Should be a date format
  });

  it('handles invalid input gracefully', async () => {
    render(<EpochConverter />);

    const input = screen.getByPlaceholderText((content) => content.includes('1704067200'));
    fireEvent.change(input, { target: { value: 'invalid' } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid/)).toBeInTheDocument();
    });
  });

  it('toggles between modes', () => {
    render(<EpochConverter />);

    const modeButton = screen.getByText('Timestamp → Date');
    expect(modeButton).toBeInTheDocument();

    fireEvent.click(modeButton);
    expect(screen.getByText('Date → Timestamp')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Date → Timestamp'));
    expect(screen.getByText('Timestamp → Date')).toBeInTheDocument();
  });
});
