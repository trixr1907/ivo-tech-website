# Deploy script for static 3D build

# Stop on error
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting static deployment with 3D features..."

# 1. Clean old builds
Write-Host "`n🧹 Cleaning previous builds..."
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }

# 2. Backup and replace next.config.js
Write-Host "`n📝 Setting up static build configuration..."
if (Test-Path "next.config.js") {
    Copy-Item "next.config.js" "next.config.js.backup"
    Copy-Item "next.static.config.js" "next.config.js"
}

try {
    # 3. Run optimized static build
    Write-Host "`n🔨 Building static version..."
    $env:NODE_ENV = "production"
    $env:NEXT_TELEMETRY_DISABLED = "1"
    
    npm run build
    
    # 4. Create static export
    Write-Host "`n📦 Generating static files..."
    npm run export
    
    # 5. Prepare for deployment
    Write-Host "`n🛠️  Preparing deployment..."
    
    # Create Vercel config if it doesn't exist
    $vercelConfig = @{
        "version" = 2
        "builds" = @(
            @{
                "src" = "out/**"
                "use" = "@vercel/static"
            }
        )
        "routes" = @(
            @{
                "src" = "/(.*)"
                "dest" = "/out/$1"
            }
        )
    }
    
    $vercelConfig | ConvertTo-Json -Depth 10 | Set-Content "vercel.json"
    
    # 6. Deploy to Vercel
    Write-Host "`n☁️  Deploying to Vercel..."
    vercel --prod
    
    Write-Host "`n✅ Deployment completed successfully!"
} catch {
    Write-Host "`n❌ Error during deployment: $_"
    exit 1
} finally {
    # 7. Cleanup
    Write-Host "`n🧹 Cleaning up..."
    if (Test-Path "next.config.js.backup") {
        Remove-Item "next.config.js"
        Move-Item "next.config.js.backup" "next.config.js"
    }
}

Write-Host "`n🎉 Deployment process finished!"
Write-Host "Visit your Vercel dashboard to see the deployment status."
