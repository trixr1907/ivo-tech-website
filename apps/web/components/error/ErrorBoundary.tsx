'use client';

import type { ReactNode, ErrorInfo, ComponentType } from 'react';
import React from 'react';
import { a11yService } from '../../lib/services/a11y';
import { performanceMonitor } from '../../lib/services/performance';
import { monitoringService } from '../../lib/services/monitoring';
import { notificationService } from '../../lib/services/notifications';
import { NotificationContainer } from '../notifications/NotificationContainer';

export interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails?: boolean;
}
const ErrorDetails: React.FC<{ error: Error; errorInfo?: ErrorInfo }> = ({ error, errorInfo }) => (
  <div className="mt-4">
    <details className="rounded bg-gray-800/50 p-3">
      <summary className="cursor-pointer font-medium text-yellow-400">
        Entwickler-Details anzeigen
      </summary>
      <div className="mt-2 space-y-4 text-sm">
        <div>
          <p className="font-medium text-red-300">Fehler:</p>
          <code className="mt-1 block overflow-x-auto rounded bg-gray-900 p-2 text-xs">
            {error.message}
          </code>
        </div>
        {error.stack && (
          <div>
            <p className="font-medium text-red-300">Stackverlauf:</p>
            <code className="mt-1 block max-h-[200px] overflow-y-auto whitespace-pre rounded bg-gray-900 p-2 text-xs">
              {error.stack}
            </code>
          </div>
        )}
        {errorInfo?.componentStack && (
          <div>
            <p className="font-medium text-red-300">Komponentenstapel:</p>
            <code className="mt-1 block max-h-[200px] overflow-y-auto whitespace-pre rounded bg-gray-900 p-2 text-xs">
              {errorInfo.componentStack}
            </code>
          </div>
        )}
      </div>
    </details>
  </div>
);

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, resetError }) => {
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

          {isDevelopment && error && <ErrorDetails error={error} errorInfo={errorInfo} />}

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

class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
    showDetails: false
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: undefined,
      showDetails: false
    };
  }

  componentDidMount(): void {
    // Initialisiere Monitoring-Service
    monitoringService.initialize();
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo): Promise<void> {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });

    // Barrierefreie Benachrichtigung über den Fehler
    // Monitoring und Error Tracking
    await monitoringService.captureError(error, {
      componentName: 'ErrorBoundary',
      severity: 'error',
      metadata: {
        componentStack: errorInfo.componentStack
      }
    });

    // Accessibility Benachrichtigung
    a11yService.notifyError(error, true);

    // Performance-Monitoring
    performanceMonitor.trackError(error, errorInfo.componentStack);
    performanceMonitor.trackComponentMetrics('ErrorBoundary', {
      errorCount: 1,
      recoveryTime: 0
    });

    // Zeige Benachrichtigung
    await notificationService.showError(error, {
      title: 'Fehler in der Anwendung',
      actions: [
        {
          label: 'Neu laden',
          onClick: () => window.location.reload()
        },
        {
          label: 'Details',
          onClick: () => this.setState({ showDetails: true })
        }
      ]
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('Fehler gefangen von ErrorBoundary:', error);
      console.error('Komponentenstapel:', errorInfo.componentStack);
    }
  }

  resetError = (): void => {
    const startTime = performance.now();
    // Performance-Monitoring für die Wiederherstellung
    performanceMonitor.trackErrorRecovery('ErrorBoundary', 'reset');
    performanceMonitor.trackComponentMetrics('ErrorBoundary', {
      recoveryCount: 1,
      recoveryTime: performance.now() - startTime
    });

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false
    });
  };

  render() {
    const { children, fallback: FallbackComponent = DefaultErrorFallback } = this.props;
    const { hasError, error, errorInfo } = this.state;

    if (hasError && error) {
      return (
        <>
          <NotificationContainer />
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            resetError={this.resetError}
          />
        </>
      );
    }

    return children;
  }
}

export const ErrorBoundary = ErrorBoundaryComponent;

export default ErrorBoundary;
