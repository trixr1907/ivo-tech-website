import * as Sentry from '@sentry/react';
import { captureException } from './sentry';
import { performanceMonitor } from './performance';

export interface ErrorContext {
  componentName?: string;
  userId?: string;
  metadata?: Record<string, any>;
  severity?: 'fatal' | 'error' | 'warning' | 'info';
}

class MonitoringService {
  private static instance: MonitoringService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Globalen Error Handler hinzufügen
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        severity: 'error',
        metadata: {
          message: event.message,
          filename: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno,
        },
      });
    });

    // Unbehandelte Promise Rejections abfangen
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        severity: 'error',
        metadata: {
          type: 'unhandledRejection',
        },
      });
    });

    this.isInitialized = true;
  }

  public setUser(userId: string, email?: string, metadata?: Record<string, any>): void {
    Sentry.setUser({
      id: userId,
      email,
      ...metadata,
    });
  }

  public async captureError(
    error: Error,
    context: ErrorContext = {}
  ): Promise<void> {
    const { componentName, userId, metadata, severity = 'error' } = context;

    // Sentry Exception erfassen
    Sentry.withScope((scope) => {
      scope.setLevel(severity);
      if (componentName) {
        scope.setTag('component', componentName);
      }
      if (userId) {
        scope.setUser({ id: userId });
      }
      if (metadata) {
        scope.setExtras(metadata);
      }
      captureException(error);
    });

    // Performance-Metriken aktualisieren
    if (componentName) {
      performanceMonitor.trackComponentMetrics(componentName, {
        errorCount: 1,
      });
    }

    // Fehler in die Konsole loggen (nur in Entwicklung)
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 Fehler erfasst');
      console.error('Fehler:', error);
      console.error('Kontext:', context);
      console.groupEnd();
    }

    // API-Endpunkt für Fehlerprotokollierung aufrufen
    try {
      const response = await fetch('/api/monitoring/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error('Fehler beim Senden des Fehlerberichts an die API');
      }
    } catch (apiError) {
      console.error('Fehler beim API-Aufruf:', apiError);
    }
  }

  public addBreadcrumb(
    message: string,
    category?: string,
    metadata?: Record<string, any>
  ): void {
    Sentry.addBreadcrumb({
      message,
      category,
      data: metadata,
      timestamp: Date.now() / 1000,
    });
  }

  public setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

}

export const monitoringService = MonitoringService.getInstance();
