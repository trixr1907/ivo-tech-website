# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [0.1.1] - 2024-03-19

### Sicherheit
- Aktualisierung von multer auf Version 2.0.2 zur Behebung einer DoS-Schwachstelle
- Aktualisierung von next.js auf Version 15.3.3 zur Behebung einer Cache-Poisoning-Schwachstelle

### Bekannte Probleme
- Niedrige Sicherheitsrisiken in Abhängigkeiten:
  - brace-expansion (2.0.1) in jest-Abhängigkeiten
  - next.js (15.3.0) in verschiedenen @vercel-Paketen

### Minimale Anforderungen
- Node.js >= 18.17.0
- pnpm >= 8.0.0
