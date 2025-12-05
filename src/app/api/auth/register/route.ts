import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser != null) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(validatedData.password);

    // Create user and brand in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let brand = null;

      // Create brand if provided
      if (validatedData.brandName) {
        const slug = validatedData.brandName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if brand slug already exists
        const existingBrand = await tx.brand.findUnique({
          where: { slug },
        });

        if (existingBrand != null) {
          throw new Error('Brand name already taken');
        }

        brand = await tx.brand.create({
          data: {
            name: validatedData.brandName,
            slug,
            colorTheme: {
              primary: '#3B82F6',
              secondary: '#1E40AF',
              accent: '#F59E0B',
            },
            ownerId: '', // Will be updated after user creation
          },
        });
      }

      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.brandName ? 'BRAND_MANAGER' : 'BRANCH_ADMIN',
          brandId: brand?.id,
        },
      });

      // Update brand owner if brand was created
      if (brand != null) {
        await tx.brand.update({
          where: { id: brand.id },
          data: { ownerId: user.id },
        });
      }

      return { user, brand };
    });

    // Generate tokens
    const accessToken = AuthService.generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      brandId: result.user.brandId || undefined,
    });

    const refreshToken = AuthService.generateRefreshToken(result.user.id);

    // Set HTTP-only cookies
    const response = NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        brandId: result.user.brandId,
        brand: result.brand,
      },
      accessToken,
    }, { status: 201 });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid input data' },
          { status: 400 }
        );
      }

      if (error.message === 'Brand name already taken') {
        return NextResponse.json(
          { error: 'Brand name already taken' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}