# Parichay - Your Smart Digital Introduction

A dynamic multi-brand microsite builder platform that enables businesses to create SEO-friendly digital business card microsites. Parichay supports multi-brand and multi-branch management, subscription-based monetization, automated invoicing, payment processing, QR code generation, and comprehensive analytics with role-based access control.

## 🚀 Features

- **Dynamic URL-Based Microsites**: SEO-friendly URLs with pattern `/{brand}/{branch}`
- **Multi-Brand & Multi-Branch Management**: Centralized dashboard for managing multiple brands and locations
- **No-Code Microsite Builder**: Drag-and-drop interface with dynamic theming
- **Advanced Microsite Features**:
  - Video backgrounds and animations
  - Interactive product catalogs with filtering and search
  - Appointment booking integration (Calendly & custom)
  - Live chat widget support (Tawk.to, Intercom, Crisp)
- **Payment Processing**: Integrated with Stripe and Razorpay
- **Subscription Management**: Tiered plans with automated billing and licensing
- **QR Code Generation**: Downloadable QR codes with analytics tracking
- **Lead Management**: Capture, route, and track leads with notifications
- **Analytics Dashboard**: Comprehensive metrics and reporting
- **Security & Compliance**: HTTPS, GDPR compliance, role-based access control

## 📋 Prerequisites

- Node.js 18+ and npm
- MySQL 8+
- Redis 6+
- AWS account (for S3 storage)
- Stripe and/or Razorpay account
- SMTP service for emails

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd onetouch-bizcard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
# See SETUP_DATABASE.md for database setup instructions.

# Run migrations
npm run prisma:migrate

# Seed initial data (optional)
npm run prisma:seed
```

5. **Generate Prisma client**
```bash
npm run prisma:generate
```

6. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

### 🚀 Start Here
- **[Quick Reference Guide](./docs/QUICK_REFERENCE_GUIDE.md)** - ⚡ Fast access to all features
- **[Complete Documentation](./docs/CONSOLIDATED_DOCUMENTATION.md)** - 📖 Comprehensive guide
- **[Quick Start](./QUICK_START.md)** - 🏃 Get running in 5 minutes

### 🔧 Setup Guides
- [Database Setup](./SETUP_DATABASE.md) - Database configuration
- [Setup Checklist](./SETUP_CHECKLIST.md) - Complete setup steps
- [Login Credentials](./LOGIN_CREDENTIALS.md) - Test accounts

### 🎯 Feature Guides
- [White-Label Platform](./WHITE_LABEL_PLATFORM_IMPLEMENTATION.md) - Agency/multi-tenant
- [Authentication](./AUTH_GUIDE.md) - Login, MFA, security
- [Admin Tools](./ADMIN_TOOLS_GUIDE.md) - Admin dashboard
- [Lead Management](./LEAD_MANAGEMENT_GUIDE.md) - CRM and leads
- [Microsite Builder](./BUILDER_QUICK_START.md) - Build microsites
- [Theme Customizer](./THEME_CUSTOMIZER_GUIDE.md) - Branding
- [Testing Guide](./TESTING_GUIDE.md) - Testing procedures

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Test email functionality
npm run test:email

# Load testing
npm run load:test
npm run load:stress
npm run load:spike
```

## 🚢 Deployment

### Using Docker

```bash
# Build Docker image
docker build -t parichay .

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. Build the application
```bash
npm run build
```

2. Run database migrations
```bash
npm run prisma:deploy
```

3. Start the production server
```bash
npm start
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run db:backup` - Backup database
- `npm run verify:env` - Verify environment configuration

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: MySQL, Redis
- **Payment**: Stripe, Razorpay
- **Storage**: AWS S3, CloudFront CDN
- **Monitoring**: Sentry, Pino Logger
- **Testing**: Jest, React Testing Library

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For support, email support@parichay.com or visit our documentation.

---

**Parichay** - Your smart digital introduction
