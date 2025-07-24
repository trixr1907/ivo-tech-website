# IVO-Tech Website - Architektur Dokumentation

## Überblick

Die IVO-Tech Website ist eine moderne, vollständig responsive Webanwendung mit fokussiertem Design für Desktop- und Mobilgeräte. Sie integriert hochwertige 3D-Grafiken, interaktive Spiele und Live-Daten-Dashboards.

## Technologie-Stack

### Frontend Framework

- **Next.js 14**: React-basiertes Full-Stack Framework mit App Router
- **TypeScript**: Typisierte Programmiersprache für bessere Entwicklererfahrung
- **Tailwind CSS**: Utility-first CSS Framework für schnelles Styling

### UI/UX Bibliotheken

- **Framer Motion**: Leistungsstarke Animationsbibliothek für React
- **Recharts**: Datenvisualisierung und Chart-Bibliothek
- **Lucide React**: Icon-Bibliothek mit modernen SVG-Icons

### 3D Graphics & Interaktivität

- **Three.js**: WebGL-basierte 3D-Grafikbibliothek
- **React Three Fiber (@react-three/fiber)**: React-Renderer für Three.js
- **React Three Drei (@react-three/drei)**: Utility-Komponenten für R3F

### Data Fetching

- **Axios**: HTTP-Client für API-Requests
- **CoinGecko API**: Externe API für Kryptowährungs-Daten

### Development Tools

- **PNPM**: Performanter Package Manager
- **Turbo**: Monorepo-Build-System für bessere Performance
- **ESLint**: Code-Linting für Codequalität
- **Prettier**: Code-Formatter für konsistente Formatierung

## Projekt-Struktur

```
ivo-tech-website/
├── apps/
│   └── web/                    # Haupt-Web-Anwendung
│       ├── app/                # Next.js App Router
│       │   ├── globals.css     # Globale Styles
│       │   ├── layout.tsx      # Root Layout
│       │   └── page.tsx        # Homepage
│       ├── components/         # React Komponenten
│       │   ├── 3d/            # 3D-Komponenten
│       │   ├── dashboard/     # Dashboard-Komponenten
│       │   ├── games/         # Spiel-Komponenten
│       │   ├── layout/        # Layout-Komponenten
│       │   └── ui/            # UI-Komponenten
│       ├── public/            # Statische Assets
│       └── package.json       # Package-Konfiguration
├── docs/                      # Dokumentation
├── packages/                  # Geteilte Packages
└── turbo.json                 # Turbo-Konfiguration
```

## Kern-Komponenten

### 1. Hero Section (`components/layout/Hero.tsx`)

- **Zweck**: Haupteingangsbereich der Website
- **Features**:
  - Animierte Typografie mit Typewriter-Effekt
  - Responsive Design für alle Bildschirmgrößen
  - Call-to-Action Buttons mit Hover-Effekten
  - Integration des 3D-Starfield-Hintergrunds

### 2. 3D Scene System

#### EpicScene3D (`components/3d/EpicScene3D.tsx`)

- **Zweck**: Hauptkontainer für 3D-Szenen
- **Technologien**: React Three Fiber, Three.js
- **Features**:
  - Responsive 3D-Canvas
  - Orbit Controls für Benutzerinteraktion
  - Optimierte Rendering-Performance
  - Modulare Szenen-Integration

#### ParallaxStarfield (`components/3d/ParallaxStarfield.tsx`)

- **Zweck**: Animierter Sternenhimmel-Hintergrund
- **Features**:
  - 1000+ animierte Sterne
  - Parallax-Scrolling-Effekt
  - Optimierte WebGL-Performance
  - Responsive Skalierung

#### Scene3D (`components/3d/Scene3D.tsx`)

- **Zweck**: Interaktive 3D-Objekte und Animationen
- **Features**:
  - Animierte geometrische Formen
  - Maus-basierte Interaktivität
  - Smooth Transitions
  - Material-Animationen

### 3. Interactive Games

#### CubePuzzle (`components/games/CubePuzzle.tsx`)

- **Zweck**: 3D Würfel-Puzzle Mini-Spiel
- **Features**:
  - Klickbare 3D-Würfel
  - Farbwechsel-Mechanik
  - Win-Condition Detection
  - Responsive Touch-Support

### 4. Live Data Dashboard

#### CryptoDashboard (`components/dashboard/CryptoDashboard.tsx`)

