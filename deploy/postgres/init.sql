-- PostgreSQL initialization for Parichay production
-- Runs only on first container start (fresh volume)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

ALTER DATABASE parichay_prod SET timezone TO 'Asia/Kolkata';
