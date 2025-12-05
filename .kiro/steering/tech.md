# Tech Stack

## Framework & Runtime
- **Next.js 14**: App Router with React Server Components
- **React 18**: UI library
- **TypeScript 5**: Type-safe development
- **Node.js 18+**: Runtime environment

## Database & ORM
- **MySQL 8+**: Primary database
- **Prisma 5**: ORM with custom output path (`src/generated/prisma`)
- **Redis 6+**: Caching and session management (ioredis)

## Styling & UI
- **Tailwind CSS 3**: Utility-first CSS with custom design system
- **Framer Motion**: Animations and transitions
- **Lucide React**: Icon library
- **Dark mode**: Class-based with context provider

## Authentication & Security
- **JWT**: Token-based auth with jose library
- **bcrypt**: Password hashing
- **MFA**: Multi-factor authentication with speakeasy
- **Rate limiting**: Custom middleware with Redis
- **Security headers**: HSTS, CSP, and other security headers

## Payment & Integrations
- **Stripe**: Payment processing
- **Razorpay**: Alternative payment gateway
- **Twilio**: SMS notifications
- **Nodemailer**: Email service
- **AWS S3**: File storage
- **CloudFront**: CDN

## Monitoring & Logging
- **Sentry**: Error tracking
- **Pino**: Structured logging with pino-pretty for development

## Testing
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **k6**: Load testing

## Common Commands

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

### Database
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations (dev)
npm run prisma:deploy    # Deploy migrations (production)
npm run prisma:seed      # Seed database
npm run seed:demo        # Seed demo data
```

### Testing
```bash
npm test                 # Run unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:email       # Test email service
npm run test:mfa         # Test MFA
npm run load:test        # Load testing
npm run load:stress      # Stress testing
npm run load:spike       # Spike testing
```

### Database Operations
```bash
npm run db:backup        # Backup database
npm run db:restore       # Restore database
npm run test:database    # Test database connection
npm run test:redis       # Test Redis connection
```

### Verification & Security
```bash
npm run verify:env       # Verify environment config
npm run verify:production # Verify production setup
npm run security:audit   # Run security audit
npm run analyze:bundle   # Analyze bundle size
```

## Build Configuration
- **Output**: Standalone (Docker-ready)
- **Minification**: SWC (faster than Terser)
- **Code splitting**: Custom chunks for animations, charts, forms, icons
- **Image optimization**: AVIF/WebP with CloudFront CDN support
- **Source maps**: Disabled in production
