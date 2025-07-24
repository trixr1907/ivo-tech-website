# Entwicklungsworkflow

Dieses Dokument beschreibt den Entwicklungsworkflow und die verfügbaren Entwicklungswerkzeuge für das Projekt.

## Verfügbare Befehle

Das Projekt verwendet Turborepo als Build-System. Folgende Befehle stehen zur Verfügung:

```bash
# Startet den Entwicklungsserver
turbo run dev

# Baut das Projekt
turbo run build

# Führt Code-Linting durch
turbo run lint

# Führt TypeScript-Typenprüfung durch
turbo run check-types
```

## Code-Qualität

### Pre-commit Hooks

Das Projekt verwendet Husky für Git Pre-commit Hooks. Diese Hooks stellen sicher, dass der Code bestimmte Qualitätsstandards erfüllt, bevor er committet werden kann.

### Automatische Formatierung

Lint-staged wird verwendet, um den Code automatisch zu formatieren, bevor er committet wird. Dies stellt sicher, dass der Code einheitlich formatiert ist.

### Code-Formatierung

Prettier wird für die konsistente Formatierung von JavaScript- und TypeScript-Dateien verwendet. Die Konfiguration verwendet:

- 2 Leerzeichen für die Einrückung
- Automatische Formatierung beim Speichern (wenn in der IDE aktiviert)
- Automatische Formatierung vor jedem Commit durch lint-staged

## Typischer Entwicklungsablauf

1. Starte den Entwicklungsserver:

   ```bash
   turbo run dev
   ```

2. Entwickle deine Features/Fixes
   - Der Entwicklungsserver unterstützt Hot Reloading
   - Änderungen werden automatisch neu kompiliert

3. Vor dem Commit:
   - Die Pre-commit Hooks führen automatisch durch:
     - Code-Formatierung mit Prettier
     - Linting
     - Typenprüfung

4. Baue das Projekt für die Produktion:
   ```bash
   turbo run build
   ```

## Tipps

- Die TypeScript-Typenprüfung kann jederzeit manuell ausgeführt werden:
  ```bash
  turbo run check-types
  ```
- Das Linting kann auch manuell durchgeführt werden:
  ```bash
  turbo run lint
  ```
