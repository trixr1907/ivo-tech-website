#!/usr/bin/env pwsh

Write-Host "🚀 Deploying IVO-TECH 3D Experience to Vercel" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Navigate to web directory
Set-Location apps/web

# Clean previous builds
Write-Host "`n🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
}
if (Test-Path out) {
    Remove-Item -Recurse -Force out
}

# Set environment
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Build with export config
Write-Host "`n📦 Building static export..." -ForegroundColor Yellow

# Create temporary next.config for static export
$staticConfig = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    optimizeCss: true,
  },
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
"@

# Backup original config
Copy-Item next.config.js next.config.js.backup

# Write static config
$staticConfig | Out-File -FilePath next.config.js -Encoding UTF8

try {
    # Build the static site
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Build successful!" -ForegroundColor Green
        
        # Deploy to Vercel
        Write-Host "`n🌐 Deploying to Vercel..." -ForegroundColor Cyan
        vercel --prod --yes
        
        Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Build failed!" -ForegroundColor Red
    }
} finally {
    # Restore original config
    Move-Item -Force next.config.js.backup next.config.js
}

Set-Location ../..
