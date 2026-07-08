# Push to GitHub — Instructions

## First Time Setup

```bash
# 1. Create a new repository on GitHub (github.com/new)
#    Name: parichay
#    Visibility: Private
#    Don't initialize with README (we have one)

# 2. Initialize git and push
cd d:\xampp\htdocs\parichay

git init
git add .
git commit -m "Initial commit: Parichay v1.0 — Production ready"

# 3. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/parichay.git
git branch -M main
git push -u origin main
```

## If Already Connected to GitHub

```bash
cd d:\xampp\htdocs\parichay
git add .
git commit -m "Production release: All features implemented"
git push origin main
```

## What Gets Uploaded (key files)

```
README.md                       # Project overview + quick start
ARCHITECTURE.md                 # System design + data flows
CONTRIBUTING.md                 # Developer guide
LICENSE                         # License file

docs/
├── ADMIN_OPERATIONS_GUIDE.md   # Admin user guide
├── CUSTOMER_OPERATIONS_GUIDE.md # Customer user guide
├── DEPLOYMENT_EC2.md           # EC2 deployment guide
├── API_DOCUMENTATION.md        # REST API reference
├── testing/
│   ├── TESTING_GUIDE.md        # How to run/write tests
│   └── PRE_DEPLOYMENT_CHECKLIST.md  # Pre-deploy QA checklist
├── development/
│   └── FOLDER_STRUCTURE.md     # Code organization
├── features/                   # Feature-specific docs
├── guides/                     # Setup guides
└── getting-started/
    └── QUICK_START.md          # Dev setup in 5 minutes

deploy/                         # Production deployment configs
├── nginx/                      # Reverse proxy
├── postgres/                   # DB init
└── scripts/                    # EC2 setup + backup

.github/workflows/deploy.yml    # CI/CD auto-deploy
docker-compose.yml              # Local dev (PG + Redis)
docker-compose.dev.yml          # Hot reload dev
docker-compose.prod.yml         # Production stack
Dockerfile                      # Production image
Dockerfile.dev                  # Dev image (hot reload)
dev.bat / dev.sh                # One-click dev start

prisma/schema.prisma            # Database schema
e2e/                            # E2E tests
src/__tests__/                  # Unit tests
```

## After Pushing

### Set Up GitHub Secrets (for CI/CD)

Go to: Repository → Settings → Secrets and variables → Actions

Add these:
- `EC2_HOST` — Your EC2 public IP
- `EC2_USER` — `ubuntu`
- `EC2_SSH_KEY` — Contents of your EC2 .pem file

### Enable Branch Protection (recommended)

Go to: Repository → Settings → Branches → Add rule
- Branch: `main`
- Require: Pull request before merging
- Require: Status checks to pass (tests)

---

## Delete This File After Pushing

This file is just instructions — you can delete `PUSH_TO_GITHUB.md` after your first push.
