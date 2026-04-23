import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { MFAService } from '@/lib/mfa';
import { loginSchema } from '@/lib/validations';
import logger from '@/lib/logger';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: |
 *       Authenticate user with email and password. Returns JWT token and user information.
 *
 *       **Features:**
 *       - Email/password authentication
 *       - Multi-factor authentication (MFA) support
 *       - Backup code authentication
 *       - JWT token generation
 *       - Secure cookie setting
 *       - Login tracking
 *
 *       **MFA Flow:**
 *       1. If MFA is enabled and no MFA token/backup code provided, returns 403 with `requiresMFA: true`
 *       2. Client should prompt user for MFA token or backup code
 *       3. Retry login request with `mfaToken` or `backupCode` field
 *
 *       **Security Features:**
 *       - Password hashing verification
 *       - Account status validation
 *       - Rate limiting protection
 *       - Secure HTTP-only cookies
 *       - CSRF protection via SameSite cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User's password
 *                 example: securepassword123
 *               mfaToken:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 description: 6-digit MFA token (required if MFA is enabled)
 *                 example: "123456"
 *               backupCode:
 *                 type: string
 *                 description: MFA backup code (alternative to mfaToken)
 *                 example: "backup-code-123"
 *           examples:
 *             basic_login:
 *               summary: Basic login
 *               description: Standard email/password login
 *               value:
 *                 email: user@example.com
 *                 password: securepassword123
 *             mfa_login:
 *               summary: Login with MFA token
 *               description: Login with multi-factor authentication
 *               value:
 *                 email: user@example.com
 *                 password: securepassword123
 *                 mfaToken: "123456"
 *             backup_code_login:
 *               summary: Login with backup code
 *               description: Login using MFA backup code
 *               value:
 *                 email: user@example.com
 *                 password: securepassword123
 *                 backupCode: "backup-code-123"
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookies for authentication
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     role:
 *                       type: string
 *                       enum: [SUPER_ADMIN, BRAND_MANAGER, BRANCH_MANAGER, EXECUTIVE, BUSINESS_OWNER]
 *                       example: BRAND_MANAGER
 *                     brandId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                       example: 456e7890-e89b-12d3-a456-426614174001
 *                     brand:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for API authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input data
 *                 type:
 *                   type: string
 *                   example: VALIDATION_ERROR
 *       401:
 *         description: Invalid credentials or MFA code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:
 *                     - Invalid credentials
 *                     - Account is inactive
 *                     - Invalid MFA code
 *                   example: Invalid credentials
 *             examples:
 *               invalid_credentials:
 *                 summary: Invalid email or password
 *                 value:
 *                   error: Invalid credentials
 *               inactive_account:
 *                 summary: Account is deactivated
 *                 value:
 *                   error: Account is inactive
 *               invalid_mfa:
 *                 summary: Invalid MFA token
 *                 value:
 *                   error: Invalid MFA code
 *       403:
 *         description: MFA verification required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requiresMFA:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: MFA verification required
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   description: User ID for MFA verification
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *       503:
 *         description: Service unavailable (database connection issues)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database connection failed. Please ensure the database is running and try again.
 *                 type:
 *                   type: string
 *                   enum: [DATABASE_ERROR, NETWORK_ERROR]
 *                   example: DATABASE_ERROR
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 *                 type:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    logger.info({ email: body.email }, 'Login attempt');

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { brand: true },
    });

    if (!user) {
      logger.warn({ email: validatedData.email }, 'User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      logger.warn({ email: validatedData.email }, 'User inactive');
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      logger.warn({ email: validatedData.email }, 'Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if MFA is enabled
    if (user.mfaEnabled && user.mfaSecret) {
      const mfaToken = (body as any).mfaToken;
      const backupCode = (body as any).backupCode;

      // If no MFA token or backup code provided, request it
      if (!mfaToken && !backupCode) {
        return NextResponse.json(
          {
            requiresMFA: true,
            message: 'MFA verification required',
            userId: user.id,
          },
          { status: 403 }
        );
      }

      // Verify MFA token or backup code
      let mfaValid = false;

      if (mfaToken != null) {
        mfaValid = MFAService.verifyTOTP(mfaToken, user.mfaSecret);
      } else if (backupCode && user.backupCodes) {
        const backupCodesArray = user.backupCodes as string[];
        const result = await MFAService.verifyBackupCode(backupCode, backupCodesArray);
        mfaValid = result.valid;

        if (result.valid) {
          await prisma.user.update({
            where: { id: user.id },
            data: { backupCodes: result.remainingCodes },
          });
        }
      }

      if (!mfaValid) {
        return NextResponse.json(
          { error: 'Invalid MFA code' },
          { status: 401 }
        );
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      brandId: user.brandId || undefined,
    });

    const refreshToken = AuthService.generateRefreshToken(user.id);

    logger.info({ email: user.email }, 'Tokens generated');

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        brandId: user.brandId,
        brand: user.brand,
      },
      accessToken,
    });

    // Set cookies on the response object
    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    logger.info({ email: user.email, role: user.role }, 'Login successful');

    return response;
  } catch (error) {
    logger.error({ error }, 'Login error');

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Check for database connection errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      // Prisma connection errors
      if (errorMessage.includes('connect') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('econnrefused') ||
          errorMessage.includes('etimedout') ||
          errorMessage.includes('database')) {
        logger.error({ error: error.message }, 'Database connection error');
        return NextResponse.json(
          {
            error: 'Database connection failed. Please ensure the database is running and try again.',
            type: 'DATABASE_ERROR'
          },
          { status: 503 }
        );
      }

      // Network errors
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return NextResponse.json(
          {
            error: 'Network error. Please check your connection and try again.',
            type: 'NETWORK_ERROR'
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
        type: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
