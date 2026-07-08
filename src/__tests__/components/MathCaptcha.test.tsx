import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MathCaptcha from '@/components/ui/MathCaptcha';

describe('MathCaptcha Component', () => {
  it('should render the captcha challenge', () => {
    const onVerify = vi.fn();
    render(<MathCaptcha onVerify={onVerify} />);

    expect(screen.getByText('Security Check *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('?')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('should call onVerify(false) initially', () => {
    const onVerify = vi.fn();
    render(<MathCaptcha onVerify={onVerify} />);
    expect(onVerify).toHaveBeenCalledWith(false);
  });

  it('should show error for wrong answer', () => {
    const onVerify = vi.fn();
    render(<MathCaptcha onVerify={onVerify} />);

    const input = screen.getByPlaceholderText('?');
    fireEvent.change(input, { target: { value: '999' } });

    expect(screen.getByText(/Incorrect answer/)).toBeInTheDocument();
    expect(onVerify).toHaveBeenLastCalledWith(false);
  });

  it('should have a refresh button', () => {
    const onVerify = vi.fn();
    render(<MathCaptcha onVerify={onVerify} />);
    expect(screen.getByTitle('Generate new question')).toBeInTheDocument();
  });
});
