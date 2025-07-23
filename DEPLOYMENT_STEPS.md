# 🚀 Deployment-Schritte und Verifikation

## Pre-Deployment Setup

### 1. Environment-Konfiguration
```bash
# Prod Environment Variables überprüfen
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
NEXT_PUBLIC_API_URL=https://api.ivo-tech.com
API_URL=https://api.ivo-tech.com
DATABASE_URL=...
```

### 2. Dependencies Installation
```bash
# Dependencies neu installieren
pnpm install

# Husky Setup
pnpm dlx husky-init && pnpm install
pnpm husky install
```

### 3. Build-Verifikation
```bash
# Production Build
pnpm build

# Type Checking
pnpm check-types

# Linting
pnpm lint
```

## Deployment-Prozess

### 1. Pre-Deployment Checks
- [ ] Git Status clean
- [ ] Alle Tests erfolgreich
- [ ] Build erfolgreich
- [ ] Environment Variables gesetzt

### 2. Deployment auf Preview
```bash
# Preview Branch erstellen
git checkout -b preview/v1.4.0

# Preview Build
pnpm build
```

### 3. Production Deployment
```bash
# Auf main Branch wechseln
git checkout main

# Änderungen mergen
git merge preview/v1.4.0

# Tag erstellen
git tag v1.4.0

# Push auf Production
git push origin main --tags
```

## Post-Deployment Verifikation

### 1. URL-Tests
- [ ] https://ivo-tech.com/ erreichbar
- [ ] https://preview.ivo-tech.com/ funktional
- [ ] https://docs.ivo-tech.com/ aktualisiert

### 2. Funktionale Tests
- [ ] Navigation funktioniert
- [ ] API-Endpoints erreichbar
- [ ] 3D-Komponenten laden
- [ ] Performance-Metriken OK

### 3. Monitoring Setup
- [ ] Vercel Analytics aktiv
- [ ] Error Tracking eingerichtet
- [ ] Performance Monitoring läuft
- [ ] Alerts konfiguriert

## Rollback-Prozedur

### 1. Vercel Rollback
1. Vercel Dashboard öffnen
2. Deployments aufrufen
3. Letztes stabiles Deployment auswählen
4. "Rollback" ausführen

### 2. Git Rollback
```bash
# Auf vorherige Version zurück
git reset --hard v1.3.0

# Force Push (nur im Notfall!)
git push --force origin main
```

## Troubleshooting

### Common Issues
1. **Build Fehler**
   - Dependencies neu installieren
   - Cache löschen: `pnpm clean`
   - Node_modules neu aufbauen

2. **Performance Probleme**
   - Bundle Analyzer checken
   - Chunk Loading überprüfen
   - Asset Optimization prüfen

3. **API Fehler**
   - Environment Variables prüfen
   - API Endpoints testen
   - Logs analysieren

## Support & Monitoring

### Wichtige URLs
- **Vercel Dashboard**: https://vercel.com/ivo-tech
- **GitHub Repository**: https://github.com/ivo-tech
- **Docs**: https://docs.ivo-tech.com

### Kontakte
- **DevOps**: devops@ivo-tech.com
- **Support**: support@ivo-tech.com
- **Emergency**: +49 123 456789

## Checklisten

### Pre-Flight Checklist
- [ ] Alle Tests grün
- [ ] Build erfolgreich
- [ ] Dependencies aktuell
- [ ] Git Status clean
- [ ] Env Vars gesetzt
- [ ] Monitoring aktiv

### Post-Deployment Checklist
- [ ] Seite erreichbar
- [ ] Performance OK
- [ ] Keine Error Logs
- [ ] API funktional
- [ ] Analytics aktiv
- [ ] Monitoring läuft

_Letzte Aktualisierung: 2025-07-23 00:07_
