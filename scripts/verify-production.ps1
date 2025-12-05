# Production Verification Script (PowerShell)
# This script performs comprehensive checks before launch

$ErrorActionPreference = "Stop"

Write-Host "🚀 Production Verification Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
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

Write-Host "Running comprehensive production checks..." -ForegroundColor Blue
Write-Host ""

# Section 1: Environment Configuration
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "1. Environment Configuration" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

try {
    & ".\scripts\verify-env.ps1"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Environment configuration verified" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ Environment configuration failed" -ForegroundColor Red
        $script:ERRORS++
    }
} catch {
    Write-Host "✗ Environment configuration failed: $_" -ForegroundColor Red
    $script:ERRORS++
}

Write-Host ""

# Section 2: Database Connectivity
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "2. Database Connectivity" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

try {
    & ".\scripts\test-database.ps1" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database connection verified" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ Database connection failed" -ForegroundColor Red
        $script:ERRORS++
    }
} catch {
    Write-Host "✗ Database connection failed: $_" -ForegroundColor Red
    $script:ERRORS++
}

Write-Host ""

# Section 3: Redis Connectivity
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "3. Redis Connectivity" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

try {
    & ".\scripts\test-redis.ps1" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Redis connection verified" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ Redis connection failed" -ForegroundColor Red
        $script:ERRORS++
    }
} catch {
    Write-Host "✗ Redis connection failed: $_" -ForegroundColor Red
    $script:ERRORS++
}

Write-Host ""

# Section 4: Application Health
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "4. Application Health" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

$APP_URL = [Environment]::GetEnvironmentVariable("APP_URL")
if (![string]::IsNullOrEmpty($APP_URL)) {
    # Test main health endpoint
    try {
        $response = Invoke-WebRequest -Uri "$APP_URL/api/health" -Method Get -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Application health endpoint responding" -ForegroundColor Green
            $script:PASSED++
        } else {
            Write-Host "✗ Application health endpoint failed (HTTP $($response.StatusCode))" -ForegroundColor Red
            $script:ERRORS++
        }
    } catch {
        Write-Host "✗ Application health endpoint failed" -ForegroundColor Red
        $script:ERRORS++
    }

    # Test homepage
    try {
        $response = Invoke-WebRequest -Uri "$APP_URL/" -Method Get -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Homepage responding" -ForegroundColor Green
            $script:PASSED++
        } else {
            Write-Host "✗ Homepage failed (HTTP $($response.StatusCode))" -ForegroundColor Red
            $script:ERRORS++
        }
    } catch {
        Write-Host "✗ Homepage failed" -ForegroundColor Red
        $script:ERRORS++
    }
} else {
    Write-Host "⚠ APP_URL not set, skipping application tests" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Section 5: Third-Party Integrations
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "5. Third-Party Integrations" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Test S3 connectivity
$AWS_S3_BUCKET = [Environment]::GetEnvironmentVariable("AWS_S3_BUCKET")
if (![string]::IsNullOrEmpty($AWS_S3_BUCKET)) {
    try {
        aws s3 ls "s3://$AWS_S3_BUCKET" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ S3 bucket accessible" -ForegroundColor Green
            $script:PASSED++
        } else {
            Write-Host "✗ S3 bucket not accessible" -ForegroundColor Red
            $script:ERRORS++
        }
    } catch {
        Write-Host "✗ S3 bucket not accessible" -ForegroundColor Red
        $script:ERRORS++
    }
} else {
    Write-Host "⚠ AWS_S3_BUCKET not configured" -ForegroundColor Yellow
    $script:WARNINGS++
}

# Test Stripe connectivity
$STRIPE_SECRET_KEY = [Environment]::GetEnvironmentVariable("STRIPE_SECRET_KEY")
if (![string]::IsNullOrEmpty($STRIPE_SECRET_KEY)) {
    try {
        $auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${STRIPE_SECRET_KEY}:"))
        $headers = @{ Authorization = "Basic $auth" }
        $response = Invoke-RestMethod -Uri "https://api.stripe.com/v1/balance" -Headers $headers -Method Get

        if ($response) {
            Write-Host "✓ Stripe API accessible" -ForegroundColor Green
            $script:PASSED++
        } else {
            Write-Host "✗ Stripe API not accessible" -ForegroundColor Red
            $script:ERRORS++
        }
    } catch {
        Write-Host "✗ Stripe API not accessible" -ForegroundColor Red
        $script:ERRORS++
    }
} else {
    Write-Host "⚠ STRIPE_SECRET_KEY not configured" -ForegroundColor Yellow
    $script:WARNINGS++
}

