-- White-Label Platform Migration
-- Adds multi-tenant support for agencies

-- Create Tenant table for agencies
CREATE TABLE IF NOT EXISTS "Tenant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "domain" TEXT UNIQUE,
  "customDomain" TEXT UNIQUE,

  -- Branding
  "logo" TEXT,
  "favicon" TEXT,
  "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
  "secondaryColor" TEXT NOT NULL DEFAULT '#10B981',
  "accentColor" TEXT NOT NULL DEFAULT '#8B5CF6',

  -- White-label settings
  "brandName" TEXT NOT NULL,
  "tagline" TEXT,
  "supportEmail" TEXT NOT NULL,
  "supportPhone" TEXT,
  "website" TEXT,
  "showPoweredBy" BOOLEAN NOT NULL DEFAULT true,

  -- Billing
  "plan" TEXT NOT NULL DEFAULT 'AGENCY_STARTER',
  "clientLimit" INTEGER NOT NULL DEFAULT 10,
  "pricePerClient" DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  "billingEmail" TEXT,

  -- Status
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isTrial" BOOLEAN NOT NULL DEFAULT false,
  "trialEndsAt" TIMESTAMP,

  -- Metadata
  "settings" JSONB,
  "metadata" JSONB,

  -- Timestamps
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on slug and domain
CREATE INDEX IF NOT EXISTS "Tenant_slug_idx" ON "Tenant"("slug");
CREATE INDEX IF NOT EXISTS "Tenant_domain_idx" ON "Tenant"("domain");
CREATE INDEX IF NOT EXISTS "Tenant_customDomain_idx" ON "Tenant"("customDomain");

-- Add tenantId to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISId" TEXT;
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL;

-- Add tenantId to Brand table
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL;

-- Create TenantInvitation table
CREATE TABLE IF NOT EXISTS "TenantInvitation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'CLIENT',
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "token" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP NOT NULL,

  -- Relations
  "tenantId" TEXT NOT NULL,
  "invitedBy" TEXT NOT NULL,

  -- Timestamps
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt" TIMESTAMP,

  CONSTRAINT "TenantInvitation_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE,
  CONSTRAINT "TenantInvitation_invitedBy_fkey"
    FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create index on token
CREATE INDEX IF NOT EXISTS "TenantInvitation_token_idx" ON "TenantInvitation"("token");
CREATE INDEX IF NOT EXISTS "TenantInvitation_tenantId_idx" ON "TenantInvitation"("tenantId");

-- Create TenantBilling table
CREATE TABLE IF NOT EXISTS "TenantBilling" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,

  -- Billing period
  "periodStart" TIMESTAMP NOT NULL,
  "periodEnd" TIMESTAMP NOT NULL,

  -- Usage
  "clientCount" INTEGER NOT NULL DEFAULT 0,
  "activeClients" INTEGER NOT NULL DEFAULT 0,

  -- Amounts
  "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(10,2) NOT NULL DEFAULT 0,

  -- Status
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "paidAt" TIMESTAMP,

  -- Payment
  "paymentMethod" TEXT,
  "transactionId" TEXT,

  -- Metadata
  "metadata" JSONB,

  -- Timestamps
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TenantBilling_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE
);

-- Create index on tenantId and period
CREATE INDEX IF NOT EXISTS "TenantBilling_tenantId_idx" ON "TenantBilling"("tenantId");
CREATE INDEX IF NOT EXISTS "TenantBilling_periodStart_idx" ON "TenantBilling"("periodStart");

-- Create TenantClient table (tracks clients under each tenant)
CREATE TABLE IF NOT EXISTS "TenantClient" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,

  -- Client info
  "clientName" TEXT NOT NULL,
  "clientEmail" TEXT,
  "clientPhone" TEXT,

  -- Status
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "isActive" BOOLEAN NOT NULL DEFAULT true,

  -- Billing
  "monthlyFee" DECIMAL(10,2),
  "lastBilledAt" TIMESTAMP,

  -- Metadata
  "notes" TEXT,
  "metadata" JSONB,

  -- Timestamps
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TenantClient_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE,
  CONSTRAINT "TenantClient_brandId_fkey"
    FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE,

  UNIQUE("tenantId", "brandId")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "TenantClient_tenantId_idx" ON "TenantClient"("tenantId");
CREATE INDEX IF NOT EXISTS "TenantClient_brandId_idx" ON "TenantClient"("brandId");

-- Add comments
COMMENT ON TABLE "Tenant" IS 'Agencies using white-label platform';
COMMENT ON TABLE "TenantInvitation" IS 'Invitations sent by tenants to clients';
COMMENT ON TABLE "TenantBilling" IS 'Monthly billing records for tenants';
COMMENT ON TABLE "TenantClient" IS 'Clients managed by each tenant';

-- Insert default tenant for existing data (optional)
INSERT INTO "Tenant" (
  "id",
  "name",
  "slug",
  "brandName",
  "supportEmail",
  "plan",
  "clientLimit"
) VALUES (
  'default_tenant',
  'Parichay.io',
  'parichay',
  'Parichay.io',
  'support@parichay.io',
  'PLATFORM',
  999999
) ON CONFLICT DO NOTHING;
