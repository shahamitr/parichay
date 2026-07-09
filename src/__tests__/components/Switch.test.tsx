import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '@/components/ui/Switch';

describe('Switch Component', () => {
  it('should render with unchecked state', () => {
    render(<Switch checked={false} onCheckedChange={vi.fn()} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('should render with checked state', () => {
    render(<Switch checked={true} onCheckedChange={vi.fn()} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onCheckedChange when clicked', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should toggle from true to false', () => {
    const onChange = vi.fn();
    render(<Switch checked={true} onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should not fire when disabled', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} disabled />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render label when provided', () => {
    render(<Switch checked={false} onCheckedChange={vi.fn()} label="Enable feature" />);
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });
});
