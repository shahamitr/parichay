-- =============================================================================
-- Local Development Database Setup for PostgreSQL
-- Run: psql -U postgres -f scripts/setup-local-db.sql
-- Or just use: docker compose up -d (creates DB automatically)
-- =============================================================================

CREATE DATABASE parichay;

-- After creating the database, run:
-- npx prisma db push
-- npx prisma db seed (optional, for demo data)
