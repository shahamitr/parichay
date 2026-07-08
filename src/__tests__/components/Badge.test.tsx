import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('should render children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should apply success variant styles', () => {
    render(<Badge variant="success">Verified</Badge>);
    const badge = screen.getByText('Verified');
    expect(badge.className).toContain('bg-emerald-50');
    expect(badge.className).toContain('text-emerald-700');
  });

  it('should apply error variant styles', () => {
    render(<Badge variant="error">Failed</Badge>);
    const badge = screen.getByText('Failed');
    expect(badge.className).toContain('bg-red-50');
    expect(badge.className).toContain('text-red-700');
  });

  it('should support md size', () => {
    render(<Badge size="md">Large</Badge>);
    const badge = screen.getByText('Large');
    expect(badge.className).toContain('text-xs');
    expect(badge.className).toContain('px-3');
  });

  it('should accept custom className', () => {
    render(<Badge className="my-custom-class">Custom</Badge>);
    expect(screen.getByText('Custom').className).toContain('my-custom-class');
  });
});
