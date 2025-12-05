# Authentication System Guide

## Overview

The OneTouch BizCard authentication system has been completely revamped to ensure reliable cookie-based authentication with JWT tokens.

## How It Works

### 1. Login Flow

1. User submits email and password to `/api/auth/login`
2. Server validates credentials against database
3. Server generates JWT access token (7 days) and refresh token (30 days)
4. Tokens are set as HttpOnly cookies
5. User data is returned in response
6. Client verifies authentication by calling `/api/auth/me`
7. Client redirects based on user role

### 2. Authentication Endpoints

#### POST `/api/auth/login`
- **Body**: `{ email: string, password: string }`
- **Response**: User data and access token
- **Cookies Set**: `accessToken`, `refreshToken`

#### GET `/api/auth/me`
- **Headers**: Cookies automatically included
- **Response**: Current user data
- **Status**: 401 if not authenticated

#### POST `/api/auth/logout`
- **Response**: Success message
- **Cookies Cleared**: `accessToken`, `refreshToken`

### 3. Middleware Protection

The middleware (`src/middleware.ts`) automatically:
- Protects routes: `/dashboard`, `/admin`, `/executive`, `/api/brands`, `/api/branches`
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login` and `/register`
- Adds user info to request headers for API routes
- Handles role-based redirects (executives → `/executive`)

### 4. Cookie Configuration

```typescript
{
  httpOnly: true,              // Prevents JavaScript access
  secure: NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'lax',            // CSRF protection
  maxAge: 7 * 24 * 60 * 60,   // 7 days for access token
  path: '/',                   // Available site-wide
}
```

## Test Users

### Super Admin
- **Email**: `admin@onetouch.local`
- **Password**: `Admin@123`
- **Access**: Full system access

### Executive
- **Email**: `john.smith@demo.executive`
- **Password**: `Executive@123`
- **Access**: Executive portal only

## Testing

### Browser Testing
Visit: `http://localhost:3000/test-auth`

This page allows you to:
- Test login with different credentials
- View current authentication status
- See login response details
- Test logout functionality

### Command Line Testing
```bash
node test-login.js
```

This script tests:
- Login endpoint
- Cookie setting
- Token generation

## Troubleshooting

### Login Not Working

1. **Check Database Connection**
   ```bash
   node check-users.js
   ```

2. **Verify Environment Variables**
   - Ensure `.env` has `JWT_SECRET` set
   - Check `DATABASE_URL` is correct

3. **Check Server Logs**
   - Look for login attempt logs
   - Verify cookies are being set

4. **Clear Browser Cookies**
   - Sometimes old cookies interfere
   - Clear all cookies for localhost:3000

### Cookies Not Persisting

1. **Check Browser Settings**
   - Ensure cookies are enabled
   - Check for third-party cookie blockers

2. **Verify Credentials Include**
   ```javascript
   fetch('/api/auth/login', {
     credentials: 'include',  // Important!
     // ...
   })
   ```

3. **Check Middleware Logs**
   - Middleware logs show if token is present
   - Look for `hasToken: true/false`

## Security Features

1. **Password Hashing**: bcrypt with 12 rounds
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **JWT Expiration**: Tokens expire after 7 days
4. **Rate Limiting**: Applied to auth endpoints
5. **CORS Protection**: SameSite cookie attribute
6. **MFA Support**: Optional two-factor authentication

## Role-Based Access

- **SUPER_ADMIN**: Full system access
- **BRAND_ADMIN**: Brand management
- **EXECUTIVE**: Executive portal only
- **USER**: Basic access

## Next Steps

1. Implement refresh token rotation
2. Add session management
3. Implement "Remember Me" functionality
4. Add OAuth providers (Google, Microsoft)
5. Implement password reset flow
