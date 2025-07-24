#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

###########################
# Warp AI Extraction Script
#   1. Scannt das Repo nach:
#      - package.json-Dateien
#      - turborepo-Konfigurationen
#      - .env*, .npmrc, .nvmrc, .tool-versions
#      - CI-Workflows (GitHub Actions, GitLab CI, etc.)
#   2. Speichert Findings als JSON (scan-result.json)
###########################

ROOT_DIR="$(git rev-parse --show-toplevel)"
OUTPUT_FILE="warp-scan-result.json"
cd "$ROOT_DIR"

echo "🚀 [Warp-Scan] Starte Projekt-Discovery im Verzeichnis: $ROOT_DIR"

# Hilfsfunktion: JSON-Escape
json_escape () {
  printf '%s' "$1" | python -c 'import json,sys,urllib.parse,sys;print(json.dumps(sys.stdin.read()))'
}

# 1. Alle package.json-Dateien finden
mapfile -d '' PKG_FILES < <(find . -name "package.json" -not -path "*/node_modules/*" -print0)

# 2. turborepo-Konfig finden
TURBO_FILE=$( [ -f turbo.json ] && echo "turbo.json" || echo "" )

# 3. ENV-Dateien
mapfile -d '' ENV_FILES < <(find . -maxdepth 1 -name ".env*" -print0)

# 4. CI-Konfigs
CI_FILES=$(ls -1 .github/workflows/*.yml 2>/dev/null || true)

# 5. NPM/Yarn/Pnpm config
[ -f .npmrc ] && NPMRC=".npmrc" || NPMRC=""
[ -f .yarnrc.yml ] && YARNRC=".yarnrc.yml" || YARNRC=""
[ -f pnpm-workspace.yaml ] && PNPM_WS="pnpm-workspace.yaml" || PNPM_WS=""

#####################################
# JSON-Zusammenstellung
#####################################
echo "{"                                                          >  "$OUTPUT_FILE"
echo "  \"root\": $(json_escape "$ROOT_DIR"),"                    >> "$OUTPUT_FILE"

# package.json-Liste
echo "  \"packages\": ["                                          >> "$OUTPUT_FILE"
for f in "${PKG_FILES[@]}"; do
  echo "    $(json_escape "$f"),"                                 >> "$OUTPUT_FILE"
done | sed '$ s/,$//'                                             >> "$OUTPUT_FILE"
echo "  ],"                                                       >> "$OUTPUT_FILE"

# turbo.json
echo "  \"turboConfig\": $(json_escape "$TURBO_FILE"),"           >> "$OUTPUT_FILE"

# env-Dateien
echo "  \"envFiles\": ["                                          >> "$OUTPUT_FILE"
for e in "${ENV_FILES[@]}"; do
  echo "    $(json_escape "$e"),"                                 >> "$OUTPUT_FILE"
done | sed '$ s/,$//'                                             >> "$OUTPUT_FILE"
echo "  ],"                                                       >> "$OUTPUT_FILE"

# CI
echo "  \"ciWorkflows\": $(json_escape "$CI_FILES"),"             >> "$OUTPUT_FILE"

# Tool-Configs
echo "  \"npmrc\": $(json_escape "$NPMRC"),"                      >> "$OUTPUT_FILE"
echo "  \"yarnrc\": $(json_escape "$YARNRC"),"                    >> "$OUTPUT_FILE"
echo "  \"pnpmWorkspace\": $(json_escape "$PNPM_WS")"             >> "$OUTPUT_FILE"

echo "}"                                                          >> "$OUTPUT_FILE"

echo "✅ Scan abgeschlossen – Ergebnis gespeichert in $OUTPUT_FILE"
