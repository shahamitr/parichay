/**
 * Branch Privacy Settings API
 * PUT /api/branches/[id]/privacy - Update privacy settings
 * POST /api/branches/[id]/privacy/verify - Verify access password/token
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const updatePrivacySchema = z.object({
  visibility: z.enum(['public', 'private', 'unlisted']),
  accessPassword: z.string().min(6).optional(),
  generateToken: z.boolean().optional(),
  tokenExpiresAt: z.string().datetime().optional(),
});

// Generate secure access token
function generateAccessToken(): string {
  return `tk_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { id } = await params;
    const body = await request.json();
    const validatedData = updatePrivacySchema.parse(body);

    // Check authorization
    const branch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== branch.brandId &&
      !user.branches.some((b: any) => b.id === id)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
      visibility: validatedData.visibility,
    };

    // Hash password if provided
    if (validatedData.accessPassword) {
      updateData.accessPassword = await bcrypt.hash(validatedData.accessPassword, 12);
    }

    // Generate token if requested
    if (validatedData.generateToken) {
      updateData.accessToken = generateAccessToken();
      if (validatedData.tokenExpiresAt) {
        updateData.tokenExpiresAt = new Date(validatedData.tokenExpiresAt);
      }
    }

    // Update branch
    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: updateData,
    });

    // Don't return the hashed password
    const { accessPassword, ...branchData } = updatedBranch as any;

    return NextResponse.json(branchData);
  } catch (error) {
    console.error('Privacy update error:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy settings' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, token } = body;

    const branch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Verify password
    if (password && (branch as any).accessPassword) {
      const isValid = await bcrypt.compare(password, (branch as any).accessPassword);
      if (isValid) {
        return NextResponse.json({ access: 'granted', method: 'password' });
      }
    }

    // Verify token
    if (token && (branch as any).accessToken === token) {
      // Check if token is expired
      if ((branch as any).tokenExpiresAt && new Date() > (branch as any).tokenExpiresAt) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      return NextResponse.json({ access: 'granted', method: 'token' });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Privacy verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify access' },
      { status: 500 }
    );
  }
}
