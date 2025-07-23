/**
 * Performance-Monitoring Service für Error Tracking und Komponenten-Performance
 */

interface PerformanceMetrics {
  componentName: string;
  errorCount: number;
  recoveryCount: number;
  recoveryTime: number;
  timestamp: string;
}

interface ErrorMetrics {
  errorType: string;
  componentStack?: string;
  recoveryAttempts: number;
  userActions: string[];
  timestamp: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private errorMetrics: ErrorMetrics[] = [];
  private readonly MAX_ERROR_LOGS = 100;

  private constructor() {
    if (typeof window !== 'undefined') {
      // Performance Observer für Web Vitals
      this.initializePerformanceObserver();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializePerformanceObserver(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Protokolliere relevante Performance-Metriken
          if (entry.entryType === 'largest-contentful-paint') {
            this.logMetric('LCP', entry);
          } else if (entry.entryType === 'first-input') {
            this.logMetric('FID', entry);
          } else if (entry.entryType === 'layout-shift') {
            this.logMetric('CLS', entry);
          }
        });
      });

      // Beobachte wichtige Web Vitals
      observer.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']
      });
    } catch (error) {
      console.warn('Performance Observer konnte nicht initialisiert werden:', error);
    }
  }

  private logMetric(metricName: string, entry: PerformanceEntry): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${metricName}:`, entry.startTime, entry);
    }
    // TODO: Metriken an Analytics-Service senden
  }

  /**
   * Trackt Component Performance Metriken
   */
  public trackComponentMetrics(componentName: string, metrics: Partial<PerformanceMetrics>): void {
    const existing = this.metrics.get(componentName) || {
      componentName,
      errorCount: 0,
      recoveryCount: 0,
      recoveryTime: 0,
      timestamp: new Date().toISOString()
    };

    this.metrics.set(componentName, {
      ...existing,
      ...metrics,
      timestamp: new Date().toISOString()
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Komponenten-Metriken für ${componentName}:`, this.metrics.get(componentName));
    }
  }

  /**
   * Trackt Error-bezogene Metriken
   */
  public trackError(error: Error, componentStack?: string): void {
    const errorMetric: ErrorMetrics = {
      errorType: error.name,
      componentStack,
      recoveryAttempts: 0,
      userActions: [],
      timestamp: new Date().toISOString()
    };

    this.errorMetrics.push(errorMetric);

    // Begrenze die Anzahl der gespeicherten Fehler
    if (this.errorMetrics.length > this.MAX_ERROR_LOGS) {
      this.errorMetrics.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Fehler-Metrik:', errorMetric);
    }
  }

  /**
   * Trackt Benutzeraktionen nach einem Fehler
   */
  public trackErrorRecovery(componentName: string, action: string): void {
    const metrics = this.metrics.get(componentName);
    if (metrics) {
      metrics.recoveryCount++;
      this.metrics.set(componentName, metrics);
    }

    const lastError = this.errorMetrics[this.errorMetrics.length - 1];
    if (lastError) {
      lastError.recoveryAttempts++;
      lastError.userActions.push(action);
    }
  }

  /**
   * Gibt eine Zusammenfassung der Performance-Metriken zurück
   */
  public getMetricsSummary(): {
    components: PerformanceMetrics[];
    errors: ErrorMetrics[];
  } {
    return {
      components: Array.from(this.metrics.values()),
      errors: this.errorMetrics
    };
  }

  /**
   * Sendet gesammelte Metriken an einen Analytics-Service
   */
  public async sendMetricsToAnalytics(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      try {
        const metrics = this.getMetricsSummary();
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metrics)
        });
      } catch (error) {
        console.error('Fehler beim Senden der Performance-Metriken:', error);
      }
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
