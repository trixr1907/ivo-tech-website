# 🚀 IVO-TECH Website

Moderne, hochperformante Website mit 3D-Animationen und Enterprise-Level Optimierungen.

## 🌐 Live Website

**Production**: [https://ivo-tech-3io3oirxw-trixr1907s-projects.vercel.app](https://ivo-tech-3io3oirxw-trixr1907s-projects.vercel.app)

## ✨ Features

- 🎯 **3D WebGL Animationen** - Interaktive Logo-Animation mit Three.js
- 📱 **Responsive Design** - Mobile-first Approach mit Tailwind CSS
- ⚡ **Performance Optimiert** - Bundle < 110KB, Lighthouse Score > 90
- 🔍 **SEO Ready** - Complete Meta Tags, Sitemap, Structured Data
- 📊 **Real-time Analytics** - Vercel Analytics + Performance Monitoring
- 🛡️ **TypeScript Strict** - Vollständige Typensicherheit
- 🧪 **E2E Testing** - Playwright Cross-Browser Tests

## 🏗️ Projekt-Architektur

Diese Turborepo-Monorepo Struktur umfasst:

### Apps und Packages

- `web/` - Haupt-Website (Next.js 15.3.5 + React 19.1.0)
- `docs/` - Dokumentation (Next.js)
- `api/` - Backend-Services
- `packages/ui/` - Shared UI Components
- `packages/config-*` - Shared Configurations (ESLint, TypeScript, Tailwind)

Alle Packages sind 100% [TypeScript](https://www.typescriptlang.org/) mit strikter Konfiguration.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.3.5 mit App Router
- **UI Library**: React 19.1.0 + TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **3D Graphics**: Three.js + @react-three/fiber
- **Animations**: Framer Motion 12.23.6
- **Icons**: Custom SVG + Lucide React

### Tools & Configuration

- **Build System**: Turborepo Monorepo
- **Package Manager**: npm (uv für Python)
- **Code Quality**: ESLint + Prettier (2-Space Indentation)
- **Type Checking**: TypeScript Strict Mode
- **Testing**: Playwright E2E + Jest Unit Tests

### Deployment & Analytics

- **Hosting**: Vercel Edge Network
- **Analytics**: Vercel Analytics + Speed Insights
- **Monitoring**: Real-time Performance Tracking
- **SEO**: Automated Sitemap + Robots.txt

## 🚀 Schnellstart

### Prerequisites

```bash
node >= 18.17.0
npm >= 9.0.0
```

### Installation

```bash
# Repository klonen
git clone https://github.com/trixr1907/ivo-tech-website.git
cd ivo-tech-website

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

### Entwicklung

```bash
# Hauptwebsite entwickeln
cd apps/web
npm run dev
# → http://localhost:3000

# Alle Apps parallel
turbo dev

# Spezifische App
turbo dev --filter=web
```

### Build & Deployment

```bash
# Production Build
npm run build

# Statischer Export
cd apps/web
npm run build && npm run export

# Vercel Deployment
vercel
```

### Automatisierte Health-Checks

Das Projekt verwendet automatisierte Health-Checks, die bei jedem Commit und Push ausgeführt werden:

- **Pre-Commit Hook**: Führt den Health-Check vor jedem Commit aus und stellt sicher, dass die `project-health.md` aktualisiert wird
- **Pre-Push Hook**: Führt den Health-Check vor jedem Push aus

Die Health-Checks überprüfen:
- Code-Qualität und Formatting
- Test-Coverage
- Performance-Metriken
- Dependency-Status

Alle Ergebnisse werden automatisch in der `project-health.md` dokumentiert.

### Testing

```bash
# E2E Tests (Playwright)
cd apps/web
npm run test:e2e

# Unit Tests
npm run test

# Test Coverage
npm run test:coverage
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
