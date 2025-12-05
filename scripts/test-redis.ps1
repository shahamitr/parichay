# Redis Connection Test Script (PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "🔴 Testing Redis Connection..." -ForegroundColor Cyan
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

$REDIS_URL = [Environment]::GetEnvironmentVariable("REDIS_URL")

if ([string]::IsNullOrEmpty($REDIS_URL)) {
    Write-Host "❌ REDIS_URL is not set" -ForegroundColor Red
    exit 1
}

Write-Host "Testing connection to: $REDIS_URL" -ForegroundColor Cyan
Write-Host ""

# Create a simple Node.js script to test Redis
$testScript = @"
const Redis = require('ioredis');

async function testRedis() {
    const redis = new Redis(process.env.REDIS_URL);

    try {
        // Test PING
        console.log('1. Testing PING command...');
        const pong = await redis.ping();
        if (pong === 'PONG') {
            console.log('✅ PING successful');
        } else {
            throw new Error('PING failed');
        }

        // Test SET
        console.log('2. Testing SET command...');
        await redis.set('test_key', 'test_value');
        console.log('✅ SET successful');

        // Test GET
        console.log('3. Testing GET command...');
        const value = await redis.get('test_key');
        if (value === 'test_value') {
            console.log('✅ GET successful (value: ' + value + ')');
        } else {
            throw new Error('GET failed');
        }

        // Test DEL
        console.log('4. Testing DEL command...');
        await redis.del('test_key');
        console.log('✅ DEL successful');

        // Get Redis info
        console.log('');
        console.log('5. Redis Server Information:');
        const info = await redis.info('server');
        const lines = info.split('\n');
        lines.forEach(line => {
            if (line.includes('redis_version') || line.includes('os') || line.includes('tcp_port')) {
                console.log('   ' + line.trim());
            }
        });

        console.log('');
        console.log('✅ All Redis tests passed successfully!');

        redis.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Redis test failed:', error.message);
        redis.disconnect();
        process.exit(1);
    }
}

testRedis();
"@

# Write the test script to a temporary file
$tempFile = "test-redis-temp.js"
Set-Content -Path $tempFile -Value $testScript

try {
    # Run the test script
    node $tempFile
    $exitCode = $LASTEXITCODE
} finally {
    # Clean up
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}

exit $exitCode
