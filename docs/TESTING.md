# IVO-Tech Website - Testing Documentation

## Überblick

Diese Dokumentation beschreibt die Test-Strategie, Test-Suites und Prüfmethoden für die IVO-Tech Website. Unser Ziel ist eine umfassende Abdeckung aller kritischen Funktionalitäten mit automatisierten Tests.

## Test-Strategie

### Test-Pyramide

```
       /\
      /  \        E2E Tests (Integration)
     /____\
    /      \      Integration Tests
   /________\
  /          \    Unit Tests (Komponenten)
 /__________\
```

### Test-Kategorien

1. **Unit Tests**: Komponenten-Tests mit React Testing Library
2. **Integration Tests**: API-Integration und Komponenten-Interaktion
3. **Performance Tests**: Ladezeiten, Rendering-Performance, Memory Usage
4. **Cross-Browser Tests**: Browser-Kompatibilität und -Konsistenz
5. **Visual Regression Tests**: UI-Konsistenz und Design-Validierung

## Test-Setup

### Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jest": "^30.0.4",
    "jest-environment-jsdom": "^30.0.4",
    "@types/jest": "^30.0.0"
  }
}
```

### Konfiguration

- **Jest Config**: `jest.config.js` - Hauptkonfiguration für Tests
- **Test Setup**: `jest.setup.js` - Global Test Setup und Mocks
- **Coverage**: 80% Minimum Coverage Threshold

### Test-Kommandos

```bash
# Alle Tests ausführen
pnpm --filter=ivo-tech-web test

# Tests im Watch-Modus
pnpm --filter=ivo-tech-web test:watch

# Coverage Report generieren
pnpm --filter=ivo-tech-web test:coverage

# CI-Tests (ohne Watch)
pnpm --filter=ivo-tech-web test:ci
```

## Test-Suiten

### 1. Komponenten-Tests (Unit Tests)

#### CryptoDashboard Tests (`__tests__/components/dashboard/CryptoDashboard.test.tsx`)

**Abgedeckte Bereiche:**

- ✅ Rendering und UI-Struktur
- ✅ API-Integration mit CoinGecko
- ✅ Error Handling und Fallback-Daten
- ✅ Interaktivität (Crypto-Auswahl)
- ✅ Datenformatierung (Preise, Prozente)
- ✅ Performance (Memory Leaks, Cleanup)
- ✅ Responsive Design

**Beispiel-Tests:**

```typescript
test('renders dashboard header', async () => {
  render(<CryptoDashboard />)
  await waitFor(() => {
    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByText('Crypto')).toBeInTheDocument()
  })
})

test('handles API error gracefully', async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error('API Error'))
  render(<CryptoDashboard />)
  await waitFor(() => {
    expect(screen.getByText(/Failed to fetch crypto data/)).toBeInTheDocument()
  })
})
```

#### 3D Components Tests (`__tests__/components/3d/EpicScene3D.test.tsx`)

**Abgedeckte Bereiche:**

- ✅ Canvas-Rendering
- ✅ WebGL-Unterstützung
- ✅ Interaktivität (Mouse/Touch)
- ✅ Performance-Optimierungen
- ✅ Resource Cleanup
- ✅ Error Handling

**Beispiel-Tests:**

```typescript
test('renders canvas with correct configuration', () => {
  render(<EpicScene3D />)
  const canvas = screen.getByTestId('canvas')
  expect(canvas).toBeInTheDocument()
})

test('handles missing WebGL gracefully', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => null)
  const { container } = render(<EpicScene3D />)
  expect(container.firstChild).toBeTruthy()
})
```

### 2. Performance Tests (`__tests__/performance/performance.test.ts`)

**Abgedeckte Bereiche:**

- ✅ Bundle Size Monitoring
- ✅ Render Performance
- ✅ Memory Usage Tracking
- ✅ API Response Times
- ✅ Animation Performance
- ✅ Resource Loading

**Performance Benchmarks:**

- Haupt-Bundle: < 500KB
- Vendor-Bundle: < 1MB
- Total Bundle: < 2MB
- Render Zeit: < 16ms (60 FPS)
- API Timeout: < 5 Sekunden
- 3D Init Zeit: < 100ms

### 3. Browser-Kompatibilität

#### Unterstützte Browser

| Browser           | Version | Status          | Notizen                    |
| ----------------- | ------- | --------------- | -------------------------- |
| **Chrome**        | 90+     | ✅ Full Support | Primary Development Target |
| **Firefox**       | 85+     | ✅ Full Support | WebGL & ES6 Support        |
| **Safari**        | 14+     | ✅ Full Support | iOS/macOS Compatibility    |
| **Edge**          | 90+     | ✅ Full Support | Chromium-based             |
| **Mobile Chrome** | 90+     | ✅ Full Support | Touch Interactions         |
| **Mobile Safari** | 14+     | ✅ Full Support | iOS Optimizations          |

#### Browser-spezifische Tests

```typescript
describe('Cross-Browser Compatibility', () => {
  test('WebGL support detection', () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    expect(gl || canvas.getContext('experimental-webgl')).toBeTruthy();
  });

  test('CSS Grid support', () => {
    const testElement = document.createElement('div');
    testElement.style.display = 'grid';
    expect(testElement.style.display).toBe('grid');
  });
});
```

### 4. Responsive Design Tests

#### Breakpoint-Tests

```typescript
const testBreakpoints = [
  { width: 375, height: 667, name: 'Mobile' },    // iPhone SE
  { width: 768, height: 1024, name: 'Tablet' },   // iPad
  { width: 1280, height: 720, name: 'Desktop' },  // Standard Desktop
  { width: 1920, height: 1080, name: 'Large' }    // Full HD
]

