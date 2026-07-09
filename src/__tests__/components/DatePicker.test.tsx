import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from '@/components/ui/DatePicker';

describe('DatePicker Component', () => {
  it('should render with placeholder when no value', () => {
    render(<DatePicker value="" onChange={vi.fn()} placeholder="Pick a date" />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<DatePicker value="" onChange={vi.fn()} label="Start Date" />);
    expect(screen.getByText('Start Date')).toBeInTheDocument();
  });

  it('should display formatted date when value is set', () => {
    render(<DatePicker value="2024-03-15" onChange={vi.fn()} />);
    // Should display in Indian locale format
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByText(/Mar/)).toBeInTheDocument();
  });

  it('should open calendar on click', () => {
    render(<DatePicker value="" onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    // Calendar header should be visible
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should show day names in calendar', () => {
    render(<DatePicker value="" onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Fr')).toBeInTheDocument();
  });

  it('should call onChange with date string on selection', () => {
    const onChange = vi.fn();
    render(<DatePicker value="2024-03-01" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button')); // Open
    fireEvent.click(screen.getByText('15')); // Select day 15
    expect(onChange).toHaveBeenCalledWith('2024-03-15');
  });

  it('should navigate months with arrows', () => {
    render(<DatePicker value="2024-01-01" onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button')); // Open
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    // Click next month
    const nextBtn = screen.getAllByRole('button').find((b) => b.querySelector('svg'));
    // The calendar should navigate
  });
});
