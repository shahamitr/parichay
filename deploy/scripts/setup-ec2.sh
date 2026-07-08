#!/bin/bash
# =============================================================================
# Parichay EC2 Setup Script
# Run this ONCE on a fresh Ubuntu 22.04 EC2 t3.small instance
#
# Usage: curl -sSL <raw-github-url>/deploy/scripts/setup-ec2.sh | bash
# Or:    ssh ec2-user "bash -s" < deploy/scripts/setup-ec2.sh
# =============================================================================

set -euo pipefail

DOMAIN="${DOMAIN:-parichay.io}"
EMAIL="${EMAIL:-admin@parichay.io}"
APP_DIR="/opt/parichay"

echo "============================================"
echo "  Parichay EC2 Setup — Ubuntu 22.04"
echo "  Domain: $DOMAIN"
echo "============================================"

# --- 1. System updates ---
echo "[1/7] Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# --- 2. Install Docker ---
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose plugin
sudo apt-get install -y -qq docker-compose-plugin

# --- 3. Install Certbot (Let's Encrypt SSL) ---
echo "[3/7] Installing Certbot..."
sudo apt-get install -y -qq certbot

# --- 4. Create app directory ---
echo "[4/7] Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# --- 5. Generate secrets ---
echo "[5/7] Generating production secrets..."
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

cat > $APP_DIR/.env.production << EOF
# === Generated on $(date) ===
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://$DOMAIN

# Database (PostgreSQL)
DATABASE_URL=postgresql://parichay:${DB_PASSWORD}@db:5432/parichay_prod
DB_PASSWORD=${DB_PASSWORD}

# Authentication
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# Encryption
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Redis
REDIS_URL=redis://redis:6379

# Email (configure these)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Razorpay (configure these)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# S3 uploads (configure these)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=parichay-uploads

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Sentry
SENTRY_DSN=
EOF

chmod 600 $APP_DIR/.env.production
echo "  → Secrets written to $APP_DIR/.env.production"
echo "  → DB_PASSWORD: $DB_PASSWORD (save this!)"

# --- 6. Setup SSL certificate ---
echo "[6/7] Setting up SSL..."
sudo mkdir -p /var/www/certbot
echo "  → Run this AFTER pointing DNS to this server:"
echo "  → sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive"

# --- 7. Create deploy helper script ---
echo "[7/7] Creating deploy script..."
cat > $APP_DIR/deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -euo pipefail
cd /opt/parichay

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Building & starting containers ==="
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

echo "=== Running database migrations ==="
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

echo "=== Checking health ==="
sleep 10
if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "✅ Deployment successful! App is healthy."
else
    echo "⚠️  App may still be starting. Check: docker compose -f docker-compose.prod.yml logs app"
fi
DEPLOY_SCRIPT
chmod +x $APP_DIR/deploy.sh

echo ""
echo "============================================"
echo "  ✅ Setup complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Point DNS A record: $DOMAIN → $(curl -s ifconfig.me)"
echo "  2. Clone your repo:    cd $APP_DIR && git clone <repo-url> ."
echo "  3. Get SSL cert:       sudo certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos"
echo "  4. Edit secrets:       nano $APP_DIR/.env.production"
echo "  5. Deploy:             $APP_DIR/deploy.sh"
echo ""
echo "Ongoing deploys: just run $APP_DIR/deploy.sh"
