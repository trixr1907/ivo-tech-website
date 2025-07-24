param(
    [switch]$Preview
)

Write-Host "`n=== Build & Deploy ivo-tech.com ==="

# Build the web application
pnpm --filter ./apps/web run export

# Get the current commit hash
$Commit = git rev-parse --short HEAD

# Determine the branch based on the Preview flag
$Branch = if ($Preview) { "preview" } else { "manual" }

# Deploy to Cloudflare Pages
wrangler pages deploy apps/web/out --project-name=ivo-tech --commit-hash $Commit --branch $Branch

# Display deployment confirmation
$DeploymentUrl = if ($Preview) { "https://preview.ivo-tech.com" } else { "https://ivo-tech.com" }
Write-Host "Deployed commit $Commit to $DeploymentUrl"
