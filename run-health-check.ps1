$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$results = @{}

# Führe die Checks aus und erfasse die Ausgabe
$output = pnpm turbo run lint check-types build 2>&1
$testOutput = pnpm test 2>&1

# Speichere die Ergebnisse
$results.Add("lint", $output)
$results.Add("test", $testOutput)

# Aktualisiere die Markdown-Datei mit den Ergebnissen
# [Logik für die Aktualisierung der MD-Datei]
