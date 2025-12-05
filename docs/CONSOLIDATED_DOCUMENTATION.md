# Parichay.io - Complete Documentation

## Table of Contents
1. [Quick Start](#quick-start)
2. [Setup & Installation](#setup--installation)
3. [Authentication](#authentication)
4. [Dashboard & Features](#dashboard--features)
5. [Microsite Builder](#microsite-builder)
6. [White-Label Platform](#white-label-platform)
7. [Admin Tools](#admin-tools)
8. [API Reference](#api-reference)
9. [Testing](#testing)

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation
```bash
# Clone and install
cd onetouch-bizcard
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run db:setup

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Demo Credentials
- **Admin**: admin@parichay.io / Admin@123
- **User**: demo@example.com / Demo@123

---

## Setup & Installation

### Database Setup

**PostgreSQL Installation:**
```bash
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql
```

**Create Database:**
```sql
CREATE DATABASE parichay;
CREATE USER parichay_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE parichay TO parichay_user;
```

**Run Migrations:**
```bash
npx prisma migrate dev
npx prisma db seed
```

### Environment Variables

Required variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/parichay"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Optional services:
```env
# Email (Resend)
RESEND_API_KEY="your-resend-key"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"

# AI (OpenAI)
OPENAI_API_KEY="your-openai-key"

# Payment (Stripe)
STRIPE_SECRET_KEY="your-stripe-key"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
```

---

## Authentication

### Features
- Email/Password authentication
- Multi-factor authentication (MFA)
- Email verification
- Password reset
- Session management
- Role-based access control

### User Roles
- **SUPER_ADMIN** - Platform administrator
- **TENANT_ADMIN** - Agency owner
- **ADMIN** - Brand administrator
- **EXECUTIVE** - Branch manager
- **USER** - Regular user

### API Endpoints
```typescript
POST /api/auth/register - Register new user
POST /api/auth/login - Login
POST /api/auth/logout - Logout
POST /api/auth/verify-email - Verify email
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password - Reset password
POST /api/auth/mfa/setup - Setup MFA
POST /api/auth/mfa/verify - Verify MFA code
```

---

## Dashboard & Features

### User Dashboard
- Profile management
- Brand/branch management
- Analytics overview
- Quick actions
- Recent activity

### Analytics
- Page views
- QR code scans
- Contact saves (vCard downloads)
- Link clicks
- Geographic data
- Device/browser stats
- Time-based trends

### Subscription Management
- Plan selection (Free, Pro, Business, Enterprise)
- Payment processing
- Usage tracking
- Billing history
- Plan upgrades/downgrades

---

## Microsite Builder

### Available Sections
1. **Hero** - Main banner with CTA
2. **About** - Company description
3. **Services** - Service listings
4. **Products** - Product showcase
5. **Team** - Team members
6. **Testimonials** - Customer reviews
7. **Gallery** - Image gallery
8. **Video** - Video embed
9. **Contact** - Contact form
10. **Social Links** - Social media links
11. **Location** - Map integration
12. **FAQ** - Frequently asked questions
13. **Pricing** - Pricing tables
14. **Blog** - Blog posts
15. **Portfolio** - Project showcase

### Customization
- Drag-and-drop section ordering
- Color scheme customization
- Font selection
- Logo upload
- Custom CSS
- SEO settings
- Social sharing

### Templates
- Professional
- Creative
- Minimal
- Bold
- Elegant

---

## White-Label Platform

### Agency Features
- Custom branding (logo, colors, domain)
- Client management
- Multi-tenant architecture
- Per-client billing
- Aggregate analytics
- White-label portal

### Setup Agency
```typescript
import { createTenant } from '@/lib/tenant/tenant-service';

const agency = await createTenant({
  name: 'My Agency',
  slug: 'myagency',
  brandName: 'Agency Brand',
  supportEmail: 'support@agency.com',
  logo: 'https://example.com/logo.png',
  primaryColor: '#FF6B35',
  plan: 'AGENCY_PRO',
  clientLimit: 50,
}, ownerId);
```

### Pricing Plans
- **Agency Starter**: $99/mo - 10 clients
- **Agency Pro**: $299/mo - 50 clients
- **Agency Enterprise**: $999/mo - Unlimited clients

---

## Admin Tools

### Super Admin Dashboard
- User management
- Brand management
- System settings
- Analytics overview
- Billing management
- Support tickets

### System Settings
- Email configuration
- SMS configuration
- Payment gateway setup
- AI service configuration
- Feature flags
- Maintenance mode

### Bulk Operations
- Import users
- Export data
- Bulk email
- Bulk SMS
- Data cleanup

---

## API Reference

### Authentication
```typescript
// Login
POST /api/auth/login
Body: { email, password }
Response: { user, token }

// Register
POST /api/auth/register
Body: { email, password, name }
Response: { user, token }
```

### Brands
```typescript
// Get brand
GET /api/brands/:slug
Response: { brand, branches, analytics }

// Update brand
PUT /api/brands/:id
Body: { name, description, logo, ... }
Response: { brand }
```

### Analytics
```typescript
// Track event
POST /api/analytics/track
Body: { eventType, brandId, metadata }
Response: { success }

// Get analytics
GET /api/analytics/:brandId
Query: { startDate, endDate, eventType }
Response: { events, summary }
```

### Tenant (White-Label)
```typescript
// Get current tenant
GET /api/tenant/current
Response: { tenant }

// Agency dashboard
GET /api/agency/dashboard
Response: { stats, clients, revenue }

// Manage clients
GET /api/agency/clients
POST /api/agency/clients
Body: { brandId, clientName, ... }
```

---

## Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Manual Testing

**Test Authentication:**
```bash
node test-auth-flow.js
```

**Test QR Code:**
```bash
node test-qrcode-api.js
```

**Test vCard:**
```bash
node test-vcard.js
```

### Demo Data
```bash
# Add demo data
psql -d parichay -f add-comprehensive-demo-data.sql

# Create demo branches
psql -d parichay -f create-demo-branches.sql
```

---

## Deployment

### Production Checklist
- [ ] Set production environment variables
- [ ] Configure custom domain
- [ ] Setup SSL certificate
- [ ] Configure email service
- [ ] Setup payment gateway
- [ ] Enable monitoring
- [ ] Configure backups
- [ ] Test all features

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Deployment
```bash
# Build image
docker build -t parichay .

# Run container
docker-compose up -d
```

---

## Support

For issues or questions:
- Email: support@parichay.io
- Documentation: https://docs.parichay.io
- GitHub: https://github.com/parichay/parichay

---

**Last Updated:** December 2024
**Version:** 2.0.0
