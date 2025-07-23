import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate Limiting Middleware (einfache Implementation)
const RATE_LIMIT = 10; // Maximale Anzahl von Fehlern pro Minute
const errorCounts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const clientData = errorCounts.get(clientIp);

  if (!clientData) {
    errorCounts.set(clientIp, { count: 1, timestamp: now });
    return false;
  }

  if (now - clientData.timestamp > 60000) {
    // Reset nach einer Minute
    errorCounts.set(clientIp, { count: 1, timestamp: now });
    return false;
  }

  if (clientData.count >= RATE_LIMIT) {
    return true;
  }

  clientData.count += 1;
  errorCounts.set(clientIp, clientData);
  return false;
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    // Rate Limiting Check
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Zu viele Fehler gemeldet' },
        { status: 429 }
      );
    }

    const errorData = await request.json();
    
    // Validierung der Fehlerdaten
    if (!errorData.message || !errorData.timestamp) {
      return NextResponse.json(
        { error: 'Ungültige Fehlerdaten' },
        { status: 400 }
      );
    }

    // Fehler-Metadaten anreichern
    const enrichedErrorData = {
      ...errorData,
      clientIp,
      userAgent: headersList.get('user-agent'),
      referer: headersList.get('referer'),
      timestamp: new Date().toISOString(),
    };

    // TODO: Implementiere hier die tatsächliche Fehlerprotokollierung
    // Beispiel: Sentry, LogRocket, eigener Logging-Service, etc.
    
    // Entwicklungs-Logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Fehler protokolliert:', enrichedErrorData);
    }

    // In Produktion würden wir hier den Fehler an einen Logging-Service senden
    // await logToService(enrichedErrorData);

    return NextResponse.json({ status: 'Fehler erfolgreich protokolliert' });
  } catch (error) {
    console.error('Fehler beim Error-Tracking:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
