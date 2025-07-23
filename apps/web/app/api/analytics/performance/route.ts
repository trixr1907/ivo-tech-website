import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Einfacher In-Memory-Storage für Metriken
// In Produktion sollte dies durch eine richtige Datenbank ersetzt werden
const metricsStorage = {
  components: new Map<string, any[]>(),
  errors: new Map<string, any[]>(),
  webVitals: new Map<string, any[]>()
};

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const clientId = headersList.get('x-client-id') || 'anonymous';
    const metrics = await request.json();

    // Validiere die Metriken
    if (!metrics || typeof metrics !== 'object') {
      return NextResponse.json(
        { error: 'Ungültige Metriken' },
        { status: 400 }
      );
    }

    // Aktuelle Zeit für die Gruppierung
    const timeKey = new Date().toISOString().split('T')[0];

    // Speichere Komponenten-Metriken
  if (metrics.components) {
    const componentMetrics = metricsStorage.components.get(timeKey) || [];
    
    componentMetrics.push(...metrics.components.map((m: any) => ({
      ...m,
      clientId,
      timestamp: new Date().toISOString(),
    })));
    metricsStorage.components.set(timeKey, componentMetrics);
  }
    // Speichere Fehler-Metriken
    if (metrics.errors) {
      const errorMetrics = metricsStorage.errors.get(timeKey) || [];
      errorMetrics.push(...metrics.errors.map((e: any) => ({
        ...e,
        clientId,
        timestamp: new Date().toISOString()
      })));
      metricsStorage.errors.set(timeKey, errorMetrics);
    }

    // Speichere Web Vitals
    if (metrics.webVitals) {
      const vitalMetrics = metricsStorage.webVitals.get(timeKey) || [];
      vitalMetrics.push({
        ...metrics.webVitals,
        clientId,
        timestamp: new Date().toISOString()
      });
      metricsStorage.webVitals.set(timeKey, vitalMetrics);
    }

    // In Entwicklung: Zeige gesammelte Metriken
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Gespeicherte Metriken für', timeKey, {
        components: metricsStorage.components.get(timeKey)?.length || 0,
        errors: metricsStorage.errors.get(timeKey)?.length || 0,
        webVitals: metricsStorage.webVitals.get(timeKey)?.length || 0
      });
    }

    return NextResponse.json({
      status: 'Metriken erfolgreich gespeichert',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fehler beim Speichern der Metriken:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// Analytische Aggregation der Metriken
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const metrics = {
      components: metricsStorage.components.get(date) || [],
      errors: metricsStorage.errors.get(date) || [],
      webVitals: metricsStorage.webVitals.get(date) || [],
      summary: {
        totalErrors: 0,
        totalRecoveries: 0,
        averageRecoveryTime: 0
      }
    };

    // Berechne Zusammenfassung
    if (metrics.errors.length > 0) {
      metrics.summary.totalErrors = metrics.errors.length;
      metrics.summary.totalRecoveries = metrics.errors
        .reduce((acc, err) => acc + (err.recoveryAttempts || 0), 0);
    }

    if (metrics.components.length > 0) {
      const totalTime = metrics.components
        .reduce((acc, comp) => acc + (comp.recoveryTime || 0), 0);
      metrics.summary.averageRecoveryTime = totalTime / metrics.components.length;
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Fehler beim Abrufen der Metriken:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
