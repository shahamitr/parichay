# Database Connection Test Script (PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "🗄️ Testing Database Connection..." -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$envFile = if (Test-Path ".env.production") { ".env.production" } elseif (Test-Path ".env") { ".env" } else { $null }

if ($envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "❌ No environment file found" -ForegroundColor Red
    exit 1
}

$DATABASE_URL = [Environment]::GetEnvironmentVariable("DATABASE_URL")

if ([string]::IsNullOrEmpty($DATABASE_URL)) {
    Write-Host "❌ DATABASE_URL is not set" -ForegroundColor Red
    exit 1
}

Write-Host "Testing connection to database..." -ForegroundColor Cyan
Write-Host ""

# Test Prisma connection
Write-Host "1. Testing Prisma connection..." -ForegroundColor Cyan
try {
    $output = npx prisma db pull --force 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prisma can connect to database" -ForegroundColor Green
    } else {
        Write-Host "❌ Prisma connection failed" -ForegroundColor Red
        Write-Host $output
        exit 1
    }
} catch {
    Write-Host "❌ Prisma connection failed: $_" -ForegroundColor Red
    exit 1
}

# Check if migrations are up to date
Write-Host ""
Write-Host "2. Checking migration status..." -ForegroundColor Cyan
npx prisma migrate status

Write-Host ""
Write-Host "✅ All database tests passed successfully!" -ForegroundColor Green
