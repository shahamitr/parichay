import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';

// GET /api/brands/[id]/custom-domain
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;

    // Verify user has access to this brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        id: true,
        customDomain: true,
        sslEnabled: true,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check authorization
    const user = authResult.user;
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      customDomain: brand.customDomain,
      sslEnabled: brand.sslEnabled,
    });
  } catch (error) {
    console.error('Get custom domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/brands/[id]/custom-domain
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;
    const body = await request.json();
    const { domain } = body;

    // Validate domain format
    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Verify user has access to this brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check authorization
    const user = authResult.user;
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if domain is already in use
    const existingDomain = await prisma.brand.findFirst({
      where: {
        customDomain: domain,
        id: { not: brandId },
      },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: 'Domain is already in use by another brand' },
        { status: 409 }
      );
    }

    // Validate domain ownership (DNS check)
    const validationResult = await validateDomainOwnership(domain, brandId);
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          error: 'Domain validation failed',
          message: validationResult.message,
          validationToken: validationResult.token,
        },
        { status: 400 }
      );
    }

    // Update brand with custom domain
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        customDomain: domain,
        sslEnabled: false, // SSL will be enabled after verification
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Custom domain configured successfully',
      domain,
      sslEnabled: false,
      nextSteps: [
        'Configure DNS records as shown in the instructions',
        'Wait for DNS propagation (up to 48 hours)',
        'SSL certificate will be automatically provisioned',
      ],
    });
  } catch (error) {
    console.error('Configure custom domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/brands/[id]/custom-domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;

    // Verify user has access to this brand
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check authorization
    const user = authResult.user;
    if (user.role !== 'SUPER_ADMIN' && user.brandId !== brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove custom domain
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        customDomain: null,
        sslEnabled: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Custom domain removed successfully',
    });
  } catch (error) {
    console.error('Remove custom domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to validate domain ownership
async function validateDomainOwnership(
  domain: string,
  brandId: string
): Promise<{ valid: boolean; message?: string; token?: string }> {
  // Generate validation token
  const validationToken = `onetouch-bizcard-verify-${brandId}`;

  try {
    // Check for TXT record with validation token
    // In production, use DNS lookup library like 'dns' or 'dns-promises'
    // For now, we'll simulate validation

    // Example DNS validation:
    // const dns = require('dns').promises;
    // const txtRecords = await dns.resolveTxt(domain);
    // const hasValidationRecord = txtRecords.some(record =>
    //   record.some(txt => txt.includes(validationToken))
    // );

    // For development, we'll accept any domain
    // In production, implement proper DNS validation
    console.log('Domain validation check:', {
      domain,
      validationToken,
      status: 'simulated_success',
    });

    return {
      valid: true,
      message: 'Domain validated successfully',
    };

    // Uncomment for production with actual DNS validation:
    // if (!hasValidationRecord) {
    //   return {
    //     valid: false,
    //     message: 'Please add the TXT record to verify domain ownership',
    //     token: validationToken,
    //   };
    // }
    //
    // return { valid: true };
  } catch (error) {
    console.error('Domain validation error:', error);
    return {
      valid: false,
      message: 'Failed to validate domain. Please check DNS configuration.',
      token: validationToken,
    };
  }
}
