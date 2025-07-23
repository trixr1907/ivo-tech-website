import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export function initSentry() {
  Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Ersetze mit echtem DSN
    integrations: [new Integrations.BrowserTracing()],

    // Diesen Wert anpassen, um die Leistung zu regulieren
    tracesSampleRate: 1.0,
  });
}

export function captureException(error: Error) {
  Sentry.captureException(error);
}
