# 🔧 Build-Fixes und Aktionsplan

## Identifizierte Probleme

### 1. TypeScript-Dependencies (Kritisch)
- PNPM Dependency-Konflikt: `ERR_PNPM_INCLUDED_DEPS_CONFLICT`
- Workspace-übergreifende TypeScript-Installation erforderlich
- Dev-Dependencies im Production-Build
- API-App fehlen TypeScript-Dependencies
- Workspace-übergreifende TypeScript-Konfiguration benötigt
- Dependency-Konflikte in der Monorepo-Struktur

### 2. Husky-Installation
- Husky-Hooks nicht korrekt installiert
- Pre-commit Hooks fehlen
- Package.json Konfiguration unvollständig

### 3. Build-Fehler
- API-Build schlägt fehl
- TypeScript-Validierung übersprungen
- Linting übersprungen

## Aktionsplan

### 1. Dependencies korrigieren (Überarbeitet)
```bash
# Workspace bereinigen
pnpm store prune
pnpm clean

# Root-Level neu aufsetzen
rm -rf node_modules pnpm-lock.yaml
pnpm install

# TypeScript global installieren
pnpm add -w typescript@5.8.3 @types/node @types/react @types/react-dom

# API-App spezifisch
cd apps/api
pnpm install
pnpm add -D typescript@5.8.3 @types/node @types/react

# Zurück zum Root und Dependencies prüfen
cd ../..
pnpm install
pnpm audit
# Root-Level TypeScript
pnpm add -Dw typescript@5.8.3

# API-App Dependencies
cd apps/api
pnpm add -D typescript@5.8.3
pnpm add -D @types/node @types/react
```

### 2. TypeScript-Konfiguration
```json
// tsconfig.json (Root)
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 3. Husky neu einrichten
```bash
# Husky neu installieren
rm -rf .husky
pnpm dlx husky-init && pnpm install
pnpm husky install

# Pre-commit Hook einrichten
npx husky add .husky/pre-commit "pnpm lint-staged"
```

### 4. Build-Prozess optimieren
```bash
# Clean Build
pnpm clean

# Dependencies neu installieren
pnpm install

# Type Checking erzwingen
pnpm check-types

# Linting durchführen
pnpm lint

# Production Build
pnpm build
```

## Nächste Schritte

1. **Dependencies bereinigen**
   - [ ] Doppelte Dependencies entfernen
   - [ ] Versionen vereinheitlichen
   - [ ] pnpm-workspace.yaml aktualisieren

2. **TypeScript Setup**
   - [ ] tsconfig.json in allen Apps prüfen
   - [ ] Gemeinsame Types extrahieren
   - [ ] Type-Checking aktivieren

3. **Build-Pipeline**
   - [ ] Build-Schritte validieren
   - [ ] Cache-Strategie überprüfen
   - [ ] CI/CD anpassen

4. **Testing**
   - [ ] Unit Tests aktualisieren
   - [ ] E2E Tests prüfen
   - [ ] TypeScript-Tests hinzufügen

## Monitoring & Validation

### Build-Metriken überwachen
- Build-Zeit
- Bundle-Größe
- Chunk-Verteilung
- Type Coverage

### Performance-Checks
- First Load JS
- Page Load Time
- Time to Interactive
- Core Web Vitals

### Error Tracking
- Build Logs
- Runtime Errors
- Type Errors
- Lint Warnings

## Timeline

1. **Tag 1: Setup & Fix**
   - Dependencies korrigieren
   - TypeScript einrichten
   - Husky konfigurieren

2. **Tag 2: Test & Validate**
   - Tests durchführen
   - Build verifizieren
   - Performance checken

3. **Tag 3: Deploy & Monitor**
   - Preview Deployment
   - Metriken sammeln
   - Dokumentation aktualisieren

## Kontakte

- **Tech Lead**: @techLead
- **DevOps**: @devOpsTeam
- **TypeScript Expert**: @tsExpert

_Erstellt: 2025-07-23_
_Status: In Bearbeitung_
