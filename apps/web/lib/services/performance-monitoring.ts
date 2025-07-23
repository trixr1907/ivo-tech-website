import { performanceOptimizationService } from './performance-optimization';
import { performanceTrendService } from './performance-trends';

interface PerformanceEvent {
  type: 'metric' | 'error' | 'optimization';
  name: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface MonitoringConfig {
  datadog?: {
    apiKey: string;
    appKey: string;
    serviceName: string;
  };
  newRelic?: {
    licenseKey: string;
    applicationId: string;
  };
  sentry?: {
    dsn: string;
    environment: string;
  };
  elasticAPM?: {
    serverUrl: string;
    serviceName: string;
  };
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private config: MonitoringConfig = {};
  private eventQueue: PerformanceEvent[] = [];
  private readonly MAX_QUEUE_SIZE = 1000;
  private readonly FLUSH_INTERVAL = 5000; // 5 Sekunden

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
      this.startFlushInterval();
    }
  }

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  /**
   * Konfiguriert die Monitoring-Services
   */
  public configure(config: MonitoringConfig): void {
    this.config = config;
    this.initializeServices();
  }

  /**
   * Initialisiert Performance-Monitoring
   */
  private initializeMonitoring(): void {
    // Web Vitals
    this.observeWebVitals();

    // Resource Timing
    this.observeResourceTiming();

    // Long Tasks
    this.observeLongTasks();

    // Error Monitoring
    this.initializeErrorMonitoring();
  }

  /**
   * Beobachtet Web Vitals
   */
  private observeWebVitals(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.queueEvent({
          type: 'metric',
          name: entry.name,
          value: entry.startTime,
          metadata: {
            entryType: entry.entryType,
            duration: entry.duration,
          },
          timestamp: new Date().toISOString(),
        });
      }
    });

    observer.observe({
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
    });
  }

  /**
   * Beobachtet Resource Timing
   */
  private observeResourceTiming(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.initiatorType === 'resource') {
          this.queueEvent({
            type: 'metric',
            name: 'resource-timing',
            value: entry.duration,
            metadata: {
              resource: entry.name,
              initiatorType: entry.initiatorType,
              transferSize: (entry as PerformanceResourceTiming).transferSize,
            },
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Beobachtet Long Tasks
   */
  private observeLongTasks(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // 50ms
          this.queueEvent({
            type: 'metric',
            name: 'long-task',
            value: entry.duration,
            metadata: {
              startTime: entry.startTime,
              taskType: entry.name,
            },
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  }

  /**
   * Initialisiert Error-Monitoring
   */
  private initializeErrorMonitoring(): void {
    window.addEventListener('error', (event) => {
      this.queueEvent({
        type: 'error',
        name: 'uncaught-error',
        value: 1,
        metadata: {
          message: event.message,
          filename: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno,
          stack: event.error?.stack,
        },
        timestamp: new Date().toISOString(),
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.queueEvent({
        type: 'error',
        name: 'unhandled-rejection',
        value: 1,
        metadata: {
          reason: event.reason?.toString(),
          stack: event.reason?.stack,
        },
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Initialisiert externe Monitoring-Services
   */
  private initializeServices(): void {
    if (this.config.datadog) {
      this.initializeDatadog();
    }
    if (this.config.newRelic) {
      this.initializeNewRelic();
    }
    if (this.config.sentry) {
      this.initializeSentry();
    }
    if (this.config.elasticAPM) {
      this.initializeElasticAPM();
    }
  }

  /**
   * Initialisiert Datadog RUM
   */
  private initializeDatadog(): void {
    if (!this.config.datadog) return;

    const { apiKey, appKey, serviceName } = this.config.datadog;
    
    // Datadog RUM SDK initialisieren
    (window as any).DD_RUM?.init({
      applicationId: appKey,
      clientToken: apiKey,
      service: serviceName,
      sampleRate: 100,
      trackInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
    });
  }

  /**
   * Initialisiert New Relic Browser Agent
   */
  private initializeNewRelic(): void {
    if (!this.config.newRelic) return;

    const { licenseKey, applicationId } = this.config.newRelic;
    
    // New Relic Browser Agent initialisieren
    (window as any).NREUM?.init({
      license_key: licenseKey,
      application_id: applicationId,
      distributed_tracing: { enabled: true },
    });
  }

  /**
   * Initialisiert Sentry Monitoring
   */
  private initializeSentry(): void {
    if (!this.config.sentry) return;

    const { dsn, environment } = this.config.sentry;
    
    // Sentry initialisieren
    (window as any).Sentry?.init({
      dsn,
      environment,
      tracesSampleRate: 1.0,
      integrations: [new (window as any).Sentry.BrowserTracing()],
    });
  }

  /**
   * Initialisiert Elastic APM RUM Agent
   */
  private initializeElasticAPM(): void {
    if (!this.config.elasticAPM) return;

    const { serverUrl, serviceName } = this.config.elasticAPM;
    
    // Elastic APM RUM Agent initialisieren
    (window as any).elasticApm?.init({
      serverUrl,
      serviceName,
      environment: process.env.NODE_ENV,
    });
  }

  /**
   * Fügt ein Event zur Queue hinzu
   */
  private queueEvent(event: PerformanceEvent): void {
    this.eventQueue.push(event);

    if (this.eventQueue.length >= this.MAX_QUEUE_SIZE) {
      this.flushEvents();
    }
  }

  /**
   * Startet das Interval für das Flushen der Events
   */
  private startFlushInterval(): void {
    setInterval(() => this.flushEvents(), this.FLUSH_INTERVAL);
  }

  /**
   * Sendet Events an alle konfigurierten Services
   */
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // Sende Events an alle konfigurierten Services
    await Promise.all([
      this.sendToDatadog(events),
      this.sendToNewRelic(events),
      this.sendToSentry(events),
      this.sendToElasticAPM(events),
    ]);

    // Aktualisiere Performance-Trends
    await this.updatePerformanceTrends(events);
  }

  /**
   * Sendet Events an Datadog
   */
  private async sendToDatadog(events: PerformanceEvent[]): Promise<void> {
    if (!this.config.datadog) return;

    for (const event of events) {
      (window as any).DD_RUM?.addTiming(event.name, event.value);
    }
  }

  /**
   * Sendet Events an New Relic
   */
  private async sendToNewRelic(events: PerformanceEvent[]): Promise<void> {
    if (!this.config.newRelic) return;

    for (const event of events) {
      (window as any).newrelic?.addPageAction(event.name, {
        value: event.value,
        ...event.metadata,
      });
    }
  }

  /**
   * Sendet Events an Sentry
   */
  private async sendToSentry(events: PerformanceEvent[]): Promise<void> {
    if (!this.config.sentry) return;

    for (const event of events) {
      if (event.type === 'error') {
        (window as any).Sentry?.captureException(event.metadata?.error, {
          extra: event.metadata,
        });
      } else {
        (window as any).Sentry?.captureMessage(event.name, {
          level: 'info',
          extra: {
            value: event.value,
            ...event.metadata,
          },
        });
      }
    }
  }

  /**
   * Sendet Events an Elastic APM
   */
  private async sendToElasticAPM(events: PerformanceEvent[]): Promise<void> {
    if (!this.config.elasticAPM) return;

    for (const event of events) {
      (window as any).elasticApm?.addTransaction(event.name, {
        type: event.type,
        value: event.value,
        ...event.metadata,
      });
    }
  }

  /**
   * Aktualisiert Performance-Trends
   */
  private async updatePerformanceTrends(
    events: PerformanceEvent[]
  ): Promise<void> {
    const metrics = events.reduce((acc, event) => {
      if (event.type === 'metric') {
        acc[event.name] = event.value;
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(metrics).length > 0) {
      await performanceTrendService.saveTrendPoint({
        timestamp: new Date().toISOString(),
        metrics: metrics as any,
      });

      // Analysiere Performance und generiere Optimierungsvorschläge
      const suggestions = await performanceOptimizationService.analyzePerfomance(
        metrics as any,
        {
          environment: process.env.NODE_ENV as 'development' | 'production',
          route: window.location.pathname,
          timestamp: new Date().toISOString(),
        }
      );

      // Sende Optimierungsvorschläge an Monitoring-Services
      if (suggestions.length > 0) {
        this.queueEvent({
          type: 'optimization',
          name: 'optimization-suggestions',
          value: suggestions.length,
          metadata: { suggestions },
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
}

export const performanceMonitoringService = PerformanceMonitoringService.getInstance();
