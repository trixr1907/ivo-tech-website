# Erstelle out-Verzeichnis aus .next-Build

$WebPath = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\apps\web"
$NextPath = "$WebPath\.next"
$OutPath = "$WebPath\out"

Write-Host "Erstelle out-Verzeichnis..." -ForegroundColor Green

# Erstelle out-Verzeichnis
if (Test-Path $OutPath) {
    Remove-Item -Recurse -Force $OutPath
}
New-Item -ItemType Directory -Path $OutPath -Force

# Kopiere statische Dateien
if (Test-Path "$NextPath\static") {
    Write-Host "Kopiere statische Dateien..." -ForegroundColor Yellow
    Copy-Item -Path "$NextPath\static" -Destination "$OutPath\_next\static" -Recurse -Force
}

# Kopiere Server-Dateien
if (Test-Path "$NextPath\server") {
    Write-Host "Kopiere Server-Dateien..." -ForegroundColor Yellow
    
    # Kopiere HTML-Dateien
    $ServerAppPath = "$NextPath\server\app"
    if (Test-Path $ServerAppPath) {
        # Kopiere index.html
        if (Test-Path "$ServerAppPath\index.html") {
            Copy-Item -Path "$ServerAppPath\index.html" -Destination "$OutPath\index.html" -Force
        }
        
        # Kopiere 404.html
        if (Test-Path "$ServerAppPath\not-found.html") {
            Copy-Item -Path "$ServerAppPath\not-found.html" -Destination "$OutPath\404.html" -Force
        }
        
        # Kopiere weitere HTML-Dateien
        Get-ChildItem -Path $ServerAppPath -Filter "*.html" | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination "$OutPath\$($_.Name)" -Force
        }
    }
}

# Kopiere public-Dateien
if (Test-Path "$WebPath\public") {
    Write-Host "Kopiere public-Dateien..." -ForegroundColor Yellow
    Get-ChildItem -Path "$WebPath\public" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "$OutPath\$($_.Name)" -Recurse -Force
    }
}

# Erstelle einfache index.html falls keine vorhanden
if (-not (Test-Path "$OutPath\index.html")) {
    Write-Host "Erstelle einfache index.html..." -ForegroundColor Yellow
    $SimpleHtml = @"
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IVO-Tech</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .hero { text-align: center; padding: 40px 0; }
        .feature { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }
        .footer { text-align: center; margin-top: 40px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>IVO-Tech</h1>
            <p>Willkommen bei IVO-Tech - Ihre technische Lösung für moderne Herausforderungen</p>
        </div>
        
        <div class="feature">
            <h3>Innovation</h3>
            <p>Modernste Technologien für zukunftssichere Lösungen</p>
        </div>
        
        <div class="feature">
            <h3>Qualität</h3>
            <p>Höchste Standards in allen Bereichen</p>
        </div>
        
        <div class="feature">
            <h3>Service</h3>
            <p>Persönlicher Support und Betreuung</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 IVO-Tech. Alle Rechte vorbehalten.</p>
        </div>
    </div>
</body>
</html>
"@
    $SimpleHtml | Out-File -FilePath "$OutPath\index.html" -Encoding UTF8
}

Write-Host "Out-Verzeichnis erstellt: $OutPath" -ForegroundColor Green
Get-ChildItem $OutPath | Select-Object Name, Length
