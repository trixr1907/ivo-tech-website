# Monitoring & Analytics Setup Guide

## Übersicht

Dieses Projekt ist mit einem umfassenden Monitoring- und Analytics-Stack ausgestattet:

- **Vercel Analytics** - Web Analytics und Performance-Metriken
- **Sentry** - Error-Tracking und Performance-Monitoring
- **LogRocket** - Session Replay und Frontend-Monitoring (Alternative zu Sentry)

## 🚀 Quick Setup

### 1. Vercel Analytics aktivieren

#### Via Vercel Dashboard:

1. Gehe zu deinem Vercel-Projekt im Dashboard
2. Navigate zu "Analytics" → "Enable Analytics"
3. Analytics wird automatisch aktiviert (keine ENV-Variable nötig)

#### Via Environment Variable:

```bash
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id_here
```

### 2. Sentry konfigurieren

1. Erstelle einen Account bei [sentry.io](https://sentry.io)
2. Erstelle ein neues Next.js-Projekt
3. Setze die folgenden Environment-Variablen:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN@sentry.io/PROJECT_ID
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

4. Installiere die Sentry-Dependencies:

```bash
npm install @sentry/nextjs
```

### 3. LogRocket konfigurieren (Alternative zu Sentry)

1. Erstelle einen Account bei [logrocket.com](https://logrocket.com)
2. Erstelle eine neue App
3. Setze die Environment-Variable:

```bash
NEXT_PUBLIC_LOGROCKET_APP_ID=your_logrocket_app_id_here
```

4. Installiere LogRocket:

```bash
npm install logrocket
```

## 🔧 Erweiterte Konfiguration

### Environment-Variablen Übersicht

```bash
# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=optional_custom_analytics_id

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://your_dsn@sentry.io/project_id
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# LogRocket Session Replay
NEXT_PUBLIC_LOGROCKET_APP_ID=your_logrocket_app_id
```

### Sentry Performance Monitoring

Das Projekt ist bereits konfiguriert für:

- **Error Boundary Integration** - Automatisches Error-Reporting
- **Performance Tracking** - Transaction-Monitoring
- **User Context** - Anonyme User-Tracking
- **Environment Filtering** - Entwicklungsfilter

### Custom Error Reporting

Du kannst Fehler manuell in deinen Komponenten melden:

```typescript
import { reportError } from '@/components/monitoring/MonitoringProvider';

try {
  // Your code here
} catch (error) {
  reportError(error, {
    component: 'YourComponent',
    context: 'additional context',
  });
}
```

### Performance Tracking

Das erweiterte `usePerformance`-Hook bietet:

```typescript
import { usePerformance } from '@/hooks/usePerformance';

const MyComponent = () => {
  const { fps, memory, latency, loadTime } = usePerformance();

  return (
    <div>
      <p>FPS: {fps}</p>
      <p>Memory: {memory}MB</p>
      <p>Load Time: {loadTime}ms</p>
    </div>
  );
};
```

## 🛡️ Error Boundary

Die App ist mit einer benutzerdefinierten ErrorBoundary ausgestattet:

- **Automatisches Error-Reporting** zu Sentry/LogRocket
- **Benutzerfreundliche Fallback-UI**
- **Entwickler-Details** in Development-Mode
- **Recovery-Mechanismus** mit "Erneut versuchen"-Button

## 📊 Analytics Dashboard

### Vercel Analytics

- Automatische Page Views
- Performance-Metriken
- Real User Monitoring
- Web Vitals

### Sentry Dashboard

- Error-Tracking
- Performance-Monitoring
- Release-Tracking
- User-Journey

### LogRocket Features

- Session Replay
- Console Logs
- Network Requests
- DOM-Snapshots

## 🔍 Debugging

### Development Mode

```bash
NODE_ENV=development npm run dev
```

- Vercel Analytics: Disabled (außer explizit konfiguriert)
- Sentry: Verbose Logging aktiviert
- LogRocket: Console-Debugging verfügbar
- Error Boundary: Zeigt Stack-Traces

### Production Mode

```bash
NODE_ENV=production npm run build && npm run start
```

- Alle Monitoring-Services aktiv
- Error-Filtering aktiviert
- Performance-Optimierungen

## ⚡ Performance-Tipps

1. **Lazy Loading**: Monitoring-Services werden dynamisch importiert
2. **Error-Filtering**: Nicht-kritische Fehler werden herausgefiltert
3. **Sample Rates**: Performance-Monitoring mit konfigurierten Sample-Raten
4. **Environment-basiert**: Unterschiedliche Konfigurationen für Dev/Prod

## 🚨 Troubleshooting

### Vercel Analytics funktioniert nicht

- Überprüfe, ob Analytics im Vercel Dashboard aktiviert ist
- Vercel Analytics funktioniert nur in Production oder mit expliziter ENV-Variable

### Sentry-Fehler werden nicht gemeldet

- Überprüfe `NEXT_PUBLIC_SENTRY_DSN` Environment-Variable
- Prüfe Browser-Konsole auf Sentry-Initialisierungsfehler
- Stelle sicher, dass die DSN korrekt formatiert ist

### LogRocket Sessions fehlen

- Überprüfe `NEXT_PUBLIC_LOGROCKET_APP_ID`
- LogRocket funktioniert nur im Browser (Client-Side)
- Prüfe Browser-Konsole auf Initialisierungsfehler

## 📝 Best Practices

1. **Sensitive Daten**: Verwende Request/Response-Sanitizer für LogRocket
2. **Error-Context**: Füge relevanten Context zu Error-Reports hinzu
3. **Performance-Budget**: Überwache Performance-Metriken regelmäßig
4. **User-Privacy**: Implementiere Opt-out-Mechanismen wenn nötig
5. **Testing**: Teste Error-Flows in Staging-Umgebung

## 🔗 Nützliche Links

- [Vercel Analytics Docs](https://vercel.com/analytics)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [LogRocket React Integration](https://docs.logrocket.com/docs/react)
- [Error Boundary Best Practices](https://reactjs.org/docs/error-boundaries.html)
