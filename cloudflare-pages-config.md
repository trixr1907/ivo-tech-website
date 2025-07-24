# Cloudflare Pages Konfiguration für ivo-tech-web

## ✅ Projekt-Validierung

- **Build-Befehl getestet**: `pnpm --filter=ivo-tech-web... run export` funktioniert einwandfrei
- **Output-Verzeichnis bestätigt**: `apps/web/out` wird korrekt erstellt
- **Next.js Konfiguration**: Static Export ist bereits konfiguriert (`output: "export"`)

## 🔧 Cloudflare Pages Einstellungen

### 1. Projekt erstellen

1. Gehen Sie zu **Cloudflare Dashboard** → **Pages** → **"Create project"**
2. Wählen Sie **"Connect to Git"** oder **"Direct upload"**
3. Verbinden Sie Ihr Repository: `ivo-tech`

### 2. Build-Einstellungen

```
Build command: pnpm --filter=ivo-tech-web... run export
Build output directory: apps/web/out
Root directory: (leer lassen)
```

### 3. Umgebungsvariablen

Fügen Sie diese Environment Variables hinzu:

```
NODE_VERSION=18
TURBO_TOKEN=(optional, nur wenn Sie Remote Cache verwenden)
```

### 4. Deployment-Einstellungen

- ✅ **Automatic deployments** aktivieren
- ✅ Branch: `main`
- ❌ **Framework-Erkennung deaktivieren** ("Webpack5 / Next14+" → disabled)

### 5. Erweiterte Einstellungen

- **Build system**: v2 (empfohlen)
- **Node.js version**: 18 (über Environment Variable gesetzt)
- **Package manager**: pnpm (automatisch erkannt)

## 📋 Konfigurationszusammenfassung

| Einstellung            | Wert                                       |
| ---------------------- | ------------------------------------------ |
| Build command          | `pnpm --filter=ivo-tech-web... run export` |
| Build output directory | `apps/web/out`                             |
| Node version           | 18                                         |
| Framework detection    | Disabled                                   |
| Auto deployments       | Enabled (main branch)                      |

## 🔍 Wichtige Hinweise

1. **Framework-Erkennung deaktivieren**: Da wir bereits statische Dateien exportieren, sollte die automatische Framework-Erkennung deaktiviert bleiben.

2. **Turbo Filter**: Der Filter `ivo-tech-web...` stellt sicher, dass nur die Web-App und ihre Abhängigkeiten gebaut werden.

3. **Static Export**: Die Next.js Konfiguration ist bereits für statischen Export optimiert.

4. **Build-Validierung**: Der Build wurde lokal getestet und funktioniert einwandfrei.

## 🚀 Nach der Konfiguration

Nach der Einrichtung wird Cloudflare Pages automatisch:

- Bei jedem Push auf `main` ein Deployment starten
- Den Build-Befehl ausführen
- Die Dateien aus `apps/web/out` deployen
- Eine eindeutige URL für jede Vorschau bereitstellen

Ihr Projekt ist bereit für die Cloudflare Pages Konfiguration!
