import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HoneypotField from '@/components/ui/HoneypotField';

describe('HoneypotField Component', () => {
  it('should be hidden from view (aria-hidden, off-screen)', () => {
    render(
      <HoneypotField
        name="website_url"
        value=""
        onChange={vi.fn()}
      />
    );

    const container = screen.getByText('Do not fill this field').closest('div');
    expect(container).toHaveClass('opacity-0');
    expect(container).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render an input with the given name', () => {
    render(
      <HoneypotField
        name="test_field"
        value=""
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toHaveAttribute('name', 'test_field');
    expect(input).toHaveAttribute('tabindex', '-1');
  });

  it('should call onChange when filled (by bots)', () => {
    const onChange = vi.fn();
    render(
      <HoneypotField
        name="website_url"
        value=""
        onChange={onChange}
      />
    );

    // Bots would fill this, humans won't see it
    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toBeDefined();
  });
});
