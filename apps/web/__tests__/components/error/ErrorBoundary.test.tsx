import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../components/error/ErrorBoundary';

// Mock window.location
const mockLocation = {
  href: window.location.href
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Test components
const ThrowError = () => {
  throw new Error('Test error');
};

const NormalComponent = () => <div>Normal component</div>;

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error = originalConsoleError;
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    consoleErrorSpy.mockClear();
    window.location.href = 'http://localhost/';
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });

  it('renders fallback UI when there is an error', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument();
    expect(screen.getByText('Ein unerwarteter Fehler ist aufgetreten.')).toBeInTheDocument();
  });

  it('allows retry when error occurs', () => {
    let shouldThrow = true;
    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    render(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Etwas ist schiefgelaufen')).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByText('Erneut versuchen'));

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('navigates to home page when clicking "Zur Startseite"', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Zur Startseite'));
    expect(window.location.href).toBe('/');
  });

  it('shows development details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: false });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Entwickler-Details anzeigen')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Entwickler-Details anzeigen'));
    expect(screen.getByText('Test error')).toBeInTheDocument();

Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, writable: false });
  });

  it('hides development details in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: false });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Entwickler-Details anzeigen')).not.toBeInTheDocument();

Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, writable: false });
  });

  it('accepts custom fallback component', () => {
    const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
      <div>Custom error: {error.message}</div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
  });

  it('logs errors to console in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: false });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    const calls = consoleErrorSpy.mock.calls.flat();
    expect(calls.some(call => call?.includes('Test error'))).toBe(true);

Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, writable: false });
  });
});
