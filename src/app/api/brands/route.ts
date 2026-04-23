import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { brandCreateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

/**
 * @swagger
 * /brands:
 *   get:
 *     tags:
 *       - Brand Management
 *     summary: List brands
 *     description: |
 *       Get list of brands with different access levels:
 *       - **Super Admin**: Can see all brands in the system
 *       - **Other roles**: Can only see their assigned brand
 *
 *       **Includes:**
 *       - Brand basic information
 *       - Branch count and first branch details
 *       - Subscription status and plan information
 *       - Real-time statistics (views, leads)
 *       - Analytics data from the last 30 days
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of brands with statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brands:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       name:
 *                         type: string
 *                         example: Acme Corporation
 *                       slug:
 *                         type: string
 *                         example: acme-corporation
 *                       logo:
 *                         type: string
 *                         nullable: true
 *                         example: https://cdn.example.com/logos/acme.png
 *                       tagline:
 *                         type: string
 *                         nullable: true
 *                         example: Innovation at its best
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: Leading technology company
 *                       website:
 *                         type: string
 *                         nullable: true
 *                         example: https://acme.com
 *                       customDomain:
 *                         type: string
 *                         nullable: true
 *                         example: cards.acme.com
 *                       colorTheme:
 *                         type: object
 *                         properties:
 *                           primary:
 *                             type: string
 *                             example: "#3B82F6"
 *                           secondary:
 *                             type: string
 *                             example: "#1E40AF"
 *                           accent:
 *                             type: string
 *                             example: "#F59E0B"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-01-15T10:30:00Z
 *                       _count:
 *                         type: object
 *                         properties:
 *                           branches:
 *                             type: number
 *                             example: 3
 *                       branches:
 *                         type: array
 *                         description: First branch only (for preview)
 *                         maxItems: 1
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             slug:
 *                               type: string
 *                             name:
 *                               type: string
 *                             _count:
 *                               type: object
 *                               properties:
 *                                 leads:
 *                                   type: number
 *                       subscription:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           status:
 *                             type: string
 *                             enum: [ACTIVE, INACTIVE, CANCELLED, PAST_DUE]
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                           plan:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                       stats:
 *                         type: object
 *                         description: Real-time statistics
 *                         properties:
 *                           views:
 *                             type: number
 *                             description: Total page views across all branches
 *                             example: 1250
 *                           leads:
 *                             type: number
 *                             description: Total leads across all branches
 *                             example: 45
 *             example:
 *               brands:
 *                 - id: 123e4567-e89b-12d3-a456-426614174000
 *                   name: Acme Corporation
 *                   slug: acme-corporation
 *                   tagline: Innovation at its best
 *                   colorTheme:
 *                     primary: "#3B82F6"
 *                     secondary: "#1E40AF"
 *                     accent: "#F59E0B"
 *                   _count:
 *                     branches: 3
 *                   stats:
 *                     views: 1250
 *                     leads: 45
 *                   subscription:
 *                     status: ACTIVE
 *                     plan:
 *                       name: Professional
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *   post:
 *     tags:
 *       - Brand Management
 *     summary: Create brand
 *     description: |
 *       Create a new brand with optional initial branch setup.
 *
 *       **Access Control:**
 *       - Super Admin: Can create brands for any user
 *       - Brand Manager: Can create brands (assigned as owner)
 *
 *       **Features:**
 *       - Automatic slug generation from brand name
 *       - Custom domain validation and setup
 *       - Color theme customization
 *       - Initial branch creation (optional)
 *       - Default microsite configuration
 *       - User brand assignment
 *
 *       **Slug Generation:**
 *       - Automatically generated from brand name
 *       - Handles duplicates with numeric suffixes
 *       - URL-safe formatting
 *
 *       **Initial Branch:**
 *       - If provided, creates first branch automatically
 *       - Sets up default microsite configuration
 *       - Includes contact information and address
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Brand name (used for slug generation)
 *                 example: Acme Corporation
 *               tagline:
 *                 type: string
 *                 maxLength: 200
 *                 description: Short brand tagline
 *                 example: Innovation at its best
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Detailed brand description
 *                 example: Leading technology company providing innovative solutions
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Brand website URL
 *                 example: https://acme.com
 *               customDomain:
 *                 type: string
 *                 pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
 *                 description: Custom domain for microsites (optional)
 *                 example: cards.acme.com
 *               colorTheme:
 *                 type: object
 *                 description: Brand color theme
 *                 properties:
 *                   primary:
 *                     type: string
 *                     pattern: '^#[0-9A-Fa-f]{6}$'
 *                     description: Primary brand color (hex)
 *                     example: "#3B82F6"
 *                   secondary:
 *                     type: string
 *                     pattern: '^#[0-9A-Fa-f]{6}$'
 *                     description: Secondary brand color (hex)
 *                     example: "#1E40AF"
 *                   accent:
 *                     type: string
 *                     pattern: '^#[0-9A-Fa-f]{6}$'
 *                     description: Accent color (hex)
 *                     example: "#F59E0B"
 *               initialBranch:
 *                 type: object
 *                 description: Create initial branch with brand
 *                 properties:
 *                   name:
 *                     type: string
 *                     minLength: 1
 *                     description: Branch name
 *                     example: Main Office
 *                   address:
 *                     type: string
 *                     description: Full branch address
 *                     example: 123 Business St, City, State 12345
 *                   phone:
 *                     type: string
 *                     pattern: '^\+?[1-9]\d{1,14}$'
 *                     description: Branch phone number
 *                     example: "+1-555-0123"
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Branch contact email
 *                     example: contact@acme.com
 *           examples:
 *             basic_brand:
 *               summary: Basic brand creation
 *               description: Create brand with minimal information
 *               value:
 *                 name: Acme Corporation
 *                 tagline: Innovation at its best
 *             full_brand:
 *               summary: Complete brand with initial branch
 *               description: Create brand with full details and initial branch
 *               value:
 *                 name: Acme Corporation
 *                 tagline: Innovation at its best
 *                 description: Leading technology company providing innovative solutions
 *                 website: https://acme.com
 *                 customDomain: cards.acme.com
 *                 colorTheme:
 *                   primary: "#3B82F6"
 *                   secondary: "#1E40AF"
 *                   accent: "#F59E0B"
 *                 initialBranch:
 *                   name: Main Office
 *                   address: 123 Business St, City, State 12345
 *                   phone: "+1-555-0123"
 *                   email: contact@acme.com
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brand:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     name:
 *                       type: string
 *                       example: Acme Corporation
 *                     slug:
 *                       type: string
 *                       example: acme-corporation
 *                     tagline:
 *                       type: string
 *                       example: Innovation at its best
 *                     colorTheme:
 *                       type: object
 *                       properties:
 *                         primary:
 *                           type: string
 *                           example: "#3B82F6"
 *                         secondary:
 *                           type: string
 *                           example: "#1E40AF"
 *                         accent:
 *                           type: string
 *                           example: "#F59E0B"
 *                     ownerId:
 *                       type: string
 *                       format: uuid
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     _count:
 *                       type: object
 *                       properties:
 *                         branches:
 *                           type: number
 *                           example: 1
 *       400:
 *         description: Validation error or database constraint violation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation failed
 *                 details:
 *                   type: object
 *                   description: Detailed validation errors
 *                   example:
 *                     name: Name is required
 *                     email: Invalid email format
 *             examples:
 *               validation_error:
 *                 summary: Input validation failed
 *                 value:
 *                   error: Validation failed
 *                   details:
 *                     name: Name is required
 *                     colorTheme.primary: Invalid color format
 *               database_error:
 *                 summary: Database constraint violation
 *                 value:
 *                   error: Database error: Unique constraint failed
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Insufficient permissions
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unable to generate unique slug after multiple attempts
 */

// GET /api/brands - List all brands (Super Admin) or user's brand
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let brands: any[];
    const whereClause = user.role === 'SUPER_ADMIN' ? {} : { id: user.brandId };

    if (user.role !== 'SUPER_ADMIN' && !user.brandId) {
      return NextResponse.json({ brands: [] });
    }

    brands = await prisma.brand.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { branches: true },
        },
        branches: {
          select: {
            id: true,
            slug: true,
            name: true,
            _count: {
              select: { leads: true },
            },
          },
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        subscription: {
          select: {
            status: true,
            endDate: true,
            plan: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch real stats for each brand
    const brandsWithStats = await Promise.all(
      brands.map(async (brand) => {
        // Calculate total leads across all branches
        const totalLeads = brand.branches.reduce(
          (sum: number, branch: any) => sum + (branch._count?.leads || 0),
          0
        );

        // Get view count from analytics (if table exists)
        let totalViews = 0;
        try {
          const branchIds = brand.branches.map((b: any) => b.id);
          if (branchIds.length > 0) {
            totalViews = await prisma.analyticsEvent.count({
              where: {
                branchId: { in: branchIds },
                eventType: 'PAGE_VIEW',
              },
            });
          }
        } catch {
          // Analytics table might not exist
        }

        return {
          ...brand,
          branches: brand.branches.slice(0, 1), // Only return first branch
          stats: {
            views: totalViews,
            leads: totalLeads,
          },
        };
      })
    );

    return NextResponse.json({ brands: brandsWithStats });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/brands - Create new brand
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'BRAND_MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = brandCreateSchema.parse(body);

    // Generate slug from name
    const baseSlug = generateSlug(validatedData.name);

    // Ensure customDomain is undefined (not empty string) to avoid unique constraint issues
    const customDomain = validatedData.customDomain && validatedData.customDomain.trim() !== ''
      ? validatedData.customDomain.trim()
      : undefined;

    // Use transaction with retry for race condition handling
    const result = await prisma.$transaction(async (tx) => {
      // Find unique slug inside transaction to avoid race conditions
      let slug = baseSlug;
      let counter = 1;
      const maxAttempts = 10;

      while (counter <= maxAttempts) {
        const existing = await tx.brand.findUnique({ where: { slug } });
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      if (counter > maxAttempts) {
        throw new Error('Unable to generate unique slug after multiple attempts');
      }

      const brand = await tx.brand.create({
        data: {
          ...validatedData,
          slug,
          ownerId: user.id,
          customDomain, // Override with cleaned value
          colorTheme: validatedData.colorTheme || {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#F59E0B',
          },
          // Remove initialBranch from brand creation data as it's not a field on Brand
          initialBranch: undefined,
        } as any, // Type assertion needed because we're stripping initialBranch
        include: {
          _count: {
            select: { branches: true },
          },
        },
      });

      // Create initial branch if provided
      if (validatedData.initialBranch) {
        const branchSlug = generateSlug(validatedData.initialBranch.name);

        const branch = await tx.branch.create({
          data: {
            name: validatedData.initialBranch.name,
            slug: branchSlug,
            brandId: brand.id,
            address: validatedData.initialBranch.address,
            contact: {
              phone: validatedData.initialBranch.phone,
              email: validatedData.initialBranch.email,
            },
            socialMedia: validatedData.initialBranch.socialMedia || {},
            isActive: true,
            micrositeConfig: validatedData.initialBranch.micrositeConfig || {
              templateId: 'modern-business',
              sections: {
                hero: { enabled: true, title: brand.name, subtitle: validatedData.tagline || '' },
                about: { enabled: true, content: `Welcome to ${brand.name}` },
                services: { enabled: true, items: [] },
                contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'phone'] } }
              },
              seoSettings: {
                title: brand.name,
                description: validatedData.tagline || '',
                keywords: []
              }
            }
          }
        });
      }

      // Update user's brandId if they don't have one
      if (!user.brandId) {
        await tx.user.update({
          where: { id: user.id },
          data: { brandId: brand.id },
        });
      }

      return brand;
    });

    return NextResponse.json({ brand: result }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating brand:', error);

    // Handle Zod validation errors
    if (error.errors) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