# Test Sentry connectivity
$SENTRY_DSN = [Environment]::GetEnvironmentVariable("SENTRY_DSN")
if (![string]::IsNullOrEmpty($SENTRY_DSN)) {
    Write-Host "✓ Sentry DSN configured" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "⚠ Sentry not configured" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Section 6: Security Checks
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "6. Security Checks" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

try {
    & ".\scripts\security-audit.ps1" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Security audit passed" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ Security audit failed" -ForegroundColor Red
        $script:ERRORS++
    }
} catch {
    Write-Host "✗ Security audit failed: $_" -ForegroundColor Red
    $script:ERRORS++
}

Write-Host ""

# Section 7: Backup Systems
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "7. Backup Systems" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

if (Test-Path ".\scripts\verify-backups.sh") {
    Write-Host "✓ Backup scripts exist" -ForegroundColor Green
    Write-Host "  Run backup verification separately" -ForegroundColor Gray
    $script:PASSED++
} else {
    Write-Host "⚠ Backup scripts not found" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Section 8: Monitoring Systems
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "8. Monitoring Systems" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

try {
    & ".\scripts\test-monitoring.ps1" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Monitoring systems verified" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "⚠ Monitoring verification had warnings" -ForegroundColor Yellow
        $script:WARNINGS++
    }
} catch {
    Write-Host "⚠ Monitoring verification had warnings: $_" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""

# Section 9: Performance Checks
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "9. Performance Checks" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

if (![string]::IsNullOrEmpty($APP_URL)) {
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri "$APP_URL/" -Method Get -TimeoutSec 10 -UseBasicParsing
        $stopwatch.Stop()
        $responseTime = $stopwatch.ElapsedMilliseconds

        if ($responseTime -lt 2000) {
            Write-Host "✓ Homepage response time: ${responseTime}ms" -ForegroundColor Green
            $script:PASSED++
        } else {
            Write-Host "⚠ Homepage response time: ${responseTime}ms (slow)" -ForegroundColor Yellow
            $script:WARNINGS++
        }
    } catch {
        Write-Host "⚠ Could not measure response time" -ForegroundColor Yellow
        $script:WARNINGS++
    }
}

Write-Host ""

# Section 10: Build and Deployment
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "10. Build and Deployment" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# Check if build exists
if (Test-Path ".next") {
    Write-Host "✓ Production build exists" -ForegroundColor Green
    $script:PASSED++
} else {
    Write-Host "⚠ Production build not found" -ForegroundColor Yellow
    $script:WARNINGS++
}

# Check Node.js version
$NODE_VERSION = node -v
Write-Host "Node.js version: $NODE_VERSION" -ForegroundColor Gray

Write-Host ""

# Final Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

$TOTAL = $script:PASSED + $script:ERRORS + $script:WARNINGS
$PASS_RATE = if ($TOTAL -gt 0) { [math]::Round(($script:PASSED * 100 / $TOTAL), 1) } else { 0 }

Write-Host "✓ Passed: $($script:PASSED)" -ForegroundColor Green
Write-Host "⚠ Warnings: $($script:WARNINGS)" -ForegroundColor Yellow
Write-Host "✗ Errors: $($script:ERRORS)" -ForegroundColor Red
Write-Host "Total checks: $TOTAL"
Write-Host "Pass rate: ${PASS_RATE}%"
Write-Host ""

if ($script:ERRORS -eq 0) {
    Write-Host "✅ Production verification passed!" -ForegroundColor Green
    if ($script:WARNINGS -gt 0) {
        Write-Host "⚠ Please review $($script:WARNINGS) warning(s) before launch" -ForegroundColor Yellow
    } else {
        Write-Host "🎉 System is ready for production launch!" -ForegroundColor Green
    }
    exit 0
} else {
    Write-Host "❌ Production verification failed with $($script:ERRORS) error(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix all errors before launching to production."
    exit 1
}
