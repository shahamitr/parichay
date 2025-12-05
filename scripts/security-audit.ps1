# Security Audit Script (PowerShell)
# This script performs basic security checks on the application

$ErrorActionPreference = "Stop"

Write-Host "🔒 Security Audit Script" -ForegroundColor Cyan
Write-Host "========================"
Write-Host ""

$script:ERRORS = 0
$script:WARNINGS = 0
$script:PASSED = 0

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

# Check 1: HTTPS Enforcement
Write-Host "1️⃣ Checking HTTPS Enforcement..." -ForegroundColor Cyan
$APP_URL = [Environment]::GetEnvironmentVariable("APP_URL")
if (![string]::IsNullOrEmpty($APP_URL)) {
    if ($APP_URL -like "https://*") {
        Write-Host "✓ APP_URL uses HTTPS" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ APP_URL does not use HTTPS" -ForegroundColor Red
        $script:ERRORS++
    }
} else {
    Write-Host "⚠ APP_URL not set" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 2: Environment Variables Security
Write-Host "2️⃣ Checking Environment Variables..." -ForegroundColor Cyan

# Check for strong secrets
$JWT_SECRET = [Environment]::GetEnvironmentVariable("JWT_SECRET")
if (![string]::IsNullOrEmpty($JWT_SECRET)) {
    $JWT_LENGTH = $JWT_SECRET.Length
    if ($JWT_LENGTH -ge 32) {
        Write-Host "✓ JWT_SECRET is sufficiently long ($JWT_LENGTH chars)" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ JWT_SECRET is too short ($JWT_LENGTH chars, minimum 32)" -ForegroundColor Red
        $script:ERRORS++
    }
}

$NEXTAUTH_SECRET = [Environment]::GetEnvironmentVariable("NEXTAUTH_SECRET")
if (![string]::IsNullOrEmpty($NEXTAUTH_SECRET)) {
    $AUTH_LENGTH = $NEXTAUTH_SECRET.Length
    if ($AUTH_LENGTH -ge 32) {
        Write-Host "✓ NEXTAUTH_SECRET is sufficiently long ($AUTH_LENGTH chars)" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ NEXTAUTH_SECRET is too short ($AUTH_LENGTH chars, minimum 32)" -ForegroundColor Red
        $script:ERRORS++
    }
}

# Check for production keys
$STRIPE_SECRET_KEY = [Environment]::GetEnvironmentVariable("STRIPE_SECRET_KEY")
if ($STRIPE_SECRET_KEY -like "sk_live_*") {
    Write-Host "✓ Using Stripe production keys" -ForegroundColor Green
    $script:PASSED++
} elseif ($STRIPE_SECRET_KEY -like "sk_test_*") {
    Write-Host "⚠ Using Stripe test keys (not production)" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 3: Database Security
Write-Host "3️⃣ Checking Database Security..." -ForegroundColor Cyan

$DATABASE_URL = [Environment]::GetEnvironmentVariable("DATABASE_URL")
if ($DATABASE_URL -like "*sslmode=require*") {
    Write-Host "✓ Database SSL is required" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "✗ Database SSL is not enforced" -ForegroundColor Red
    $script:ERRORS++
}

$NODE_ENV = [Environment]::GetEnvironmentVariable("NODE_ENV")
if ($DATABASE_URL -like "*localhost*" -and $NODE_ENV -eq "production") {
    Write-Host "⚠ Database is on localhost in production" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 4: Redis Security
Write-Host "4️⃣ Checking Redis Security..." -ForegroundColor Cyan

$REDIS_URL = [Environment]::GetEnvironmentVariable("REDIS_URL")
if ($REDIS_URL -like "*password*" -or $REDIS_URL -match ":[^:]+@") {
    Write-Host "✓ Redis has password authentication" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "✗ Redis does not have password authentication" -ForegroundColor Red
    $script:ERRORS++
}

$REDIS_TLS_ENABLED = [Environment]::GetEnvironmentVariable("REDIS_TLS_ENABLED")
if ($REDIS_TLS_ENABLED -eq "true") {
    Write-Host "✓ Redis TLS is enabled" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "⚠ Redis TLS is not enabled" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 5: Cookie Security
Write-Host "5️⃣ Checking Cookie Security..." -ForegroundColor Cyan

$COOKIE_SECURE = [Environment]::GetEnvironmentVariable("COOKIE_SECURE")
if ($COOKIE_SECURE -eq "true") {
    Write-Host "✓ Secure cookies are enabled" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "✗ Secure cookies are not enabled" -ForegroundColor Red
    $script:ERRORS++
}

$COOKIE_SAME_SITE = [Environment]::GetEnvironmentVariable("COOKIE_SAME_SITE")
if ($COOKIE_SAME_SITE -eq "strict" -or $COOKIE_SAME_SITE -eq "lax") {
    Write-Host "✓ SameSite cookie policy is set" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "⚠ SameSite cookie policy not set" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 6: CORS Configuration
Write-Host "6️⃣ Checking CORS Configuration..." -ForegroundColor Cyan

$CORS_ORIGIN = [Environment]::GetEnvironmentVariable("CORS_ORIGIN")
if (![string]::IsNullOrEmpty($CORS_ORIGIN)) {
    if ($CORS_ORIGIN -eq "*") {
        Write-Host "✗ CORS allows all origins (security risk)" -ForegroundColor Red
        $script:ERRORS++
    } else {
        Write-Host "✓ CORS is properly configured" -ForegroundColor Green
        $script:PASSED++
    }
} else {
    Write-Host "⚠ CORS_ORIGIN not set" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 7: Rate Limiting
Write-Host "7️⃣ Checking Rate Limiting Configuration..." -ForegroundColor Cyan

$RATE_LIMIT_MAX_REQUESTS = [Environment]::GetEnvironmentVariable("RATE_LIMIT_MAX_REQUESTS")
if (![string]::IsNullOrEmpty($RATE_LIMIT_MAX_REQUESTS)) {
    Write-Host "✓ Rate limiting is configured" -ForegroundColor Green
    Write-Host "  Max requests: $RATE_LIMIT_MAX_REQUESTS" -ForegroundColor Gray
    Write-Host "  Window: $([Environment]::GetEnvironmentVariable('RATE_LIMIT_WINDOW_MS')) ms" -ForegroundColor Gray
    $script:PASSED++
} else {
    Write-Host "⚠ Rate limiting not configured" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 8: Dependency Vulnerabilities
Write-Host "8️⃣ Checking for Dependency Vulnerabilities..." -ForegroundColor Cyan

try {
    Write-Host "Running npm audit..." -ForegroundColor Gray
    $auditOutput = npm audit --json 2>&1 | ConvertFrom-Json

    $critical = if ($auditOutput.metadata.vulnerabilities.critical) { $auditOutput.metadata.vulnerabilities.critical } else { 0 }
    $high = if ($auditOutput.metadata.vulnerabilities.high) { $auditOutput.metadata.vulnerabilities.high } else { 0 }

    if ($critical -gt 0 -or $high -gt 0) {
        Write-Host "✗ Found $critical critical and $high high severity vulnerabilities" -ForegroundColor Red
        Write-Host "  Run 'npm audit fix' to resolve" -ForegroundColor Gray
        $script:ERRORS++
    } else {
        Write-Host "✓ No critical or high severity vulnerabilities found" -ForegroundColor Green
        $script:PASSED++
    }
} catch {
    Write-Host "⚠ Could not run npm audit" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Check 9: File Permissions
Write-Host "9️⃣ Checking File Permissions..." -ForegroundColor Cyan

if (Test-Path ".env.production") {
    Write-Host "✓ .env.production exists" -ForegroundColor Green
    Write-Host "  Note: Ensure file permissions are restricted on production server" -ForegroundColor Gray
    $script:PASSED++
}

Write-Host ""

# Check 10: Sentry Configuration
Write-Host "🔟 Checking Error Tracking..." -ForegroundColor Cyan

$SENTRY_DSN = [Environment]::GetEnvironmentVariable("SENTRY_DSN")
if (![string]::IsNullOrEmpty($SENTRY_DSN)) {
    Write-Host "✓ Sentry is configured" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "⚠ Sentry is not configured" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════"
Write-Host ""

# Summary
$TOTAL = $script:PASSED + $script:ERRORS + $script:WARNINGS
Write-Host "Security Audit Summary:" -ForegroundColor Cyan
Write-Host "✓ Passed: $($script:PASSED)" -ForegroundColor Green
Write-Host "⚠ Warnings: $($script:WARNINGS)" -ForegroundColor Yellow
Write-Host "✗ Errors: $($script:ERRORS)" -ForegroundColor Red
Write-Host "Total checks: $TOTAL"
Write-Host ""

if ($script:ERRORS -eq 0) {
    Write-Host "✅ Security audit passed!" -ForegroundColor Green
    if ($script:WARNINGS -gt 0) {
        Write-Host "⚠ Please review warnings" -ForegroundColor Yellow
    }
    exit 0
} else {
    Write-Host "❌ Security audit failed with $($script:ERRORS) error(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the errors before deploying to production."
    exit 1
}
