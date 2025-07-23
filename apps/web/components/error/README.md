# ErrorBoundary Komponente

Eine React-Komponente zur Fehlerbehandlung, die unerwartete Fehler in der Anwendung abfängt und eine benutzerfreundliche Fehlerseite anzeigt.

## Features

- 🛡️ Fängt JavaScript-Fehler in Kindkomponenten ab
- 🎨 Stilvolles, responsives Fehler-UI
- 🔄 Automatische Fehlerwiederherstellung
- 🛠️ Detaillierte Entwicklerinformationen im Development-Modus
- 🎯 Unterstützung für benutzerdefinierte Fallback-Komponenten
- 🌍 Deutsche Lokalisierung
- ⚡ Optimierte Performance durch React.PureComponent

## Installation

Die Komponente ist bereits in das Projekt integriert und erfordert keine zusätzliche Installation.

## Verwendung

### Basis-Verwendung

```tsx
import ErrorBoundary from 'components/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Mit benutzerdefinierten Fallback

```tsx
import ErrorBoundary from 'components/error/ErrorBoundary';
import CustomErrorFallback from './CustomErrorFallback';

function App() {
  return (
    <ErrorBoundary fallback={CustomErrorFallback}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Props

### ErrorBoundaryProps

| Prop     | Typ                                  | Erforderlich | Beschreibung                          |
|----------|--------------------------------------|--------------|---------------------------------------|
| children | ReactNode                            | ✅           | Die zu überwachenden Kindkomponenten |
| fallback | ComponentType<ErrorFallbackProps>    | ❌           | Optionale benutzerdefinierte Fehlerkomponente |

### ErrorFallbackProps

| Prop       | Typ                | Beschreibung                               |
|------------|-------------------|---------------------------------------------|
| error      | Error            | Das aufgetretene Fehlerobjekt              |
| errorInfo  | ErrorInfo        | React-Fehlerinformationen (Stack-Trace)    |
| resetError | () => void       | Funktion zum Zurücksetzen des Fehlerzustands |

## Features im Detail

### Development Mode

Im Development-Modus (`NODE_ENV === 'development'`) zeigt die Komponente zusätzliche Entwicklerinformationen an:
- Fehlermeldung
- Stack Trace
- Komponenten-Stack

### Error Recovery

Die Komponente bietet zwei Möglichkeiten zur Fehlerbehandlung:
1. "Erneut versuchen" - Setzt den Fehlerzustand zurück
2. "Zur Startseite" - Navigiert zur Hauptseite

### Benutzerdefinierte Fallback-Komponente

Sie können eine eigene Fehlerkomponente bereitstellen:

```tsx
const CustomFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, resetError }) => (
  <div>
    <h1>Ein Fehler ist aufgetreten</h1>
    <pre>{error.message}</pre>
    <button onClick={resetError}>Neu laden</button>
  </div>
);
```

## Best Practices

1. Platzieren Sie ErrorBoundaries strategisch:
   - Um wichtige UI-Bereiche
   - Um wiederverwendbare Komponenten
   - An Routengrenzen

2. Verwenden Sie mehrere ErrorBoundaries:
   ```tsx
   <ErrorBoundary>
     <Header />
     <ErrorBoundary>
       <MainContent />
     </ErrorBoundary>
     <ErrorBoundary>
       <Footer />
     </ErrorBoundary>
   </ErrorBoundary>
   ```

3. Kombinieren Sie mit Try-Catch:
   - ErrorBoundary für Rendering-Fehler
   - Try-Catch für Event-Handler und asynchrone Operationen

## Tests

Die Komponente verfügt über umfangreiche Tests. Führen Sie diese aus mit:

```bash
npm test components/error/__tests__/ErrorBoundary.test.tsx
```
