# Quick Start - Authentication

## Test the Login System

### Option 1: Browser Test Page (Recommended)
1. Open browser: `http://localhost:3000/test-auth`
2. Credentials are pre-filled
3. Click "Test Login"
4. See real-time results

### Option 2: Regular Login Page
1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - **Email**: `admin@onetouch.local`
   - **Password**: `Admin@123`
3. Click "Sign in"
4. Redirects to dashboard

## Available Test Users

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@onetouch.local | Admin@123 | SUPER_ADMIN | Full access |
| john.smith@demo.executive | Executive@123 | EXECUTIVE | Executive portal |

## Verify It's Working

### Check 1: Login Response
- Status should be `200`
- Response should have `success: true`
- User data should be returned

### Check 2: Cookies Set
- Open DevTools → Application → Cookies
- Should see `accessToken` and `refreshToken`

### Check 3: Authentication Verified
- After login, `/api/auth/me` should return user data
- Middleware should allow access to protected routes

## Troubleshooting

### "Invalid credentials" error
- Check email is exactly: `admin@onetouch.local`
- Check password is exactly: `Admin@123`
- Verify user exists in database

### Cookies not set
- Check browser allows cookies
- Verify `credentials: 'include'` in fetch
- Check server logs for cookie setting confirmation

### Redirect not working
- Check console for errors
- Verify middleware is running
- Check role-based redirect logic

## Server Logs to Look For

✅ **Successful Login:**
```
🔐 Login attempt for: admin@onetouch.local
✅ Tokens generated for: admin@onetouch.local
📝 Access token length: 280
🍪 Cookies set successfully
✅ Login successful for: admin@onetouch.local Role: SUPER_ADMIN
```

❌ **Failed Login:**
```
🔐 Login attempt for: wrong@email.com
❌ User not found: wrong@email.com
```

## What's Been Fixed

✅ Cookie setting now works reliably
✅ JWT tokens generated correctly
✅ Authentication verification works
✅ Role-based redirects functional
✅ Comprehensive logging added
✅ Error handling improved

## Need Help?

1. Check `AUTH_GUIDE.md` for detailed documentation
2. Check `AUTHENTICATION_REVAMP_SUMMARY.md` for technical details
3. Use test page at `/test-auth` for debugging
