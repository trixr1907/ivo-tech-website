import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as Sentry from '@sentry/node';

// Validierung für Fehlerberichte
interface ErrorReport {
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: {
    componentName?: string;
    userId?: string;
    metadata?: Record<string, any>;
    severity?: 'fatal' | 'error' | 'warning' | 'info';
  };
  timestamp: string;
}

// Einfacher Rate Limiter
const RATE_LIMIT = 50; // Maximale Anzahl von Fehlerberichten pro Minute
const errorReports = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const clientData = errorReports.get(clientIp);

  if (!clientData) {
    errorReports.set(clientIp, { count: 1, timestamp: now });
    return false;
  }

  if (now - clientData.timestamp > 60000) {
    errorReports.set(clientIp, { count: 1, timestamp: now });
    return false;
  }

  if (clientData.count >= RATE_LIMIT) {
    return true;
  }

  clientData.count += 1;
  errorReports.set(clientIp, clientData);
  return false;
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Rate Limiting Check
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Zu viele Fehlerberichte' },
        { status: 429 }
      );
    }

    const report: ErrorReport = await request.json();

    // Validiere den Fehlerbericht
    if (!report.error || !report.error.message) {
      return NextResponse.json(
        { error: 'Ungültiger Fehlerbericht' },
        { status: 400 }
      );
    }

    // Erweitere den Bericht um zusätzliche Informationen
    const enrichedReport = {
      ...report,
      environment: process.env.NODE_ENV,
      client: {
        ip: clientIp,
        userAgent,
      },
      server: {
        timestamp: new Date().toISOString(),
        node_version: process.version,
      },
    };

    // Sende den Fehler an Sentry
    Sentry.withScope((scope) => {
      scope.setExtra('enrichedReport', enrichedReport);
      if (report.context.componentName) {
        scope.setTag('component', report.context.componentName);
      }
      if (report.context.userId) {
        scope.setUser({ id: report.context.userId });
      }
      Sentry.captureException(new Error(report.error.message));
    });

    // In Entwicklung: Console Output
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Fehlerbericht erfasst:', enrichedReport);
    }

    return NextResponse.json({
      status: 'Fehlerbericht erfolgreich verarbeitet',
      id: Math.random().toString(36).substring(7), // Einfache ID-Generierung
    });
  } catch (error) {
    console.error('Fehler bei der Verarbeitung des Fehlerberichts:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
