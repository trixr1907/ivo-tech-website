import type { MonitoringConfig } from '../lib/services/performance-monitoring';

export const monitoringConfig: MonitoringConfig = {
  datadog: {
    apiKey: process.env.DATADOG_API_KEY || '',
    appKey: process.env.DATADOG_APP_KEY || '',
    serviceName: 'ivo-tech-website',
  },
  newRelic: {
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
    applicationId: process.env.NEW_RELIC_APP_ID || '',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
  },
  elasticAPM: {
    serverUrl: process.env.ELASTIC_APM_SERVER_URL || '',
    serviceName: 'ivo-tech-website',
  },
};

export const monitoringThresholds = {
  // Web Vitals
  FCP: {
    good: 1000,
    poor: 3000,
  },
  LCP: {
    good: 2500,
    poor: 4000,
  },
  FID: {
    good: 100,
    poor: 300,
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  // ErrorBoundary-spezifisch
  errorRecoveryTime: {
    good: 1000,
    poor: 3000,
  },
  // Ressourcen
  jsHeapSize: {
    good: 50 * 1024 * 1024, // 50MB
    poor: 100 * 1024 * 1024, // 100MB
  },
  longTaskThreshold: 50, // ms
  resourceLoadTime: {
    good: 1000,
    poor: 3000,
  },
};

export const monitoringSampleRates = {
  errors: 1.0, // 100% aller Fehler
  performance: 0.1, // 10% aller Performance-Metriken
  resources: 0.05, // 5% aller Ressourcen-Metriken
  userInteractions: 0.01, // 1% aller Benutzerinteraktionen
};

export const monitoringRetentionPeriods = {
  errors: 30, // 30 Tage
  performance: 7, // 7 Tage
  resources: 3, // 3 Tage
  trends: 90, // 90 Tage
};

export const alertingThresholds = {
  errorRate: {
    warning: 0.01, // 1% Fehlerrate
    critical: 0.05, // 5% Fehlerrate
  },
  responseTime: {
    warning: 2000, // 2s
    critical: 5000, // 5s
  },
  memoryUsage: {
    warning: 80, // 80% Auslastung
    critical: 90, // 90% Auslastung
  },
};

export const monitoringEndpoints = {
  metrics: '/api/monitoring/metrics',
  errors: '/api/monitoring/errors',
  trends: '/api/monitoring/trends',
  alerts: '/api/monitoring/alerts',
};
