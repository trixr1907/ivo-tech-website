# syntax=docker/dockerfile:1.4

# Basis-Image
FROM node:20-alpine AS base

# Systemabhängigkeiten und BuildKit Caching
RUN --mount=type=cache,target=/var/cache/apk apk add --no-cache \
    python3 \
    make \
    g++

# Security Optimierungen
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY --chown=nextjs:nodejs package*.json ./

# Installiere Abhängigkeiten mit Cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Kopiere Anwendungscode
COPY --chown=nextjs:nodejs . .

# Build der Anwendung
RUN npm run build

# Benutzer wechseln
USER nextjs

# Exponiere Port
EXPOSE 3000

# Healthcheck konfigurieren
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Starte Anwendung
CMD ["npm", "start"]
