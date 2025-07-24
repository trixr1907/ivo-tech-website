'use client';

import React, { useEffect, ReactNode } from 'react';

interface MonitoringProviderProps {
  children: ReactNode;
}

// Enhanced error reporting function (console-based for now)
export const reportError = (error: Error, context?: Record<string, any>) => {
  console.error('Error reported:', error, context);

  // In a production environment, you could send this to your preferred monitoring service
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ error: error.message, context }) })
  }
};

// Performance monitoring hook (console-based for now)
export const trackPerformance = (
  name: string,
  duration: number,
  context?: Record<string, any>
) => {
  console.log(`Performance: ${name} - ${duration}ms`, context);

  // In a production environment, you could send this to your analytics service
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: analytics.track(name, { duration, ...context })
  }
};

export const MonitoringProvider: React.FC<MonitoringProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    console.log('MonitoringProvider initialized');

    // Global error handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      reportError(new Error(event.reason), {
        type: 'unhandledRejection',
        reason: event.reason,
      });
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      reportError(event.error, {
        type: 'globalError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    // Add global error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
      window.removeEventListener('error', handleError);
    };
  }, []);

  return <>{children}</>;
};

export default MonitoringProvider;