- **Zweck**: Echtzeit-Kryptowährungs-Dashboard
- **API Integration**: CoinGecko API
- **Features**:
  - Live-Preis-Updates alle 30 Sekunden
  - Interaktive Charts mit Recharts
  - 8 wichtige Kryptowährungen
  - Fallback Demo-Daten bei API-Fehlern
  - Market Summary Statistiken
  - Responsive Karten-Layout

### 5. Navigation & Layout

#### Navigation (`components/layout/Navigation.tsx`)

- **Features**:
  - Sticky Navigation
  - Responsive Mobile Menu
  - Animierte E-Mail-Adresse
  - Smooth Scrolling zu Sektionen

#### Login System (`components/ui/LoginModal.tsx`)

- **Features**:
  - Modal-basiertes Design
  - Formularvalidierung
  - Sichere Input-Felder
  - Backend-Integration vorbereitet

## Performance-Optimierungen

### 1. Code Splitting

- Next.js automatisches Code Splitting
- Lazy Loading für 3D-Komponenten
- Dynamische Imports für schwere Bibliotheken

### 2. 3D Performance

- Instanced Rendering für Sterne (1000+ Objekte)
- Frame-Rate-Optimierung mit useFrame
- Efficient Geometry-Management
- WebGL-optimierte Shader

### 3. API & Data Management

- Polling-basierte Updates (30s Intervalle)
- Error Handling mit Fallback-Daten
- Optimistische UI-Updates
- Request Deduplication

### 4. Asset Optimization

- SVG-Icons für skalierbare Grafiken
- Optimierte Bildformate
- Lazy Loading für Bilder
- Minimierte Bundle-Größe

## Responsive Design

### Breakpoints (Tailwind CSS)

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach

- Alle Komponenten sind mobile-optimiert
- Touch-Gesten für 3D-Interaktionen
- Optimierte Navigation für kleine Bildschirme
- Performance-Optimierungen für mobile Geräte

## API Integration

### CoinGecko API

- **Endpoint**: `https://api.coingecko.com/api/v3/coins/markets`
- **Rate Limit**: 50 Requests/Minute (Free Plan)
- **Daten**: Preise, Market Cap, Volumen, 24h-Änderungen
- **Fallback**: Demo-Daten bei API-Ausfällen

### Error Handling

- Graceful Degradation bei API-Fehlern
- User-Feedback bei Verbindungsproblemen
- Retry-Mechanismen
- Offline-Fähigkeiten (Demo-Modus)

## Browser-Kompatibilität

### Unterstützte Browser

- **Chrome**: 90+ ✅
- **Firefox**: 85+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### WebGL-Unterstützung

- WebGL 1.0 erforderlich für 3D-Features
- Automatische Degradation bei fehlendem WebGL
- Progressive Enhancement-Strategie

## Entwicklungs-Workflow

### Commands

```bash
# Development Server starten
pnpm --filter=ivo-tech-web dev

# Build für Produktion
pnpm --filter=ivo-tech-web build

# Production Server starten
pnpm --filter=ivo-tech-web start

# Alle Dependencies installieren
pnpm install

# Linting
pnpm --filter=ivo-tech-web lint
```

### Environment Variables

```env
# Für API-Keys (falls benötigt)
NEXT_PUBLIC_COINGECKO_API_KEY=optional
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Zukunftige Erweiterungen

### Geplante Features

1. **Backend Integration**: Authentication & User Management
2. **Portfolio Tracking**: Persönliche Krypto-Portfolios
3. **More Games**: Erweiterte Spiel-Sammlung
4. **Real-time Chat**: WebSocket-basierte Kommunikation
5. **PWA Support**: Progressive Web App Features
6. **Analytics**: Performance & User-Tracking

### Skalierungs-Überlegungen

- Database Integration (PostgreSQL/MongoDB)
- CDN für globale Performance
- Load Balancing für hohen Traffic
- Caching-Strategien (Redis)
- Monitoring & Observability (Sentry, Datadog)

## Security Considerations

### Frontend Security

- Input Sanitization
- XSS Protection durch React
- HTTPS-only in Produktion
- Secure Headers (Next.js)

### API Security

- Rate Limiting
- CORS-Konfiguration
- API-Key-Management
- Request Validation

---

**Letzte Aktualisierung**: Juli 2025
**Version**: 1.0.0
**Autor**: IVO-Tech Development Team
