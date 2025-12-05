/**
 * Tenant Service for White-Label Platform
 */

import { prisma } from '@/lib/prisma';

export interface TenantConfig {
  name: string;
  slug: string;
  brandName: string;
  supportEmail: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  plan?: string;
  clientLimit?: number;
}

/**
 * Create a new tenant (agency)
 */
export async function createTenant(config: TenantConfig, ownerId: string) {
  const tenant = await prisma.tenant.create({
    data: {
      name: config.name,
      slug: config.slug,
      brandName: config.brandName,
      supportEmail: config.supportEmail,
      logo: config.logo,
      primaryColor: config.primaryColor || '#3B82F6',
      secondaryColor: config.secondaryColor || '#10B981',
      plan: config.plan || 'AGENCY_STARTER',
      clientLimit: config.clientLimit || 10,
      domain: `${config.slug}.parichay.io`,
    },
  });

  // Assign owner to tenant
  await prisma.user.update({
    where: { id: ownerId },
    data: {
      tenantId: tenant.id,
      role: 'TENANT_ADMIN',
    },
  });

  return tenant;
}

/**
 * Get tenant by domain
 */
export async function getTenantByDomain(domain: string) {
  return prisma.tenant.findFirst({
    where: {
      OR: [
        { domain },
        { customDomain: domain },
        { slug: domain.split('.')[0] }, // Support subdomain
      ],
      isActive: true,
    },
  });
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string) {
  return prisma.tenant.findUnique({
    where: { slug, isActive: true },
  });
}

/**
 * Update tenant branding
 */
export async function updateTenantBranding(
  tenantId: string,
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    brandName?: string;
    tagline?: string;
    showPoweredBy?: boolean;
  }
) {
  return prisma.tenant.update({
    where: { id: tenantId },
    data: branding,
  });
}

/**
 * Add client to tenant
 */
export async function addClientToTenant(
  tenantId: string,
  brandId: string,
  clientInfo: {
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    monthlyFee?: number;
  }
) {
  // Check client limit
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      clients: { where: { isActive: true } },
    },
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  if (tenant.clients.length >= tenant.clientLimit) {
    throw new Error('Client limit reached. Please upgrade your plan.');
  }

  // Create client record
  const client = await prisma.tenantClient.create({
    data: {
      tenantId,
      brandId,
      clientName: clientInfo.clientName,
      clientEmail: clientInfo.clientEmail,
      clientPhone: clientInfo.clientPhone,
      monthlyFee: clientInfo.monthlyFee,
    },
  });

  // Associate brand with tenant
  await prisma.brand.update({
    where: { id: brandId },
    data: { tenantId },
  });

  return client;
}

/**
 * Get tenant clients
 */
export async function getTenantClients(tenantId: string) {
  return prisma.tenantClient.findMany({
    where: { tenantId },
    include: {
      brand: {
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
          branches: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get tenant statistics
 */
export async function getTenantStats(tenantId: string) {
  const [
    totalClients,
    activeClients,
    totalBrands,
    totalBranches,
    currentMonthBilling,
  ] = await Promise.all([
    prisma.tenantClient.count({ where: { tenantId } }),
    prisma.tenantClient.count({ where: { tenantId, isActive: true } }),
    prisma.brand.count({ where: { tenantId } }),
    prisma.branch.count({
      where: {
        brand: { tenantId },
      },
    }),
    prisma.tenantBilling.findFirst({
      where: {
        tenantId,
        periodStart: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  return {
    totalClients,
    activeClients,
    totalBrands,
    totalBranches,
    currentMonthRevenue: currentMonthBilling?.total || 0,
  };
}

/**
 * Generate monthly billing for tenant
 */
export async function generateTenantBilling(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      clients: {
        where: { isActive: true },
      },
    },
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const clientCount = tenant.clients.length;
  const subtotal = clientCount * Number(tenant.pricePerClient);
  const tax = subtotal * 0.18; // 18% tax (adjust based on region)
  const total = subtotal + tax;

  const billing = await prisma.tenantBilling.create({
    data: {
      tenantId,
      periodStart,
      periodEnd,
      clientCount,
      activeClients: clientCount,
      subtotal,
      tax,
      total,
      status: 'PENDING',
    },
  });

  return billing;
}

/**
 * Check if tenant can add more clients
 */
export async function canAddClient(tenantId: string): Promise<boolean> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      clients: { where: { isActive: true } },
    },
  });

  if (!tenant) return false;

  return tenant.clients.length < tenant.clientLimit;
}
