# Production Environment Verification Script (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "Verifying Production Environment Configuration..." -ForegroundColor Cyan
Write-Host ""

$script:ERRORS = 0
$script:WARNINGS = 0

function Test-EnvVar {
    param([string]$VarName, [bool]$IsRequired = $true)
    $value = [Environment]::GetEnvironmentVariable($VarName)
    if ([string]::IsNullOrEmpty($value)) {
        if ($IsRequired) {
            Write-Host "X $VarName is not set or empty (REQUIRED)" -ForegroundColor Red
            $script:ERRORS++
        } else {
            Write-Host "! $VarName is not set (OPTIONAL)" -ForegroundColor Yellow
            $script:WARNINGS++
        }
        return $false
    } else {
        Write-Host "+ $VarName is set" -ForegroundColor Green
        return $true
    }
}

function Test-Placeholder {
    param([string]$VarName)
    $value = [Environment]::GetEnvironmentVariable($VarName)
    if ($value -match "EXAMPLE|your-|\.\.\.") {
        Write-Host "X $VarName contains placeholder value" -ForegroundColor Red
        $script:ERRORS++
        return $false
    }
    return $true
}

$envFile = if (Test-Path ".env.production") { ".env.production" } elseif (Test-Path ".env") { ".env" } else { $null }

if ($envFile) {
    Write-Host "Loading environment from: $envFile" -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "ERROR: No environment file found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking Database Configuration..." -ForegroundColor Cyan
Test-EnvVar "DATABASE_URL"
Test-Placeholder "DATABASE_URL"

Write-Host ""
Write-Host "Checking Authentication Configuration..." -ForegroundColor Cyan
Test-EnvVar "NEXTAUTH_URL"
Test-EnvVar "NEXTAUTH_SECRET"
Test-EnvVar "JWT_SECRET"
Test-Placeholder "NEXTAUTH_SECRET"
Test-Placeholder "JWT_SECRET"

Write-Host ""
Write-Host "Checking Payment Gateway Configuration..." -ForegroundColor Cyan
Test-EnvVar "STRIPE_PUBLIC_KEY" $false
Test-EnvVar "STRIPE_SECRET_KEY" $false
Test-EnvVar "STRIPE_WEBHOOK_SECRET" $false
Test-EnvVar "RAZORPAY_KEY_ID" $false
Test-EnvVar "RAZORPAY_KEY_SECRET" $false
Test-EnvVar "RAZORPAY_WEBHOOK_SECRET" $false

$stripeKey = [Environment]::GetEnvironmentVariable("STRIPE_SECRET_KEY")
if ($stripeKey -and ($stripeKey -like "sk_test_*")) {
    Write-Host "X STRIPE_SECRET_KEY is using TEST key, not PRODUCTION" -ForegroundColor Red
    $script:ERRORS++
}

$razorpayKey = [Environment]::GetEnvironmentVariable("RAZORPAY_KEY_ID")
if ($razorpayKey -and ($razorpayKey -like "rzp_test_*")) {
    Write-Host "X RAZORPAY_KEY_ID is using TEST key, not PRODUCTION" -ForegroundColor Red
    $script:ERRORS++
}

Write-Host ""
Write-Host "Checking Email Service Configuration..." -ForegroundColor Cyan
Test-EnvVar "SMTP_HOST" $false
Test-EnvVar "SMTP_PORT" $false
Test-EnvVar "SMTP_USER" $false
Test-EnvVar "SMTP_PASS" $false

Write-Host ""
Write-Host "Checking AWS S3 Configuration..." -ForegroundColor Cyan
Test-EnvVar "AWS_ACCESS_KEY_ID" $false
Test-EnvVar "AWS_SECRET_ACCESS_KEY" $false
Test-EnvVar "AWS_REGION" $false
Test-EnvVar "AWS_S3_BUCKET" $false

Write-Host ""
Write-Host "Checking Redis Configuration..." -ForegroundColor Cyan
Test-EnvVar "REDIS_URL" $false

Write-Host ""
Write-Host "Checking Sentry Configuration..." -ForegroundColor Cyan
Test-EnvVar "SENTRY_DSN" $false
Test-EnvVar "SENTRY_ENVIRONMENT" $false

Write-Host ""
Write-Host "Checking Application Configuration..." -ForegroundColor Cyan
Test-EnvVar "NODE_ENV"
Test-EnvVar "APP_URL"

$nodeEnv = [Environment]::GetEnvironmentVariable("NODE_ENV")
if ($nodeEnv -and ($nodeEnv -ne "production")) {
    Write-Host "! NODE_ENV is '$nodeEnv' (not 'production')" -ForegroundColor Yellow
    $script:WARNINGS++
}

Write-Host ""
Write-Host "======================================================="
Write-Host ""

if ($script:ERRORS -eq 0) {
    Write-Host "SUCCESS: All required environment variables are properly configured!" -ForegroundColor Green
    if ($script:WARNINGS -gt 0) {
        Write-Host "WARNING: $($script:WARNINGS) optional variables are not set" -ForegroundColor Yellow
    }
    exit 0
} else {
    Write-Host "FAILED: Found $($script:ERRORS) error(s) in environment configuration" -ForegroundColor Red
    if ($script:WARNINGS -gt 0) {
        Write-Host "WARNING: Found $($script:WARNINGS) warning(s)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Please fix the errors before deploying to production."
    exit 1
}
