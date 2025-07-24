# Environment Variables Configuration

## Übersicht

Dieses Monorepo verwendet verschiedene Environment-Variables für die Konfiguration der Apps und Services. Diese Dokumentation erklärt die Struktur und den sicheren Umgang mit sensiblen Daten.

## 📁 Dateistruktur

```
ivo-tech-website/
├── .env.example                 # Root-Level Variablen für das gesamte Monorepo
├── apps/
│   ├── web/.env.example        # Web-App spezifische Variablen
│   ├── api/.env.example        # API-App spezifische Variablen
│   └── docs/.env.example       # Docs-App spezifische Variablen
└── turbo.json                  # Turbo konfiguriert für Environment-Variables
```

## 🔧 Setup

### 1. Lokale Entwicklung

```bash
# Root-Level Konfiguration
cp .env.example .env.local

# Web App Konfiguration
cp apps/web/.env.example apps/web/.env.local

# Füllen Sie die Werte entsprechend aus
```

### 2. Turbo.json Konfiguration

Die `turbo.json` ist so konfiguriert, dass sie folgende Variable-Pattern überwacht:

```json
{
  "tasks": {
    "build": {
      "env": ["NEXT_PUBLIC_*", "ANALYTICS_ID", "API_URL"]
    },
    "dev": {
      "env": ["NEXT_PUBLIC_*", "ANALYTICS_ID", "API_URL"]
    }
  }
}
```

## 🔒 Sicherheitsrichtlinien

### Öffentliche Variablen (NEXT*PUBLIC*\*)

Diese Variablen werden **im Browser-Bundle eingebettet** und sind für jeden sichtbar:

```bash
NEXT_PUBLIC_ANALYTICS_ID=GA-XXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://ivo-tech.com
NEXT_PUBLIC_API_URL=https://api.ivo-tech.com
```

⚠️ **WARNUNG**: Niemals sensible Daten in `NEXT_PUBLIC_*` Variablen speichern!

### Private Variablen (Server-only)

Diese Variablen sind **NUR** auf dem Server verfügbar:

```bash
API_URL=https://api.ivo-tech.com
DATABASE_URL=postgresql://...
JWT_SECRET=supersecret123
STRIPE_SECRET_KEY=sk_live_...
```

## 🚀 Deployment Konfiguration

### Vercel Dashboard

Sensible Variablen sollten über das **Vercel Dashboard** gesetzt werden:

1. **Projekt Settings** → **Environment Variables**
2. Variablen für unterschiedliche Environments setzen:
   - **Production**: `VERCEL_ENV=production`
   - **Preview**: `VERCEL_ENV=preview`
   - **Development**: `VERCEL_ENV=development`

### Empfohlene Vercel-Variablen

```bash
# Über Vercel Dashboard setzen:
ANALYTICS_ID=your_analytics_id
API_URL=https://api.ivo-tech.com
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
OPENAI_API_KEY=...
```

## 🔄 Husky Pre-commit Hooks

Der Pre-commit Hook führt folgende Checks aus:

```bash
#!/bin/sh
echo "🔍 Running pre-commit checks..."

# 1. Linting
pnpm lint

# 2. Type checking
pnpm check-types

# 3. Unit tests
pnpm turbo run test --parallel

echo "✅ All checks passed!"
```

## 📋 Variable-Kategorien

### 1. **Analytics & Tracking**

```bash
NEXT_PUBLIC_ANALYTICS_ID=GA-XXXXXXXXX
NEXT_PUBLIC_GTAG_ID=GT-XXXXXXXXX
ANALYTICS_ID=server_analytics_id
```

### 2. **API Konfiguration**

```bash
API_URL=https://api.ivo-tech.com
NEXT_PUBLIC_API_URL=https://api.ivo-tech.com
API_VERSION=v1
API_TIMEOUT=5000
```

### 3. **Database & Services**

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
```

### 4. **Authentication**

```bash
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

### 5. **Third-party Services**

```bash
STRIPE_SECRET_KEY=sk_...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
```

## 🧪 Testing Environment

```bash
# Test-spezifische Variablen
NODE_ENV=test
CI=false
BASE_URL=http://localhost:3000
COVERAGE_THRESHOLD=80
```

## ❌ Häufige Fehler

### 1. **Öffentliche Variablen verwechseln**

```bash
# ❌ FALSCH - sensible Daten öffentlich
NEXT_PUBLIC_API_SECRET=secret123

# ✅ RICHTIG - sensible Daten privat
API_SECRET=secret123
```

### 2. **Vercel Variablen nicht setzen**

```bash
# ❌ FALSCH - nur in .env.local
DATABASE_URL=postgresql://...

# ✅ RICHTIG - über Vercel Dashboard setzen
```

### 3. **Turbo Cache-Invalidierung**

```bash
# ❌ FALSCH - Variable nicht in turbo.json
MY_SECRET_VAR=value

# ✅ RICHTIG - Variable in turbo.json env Array
"env": ["MY_SECRET_VAR"]
```

## 🛠️ Troubleshooting

### Variable wird nicht geladen

1. **Überprüfen Sie den Variablennamen**:

   ```bash
   # ❌ Typo
   NEXT_PUBIC_API_URL=...

   # ✅ Korrekt
   NEXT_PUBLIC_API_URL=...
   ```

2. **Turbo.json aktualisieren**:

   ```json
   {
     "tasks": {
       "build": {
         "env": ["YOUR_NEW_VARIABLE"]
       }
     }
   }
   ```

3. **Server neu starten**:
   ```bash
   pnpm dev
   ```

### Turbo Cache leeren

```bash
pnpm turbo clean
pnpm dev
```

## 📚 Weitere Ressourcen

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Turbo Environment Variables](https://turbo.build/repo/docs/core-concepts/monorepos/configuring-workspaces#environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
