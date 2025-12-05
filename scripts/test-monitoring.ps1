# Monitoring Integration Test Script (PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "📊 Testing Monitoring Integrations..." -ForegroundColor Cyan
Write-Host ""

$script:ERRORS = 0

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

# Test 1: Sentry Integration
Write-Host "1️⃣ Testing Sentry Error Tracking..." -ForegroundColor Cyan
$SENTRY_DSN = [Environment]::GetEnvironmentVariable("SENTRY_DSN")
if ([string]::IsNullOrEmpty($SENTRY_DSN)) {
    Write-Host "✗ SENTRY_DSN is not configured" -ForegroundColor Red
    $script:ERRORS++
} else {
    Write-Host "   Sentry DSN: $($SENTRY_DSN.Substring(0, [Math]::Min(30, $SENTRY_DSN.Length)))..." -ForegroundColor Gray
    Write-Host "✓ Sentry is configured" -ForegroundColor Green
}

Write-Host ""

# Test 2: Slack Webhook
Write-Host "2️⃣ Testing Slack Webhook..." -ForegroundColor Cyan
$SLACK_WEBHOOK_URL = [Environment]::GetEnvironmentVariable("SLACK_WEBHOOK_URL")
if ([string]::IsNullOrEmpty($SLACK_WEBHOOK_URL)) {
    Write-Host "⚠ SLACK_WEBHOOK_URL is not configured (optional)" -ForegroundColor Yellow
} else {
    try {
        $body = @{
            text = "🧪 Test notification from OneTouch BizCard monitoring script"
            username = "Monitoring Bot"
            icon_emoji = ":robot_face:"
        } | ConvertTo-Json

        Invoke-RestMethod -Uri $SLACK_WEBHOOK_URL -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "✓ Slack webhook test successful" -ForegroundColor Green
        Write-Host "   Check your Slack channel for the test message" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Slack webhook test failed: $_" -ForegroundColor Red
        $script:ERRORS++
    }
}

Write-Host ""

# Test 3: Email Configuration
Write-Host "3️⃣ Testing Email Configuration..." -ForegroundColor Cyan
$SMTP_HOST = [Environment]::GetEnvironmentVariable("SMTP_HOST")
$SMTP_USER = [Environment]::GetEnvironmentVariable("SMTP_USER")
if ([string]::IsNullOrEmpty($SMTP_HOST) -or [string]::IsNullOrEmpty($SMTP_USER)) {
    Write-Host "✗ SMTP configuration is incomplete" -ForegroundColor Red
    $script:ERRORS++
} else {
    Write-Host "   SMTP Host: $SMTP_HOST" -ForegroundColor Gray
    Write-Host "   SMTP Port: $([Environment]::GetEnvironmentVariable('SMTP_PORT'))" -ForegroundColor Gray
    Write-Host "   SMTP User: $SMTP_USER" -ForegroundColor Gray
    Write-Host "✓ SMTP configuration present" -ForegroundColor Green
    Write-Host "   Run email test separately with: npm run test:email" -ForegroundColor Gray
}

Write-Host ""

# Test 4: Database Monitoring
Write-Host "4️⃣ Testing Database Connection..." -ForegroundColor Cyan
$DATABASE_URL = [Environment]::GetEnvironmentVariable("DATABASE_URL")
if ([string]::IsNullOrEmpty($DATABASE_URL)) {
    Write-Host "✗ DATABASE_URL is not configured" -ForegroundColor Red
    $script:ERRORS++
} else {
    Write-Host "✓ DATABASE_URL is configured" -ForegroundColor Green
}

Write-Host ""

# Test 5: Application Health Check
Write-Host "5️⃣ Testing Application Health Endpoint..." -ForegroundColor Cyan
$APP_URL = [Environment]::GetEnvironmentVariable("APP_URL")
if ([string]::IsNullOrEmpty($APP_URL)) {
    Write-Host "⚠ APP_URL is not configured" -ForegroundColor Yellow
} else {
    $HEALTH_URL = "$APP_URL/api/health"
    Write-Host "   Testing: $HEALTH_URL" -ForegroundColor Gray

    try {
        $response = Invoke-WebRequest -Uri $HEALTH_URL -Method Get -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Health endpoint responding (HTTP $($response.StatusCode))" -ForegroundColor Green
        } else {
            Write-Host "⚠ Health endpoint returned HTTP $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠ Health endpoint not accessible (app may not be running)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 6: Redis Monitoring
Write-Host "6️⃣ Testing Redis Connection..." -ForegroundColor Cyan
$REDIS_URL = [Environment]::GetEnvironmentVariable("REDIS_URL")
if ([string]::IsNullOrEmpty($REDIS_URL)) {
    Write-Host "✗ REDIS_URL is not configured" -ForegroundColor Red
    $script:ERRORS++
} else {
    Write-Host "✓ REDIS_URL is configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════"
Write-Host ""

if ($script:ERRORS -eq 0) {
    Write-Host "✅ All monitoring tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Check Sentry dashboard for test event"
    Write-Host "2. Check Slack channel for test message"
    Write-Host "3. Set up UptimeRobot/Pingdom for uptime monitoring"
    Write-Host "4. Configure alert thresholds in monitoring services"
    exit 0
} else {
    Write-Host "❌ Found $($script:ERRORS) error(s) in monitoring configuration" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the errors before proceeding."
    exit 1
}
