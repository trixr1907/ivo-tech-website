import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { testA11y, mockA11yService, checkAriaAttributes, simulateKeyPress } from './a11y.test-utils';
import { a11yService } from '../../../lib/services/a11y';
import ErrorBoundary from '../ErrorBoundary';

// Mock console.error to prevent test output noise
const originalError = console.error;
// Mock der Services
beforeAll(() => {
  console.error = jest.fn();
  jest.mock('../../../lib/services/a11y', () => ({
    a11yService: mockA11yService
  }));
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
    <div>
      <h1>Custom Error: {error.message}</h1>
      <button onClick={resetError}>Reset</button>
    </div>
  );

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
});

  it('meets accessibility standards', async () => {
    await testA11y(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
  });

  it('renders default fallback when there is an error', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument();
    expect(screen.getByText('Ein unerwarteter Fehler ist aufgetreten.')).toBeInTheDocument();
    expect(screen.getByText('Erneut versuchen')).toBeInTheDocument();
    expect(screen.getByText('Zur Startseite')).toBeInTheDocument();

    // Prüfe ARIA-Attribute
    const errorMessage = screen.getByRole('alert');
    checkAriaAttributes(errorMessage, {
      'live': 'assertive',
      'atomic': 'true'
    });
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument();
  });

  it('resets error state when resetError is called', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Erneut versuchen'));
    
    // After reset, the error boundary should try to render children again
    expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument();
  });

  it('shows development details when in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Entwickler-Details anzeigen')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('does not show development details in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Entwickler-Details anzeigen')).not.toBeInTheDocument();
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('supports keyboard navigation', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Erneut versuchen');
    const homeButton = screen.getByText('Zur Startseite');

    // Test Keyboard Focus Order
    retryButton.focus();
    expect(document.activeElement).toBe(retryButton);

    // Simuliere Tab-Navigation
    simulateKeyPress(retryButton, 'Tab');
    expect(document.activeElement).toBe(homeButton);

    // Test Enter Key
    simulateKeyPress(retryButton, 'Enter');
    expect(mockA11yService.notify).toHaveBeenCalledWith(
      expect.stringContaining('Erneut versuchen')
    );
  });

  it('notifies screen readers of error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(mockA11yService.notifyError).toHaveBeenCalledWith(
      expect.any(Error),
      true
    );
  });

  it('provides accessible error details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const details = screen.getByText('Entwickler-Details anzeigen').closest('details');
    expect(details).toHaveAttribute('role', 'group');

    const summary = within(details!).getByRole('button');
    expect(summary).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'true');

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('navigates to home page when "Zur Startseite" is clicked', () => {
    // Mock window.location.href
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: originalHref }
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Zur Startseite'));
    expect(window.location.href).toBe('/');

    // Restore original href
    window.location.href = originalHref;
  });
});
