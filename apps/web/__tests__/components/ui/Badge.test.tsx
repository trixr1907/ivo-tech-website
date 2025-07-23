import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../../components/ui/Badge';

describe('Badge', () => {
  it('should render children content', () => {
    render(<Badge>Test Content</Badge>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with default classes', () => {
    const { container } = render(<Badge>Test Content</Badge>);
    const badge = container.firstChild;
    
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full',
      'text-xs',
      'font-medium'
    );
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Test Content</Badge>
    );
    const badge = container.firstChild;
    
    expect(badge).toHaveClass('custom-class');
  });

  it('should render with React elements as children', () => {
    render(
      <Badge>
        <span data-testid="icon">🔵</span>
        <span>Test Content</span>
      </Badge>
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
