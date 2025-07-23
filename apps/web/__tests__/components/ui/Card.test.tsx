import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../../../components/ui/Card';

describe('Card', () => {
  it('should render children content', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with default classes', () => {
    const { container } = render(
      <Card>Test Content</Card>
    );
    const card = container.firstChild;
    
    expect(card).toHaveClass(
      'bg-white',
      'rounded-lg',
      'border',
      'border-gray-200',
      'shadow-sm'
    );
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">Test Content</Card>
    );
    const card = container.firstChild;
    
    expect(card).toHaveClass('custom-class');
  });

  it('should render with nested components', () => {
    render(
      <Card>
        <div data-testid="header">Header</div>
        <div data-testid="content">Content</div>
        <div data-testid="footer">Footer</div>
      </Card>
    );
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should maintain proper nesting of elements', () => {
    const { container } = render(
      <Card>
        <div className="child">Nested Content</div>
      </Card>
    );
    
    const card = container.firstChild;
    const child = screen.getByText('Nested Content').parentElement;
    
    expect(card).toContainElement(child);
  });
});
