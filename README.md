# Parichay

India's #1 Digital Business Card & Lead Generation Platform.

Create professional digital microsites with built-in lead capture, analytics, QR codes, and WhatsApp sharing — ready in 5 minutes.

## Quick Start (Docker — Recommended)

```bash
# Start full dev environment with hot reload
dev.bat          # Windows
./dev.sh         # Mac/Linux
```

This starts Next.js + MySQL + Redis in Docker containers. Your code changes reflect instantly in the browser.

**App runs at:** http://localhost:3000

## Quick Start (Manual / XAMPP)

```bash
# 1. Install dependencies
pnpm install

# 2. Start MySQL via XAMPP, then create database
mysql -u root < scripts/setup-local-db.sql

# 3. Generate Prisma client & push schema
pnpm prisma:generate
pnpm prisma:push

# 4. Start dev server
pnpm dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL 16 (Prisma ORM) |
| Cache | Redis 7 |
| Auth | JWT (HTTP-only cookies) + MFA |
| Payments | Razorpay + Stripe |
| Email | Nodemailer (SMTP) |
| SMS | Twilio |
| Storage | AWS S3 |
| Package Manager | pnpm |

## Project Structure

```
src/
├── app/              # Next.js App Router (pages + API routes)
│   ├── api/          # REST API endpoints
│   ├── admin/        # Admin panel pages
│   ├── [brand]/      # Dynamic microsite pages
│   └── ...
├── components/       # Reusable UI components
│   ├── ui/           # Design system primitives
│   ├── microsites/   # Microsite renderer + sections
│   ├── admin/        # Admin panel components
│   └── landing/      # Landing page components
├── lib/              # Server utilities (auth, db, encryption, etc.)
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── data/             # Static data (categories, templates)
└── styles/           # Global CSS

deploy/               # Production deployment configs
├── nginx/            # Nginx reverse proxy config
├── scripts/          # EC2 setup & backup scripts
└── postgres/         # DB init scripts

prisma/
├── schema.prisma     # Database schema
├── seed.ts           # Production seed data
└── migrations/       # Schema migrations
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server (hot reload) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm prisma:generate` | Regenerate Prisma client |
| `pnpm prisma:push` | Push schema to database |
| `pnpm prisma:migrate` | Create and run migrations |
| `pnpm prisma:seed` | Seed database with initial data |
| `pnpm seed:demo` | Seed demo/sample content |

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=mysql://root@localhost:3306/parichay
JWT_SECRET=your-secret-here
ENCRYPTION_KEY=           # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
REDIS_URL=redis://localhost:6379
```

See `.env.example` for all available options.

## Development Workflow

### Docker (recommended)
```bash
dev.bat                    # Start everything
# Edit code → browser auto-refreshes
dev-stop.bat               # Stop containers (data persists)
```

### Without Docker
1. Start MySQL (XAMPP) and Redis locally
2. `pnpm dev`

### Database Changes
```bash
# Edit prisma/schema.prisma, then:
pnpm prisma:push           # Dev: push changes directly
pnpm prisma:migrate        # Prod: create migration file
```

## Deployment

Deployed on AWS EC2 t3.small with Docker Compose.

```bash
# One-time EC2 setup
ssh ubuntu@server "bash -s" < deploy/scripts/setup-ec2.sh

# Deploy (manual or auto via GitHub Actions on push to main)
ssh ubuntu@server "/opt/parichay/deploy.sh"
```

See `docs/DEPLOYMENT_EC2.md` for the complete guide.

## Documentation

| Document | Content |
|----------|---------|
| `docs/ADMIN_OPERATIONS_GUIDE.md` | Admin portal usage guide |
| `docs/CUSTOMER_OPERATIONS_GUIDE.md` | Customer portal guide |
| `docs/DEPLOYMENT_EC2.md` | AWS EC2 deployment guide |
| `docs/API_DOCUMENTATION.md` | REST API reference |
| `docs/development/FOLDER_STRUCTURE.md` | Code architecture |

## License

Proprietary. See `LICENSE` file.
