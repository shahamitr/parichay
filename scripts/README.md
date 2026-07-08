# Scripts

Utility scripts for development and operations.

## Active Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `generate-placeholders.js` | Creates SVG placeholder images for template previews | `node scripts/generate-placeholders.js` |
| `setup-local-db.sql` | Creates the local MySQL database | `mysql -u root < scripts/setup-local-db.sql` |
| `create-admin.ts` | Creates a super admin user | `npx ts-node scripts/create-admin.ts` |
| `seed-demo-data.ts` | Seeds demo content for all industries | `npx ts-node scripts/seed-demo-data.ts` |
| `seed-categories.ts` | Seeds industry categories into DB | `npx ts-node scripts/seed-categories.ts` |
| `seed-sample-reviews.ts` | Seeds sample reviews for demo branches | `npx ts-node scripts/seed-sample-reviews.ts` |
| `seed-meaningful.ts` | Seeds realistic test data | `npx ts-node scripts/seed-meaningful.ts` |
| `analyze-bundle.js` | Analyzes Next.js bundle sizes | `pnpm analyze:bundle` |
| `check-brand.ts` | Debug utility to check brand data | `npx ts-node scripts/check-brand.ts` |
| `migrate-advanced-features.ts` | One-time migration for advanced features | `npx ts-node scripts/migrate-advanced-features.ts` |
| `security-audit.sh` | Runs npm audit + checks for common issues | `bash scripts/security-audit.sh` |
| `test-database.sh` | Tests database connectivity | `bash scripts/test-database.sh` |
| `test-monitoring.sh` | Tests monitoring endpoints | `bash scripts/test-monitoring.sh` |
| `test-redis.sh` | Tests Redis connectivity | `bash scripts/test-redis.sh` |
| `verify-env.sh` | Validates all required env vars are set | `bash scripts/verify-env.sh` |
| `verify-backups.sh` | Verifies backup integrity | `bash scripts/verify-backups.sh` |
| `verify-production.sh` | Pre-deploy production checklist | `bash scripts/verify-production.sh` |

## Deployment Scripts (in `deploy/`)

| Script | Purpose |
|--------|---------|
| `deploy/scripts/setup-ec2.sh` | One-time EC2 instance setup |
| `deploy/scripts/backup.sh` | Daily database backup (cron) |
