'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
}

// Standard Fallback UI
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-400">
                Oops! Etwas ist schiefgelaufen
              </h1>
              <p className="text-gray-300">
                Ein unerwarteter Fehler ist aufgetreten.
              </p>
            </div>
          </div>

          {isDevelopment && error && (
            <div className="mt-4">
              <details className="rounded bg-gray-800/50 p-3">
                <summary className="cursor-pointer font-medium text-yellow-400">
                  Entwickler-Details anzeigen
                </summary>
                <div className="mt-2 text-sm">
                  <p className="font-medium text-red-300">Fehler:</p>
                  <code className="mt-1 block overflow-x-auto rounded bg-gray-900 p-2 text-xs">
                    {error.message}
                  </code>
                  {error.stack && (
                    <>
                      <p className="mt-3 font-medium text-red-300">
                        Stack Trace:
                      </p>
                      <code className="mt-1 block overflow-x-auto whitespace-pre rounded bg-gray-900 p-2 text-xs">
                        {error.stack}
                      </code>
                    </>
                  )}
                </div>
              </details>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={resetError}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Erneut versuchen
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="flex-1 rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600"
            >
              Zur Startseite
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Wenn das Problem weiterhin besteht, kontaktieren Sie uns bitte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry if available
    this.setState({
      error,
      errorInfo,
    });

    // Log to console (Sentry integration can be added later if needed)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export type { ErrorFallbackProps };