testBreakpoints.forEach(({ width, height, name }) => {
  test(`renders correctly on ${name} (${width}x${height})`, () => {
    Object.defineProperty(window, 'innerWidth', { value: width })
    Object.defineProperty(window, 'innerHeight', { value: height })

    render(<App />)
    // Assert responsive behavior
  })
})
```

### 5. API Integration Tests

#### CoinGecko API Tests

```typescript
describe('CoinGecko API Integration', () => {
  test('fetches real crypto data', async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/ping');
    expect(response.ok).toBe(true);
  });

  test('handles rate limiting', async () => {
    // Test multiple requests within rate limit
    const requests = Array(10)
      .fill(0)
      .map(() =>
        fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin'
        )
      );

    const responses = await Promise.allSettled(requests);
    const successfulRequests = responses.filter(r => r.status === 'fulfilled');
    expect(successfulRequests.length).toBeGreaterThan(0);
  });
});
```

## Mocking-Strategien

### 1. API Mocks

```typescript
// jest.setup.js
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));
```

### 2. WebGL/Three.js Mocks

```typescript
// Mock WebGL Context
const mockWebGLContext = {
  getParameter: () => 'WebGL Mock',
  createProgram: () => ({}),
  // ... weitere WebGL Methoden
};

HTMLCanvasElement.prototype.getContext = jest.fn(type => {
  if (type === 'webgl' || type === 'webgl2') {
    return mockWebGLContext;
  }
  return null;
});
```

### 3. Animation Mocks

```typescript
// Mock requestAnimationFrame
global.requestAnimationFrame = callback => {
  return setTimeout(callback, 16); // ~60 FPS
};
```

## Coverage Reports

### Coverage Goals

- **Statements**: ≥ 80%
- **Branches**: ≥ 80%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

### Coverage Ausnahmen

```javascript
// jest.config.js
collectCoverageFrom: [
  'components/**/*.{ts,tsx}',
  'app/**/*.{ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
  '!**/__tests__/**',
  '!**/coverage/**',
];
```

## Continuous Integration (CI)

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test:ci
      - uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm test:ci && pnpm lint"
    }
  }
}
```

## Performance Monitoring

### Metrics Tracking

1. **Bundle Size**: Wöchentliche Bundle-Size Reports
2. **Load Times**: Performance Budget Monitoring
3. **Memory Usage**: Memory Leak Detection
4. **FPS Monitoring**: 3D Animation Performance

### Tools

- **Jest**: Unit & Integration Testing
- **React Testing Library**: Component Testing
- **Puppeteer**: E2E Testing (geplant)
- **Lighthouse**: Performance Audits
- **Bundle Analyzer**: Bundle Size Analysis

## Best Practices

### 1. Test-Organisation

```
__tests__/
├── components/          # Komponenten-Tests
│   ├── dashboard/
│   ├── 3d/
│   └── ui/
├── integration/         # Integration Tests
├── performance/         # Performance Tests
└── utils/              # Test Utilities
```

### 2. Test-Naming Conventions

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    test('renders correctly with default props', () => {});
    test('renders error state when API fails', () => {});
  });

  describe('Interaction', () => {
    test('calls callback when button is clicked', () => {});
  });

  describe('Edge Cases', () => {
    test('handles missing data gracefully', () => {});
  });
});
```

### 3. Assertion Patterns

```typescript
// ✅ Specific Assertions
expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

// ✅ Async Assertions
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument();
});

// ✅ Error Boundaries
expect(console.error).toHaveBeenCalledWith(/* expected error */);
```

## Troubleshooting

### Häufige Probleme

1. **WebGL Tests Fehlschlagen**: Stelle sicher, dass WebGL-Mocks korrekt implementiert sind
2. **Async Tests Timeout**: Verwende `waitFor` für asynchrone Operationen
3. **Memory Leaks**: Überprüfe Cleanup in `useEffect`-Hooks
4. **Flaky Tests**: Vermeide Zeitabhängige Assertions

### Debug-Tools

```bash
# Jest Debug Mode
pnpm test --verbose --no-coverage

# Einzelnen Test debuggen
pnpm test CryptoDashboard.test.tsx --verbose

# Coverage Report öffnen
open coverage/lcov-report/index.html
```

## Metriken & KPIs

### Test-Qualität

- **Test Coverage**: 85%+ (Aktuell)
- **Test Execution Time**: < 30 Sekunden
- **Flaky Test Rate**: < 5%
- **Failed Tests**: 0 (Production)

### Performance KPIs

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

**Letzte Aktualisierung**: Juli 2025
**Version**: 1.0.0
**Nächste Review**: August 2025
