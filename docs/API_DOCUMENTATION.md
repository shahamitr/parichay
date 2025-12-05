# OneTouch BizCard - API Documentation

## Overview

This document provides comprehensive API documentation for OneTouch BizCard platform. All API endpoints follow RESTful conventions and return JSON responses.

## Base URL

```
Production: https://onetouchbizcard.in/api
Staging: https://staging.onetouchbizcard.in/api
Development: http://localhost:3000/api
```

## Authentication

### JWT Authentication

Most API endpoints require authentication using JWT tokens.

**Request Header:**
```
Authorization: Bearer <jwt_token>
```

**Token Expiration:** 24 hours

### Obtaining a Token

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "brand_manager"
  }
}
```

---

## API Endpoints

### Health Check

#### GET /api/health

Check system health status.

**Authentication:** Not required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```

---

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "brandName": "My Business"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "userId": "user_123",
  "brandId": "brand_456"
}
```

#### POST /api/auth/login

Authenticate user and obtain JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "brand_manager"
  }
}
```

#### POST /api/auth/logout

Invalidate current session.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST /api/auth/reset-password

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### Brands

#### GET /api/brands

Get all brands (filtered by user role).

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by brand name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "brand_123",
      "name": "My Business",
      "slug": "my-business",
      "logo": "https://cdn.onetouchbizcard.in/logos/brand_123.png",
      "tagline": "Your trusted partner",
      "colorTheme": {
        "primary": "#FF6600",
        "secondary": "#333333",
        "accent": "#FFCC00"
      },
      "customDomain": "mybusiness.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET /api/brands/:id

Get brand details by ID.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brand_123",
    "name": "My Business",
    "slug": "my-business",
    "logo": "https://cdn.onetouchbizcard.in/logos/brand_123.png",
    "tagline": "Your trusted partner",
    "colorTheme": {
      "primary": "#FF6600",
      "secondary": "#333333",
      "accent": "#FFCC00"
    },
    "customDomain": "mybusiness.com",
    "branches": [
      {
        "id": "branch_456",
        "name": "Main Office",
        "slug": "main-office"
      }
    ],
    "subscription": {
      "plan": "professional",
      "status": "active",
      "expiresAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/brands

Create a new brand.

**Authentication:** Required (Super Admin only)

**Request Body:**
```json
{
  "name": "New Business",
  "slug": "new-business",
  "tagline": "Innovation at its best",
  "colorTheme": {
    "primary": "#0066CC",
    "secondary": "#333333",
    "accent": "#00CC66"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "id": "brand_789",
    "name": "New Business",
    "slug": "new-business"
  }
}
```

#### PUT /api/brands/:id

Update brand information.

**Authentication:** Required (Brand Manager or Super Admin)

**Request Body:**
```json
{
  "name": "Updated Business Name",
  "tagline": "New tagline",
  "colorTheme": {
    "primary": "#FF0000",
    "secondary": "#000000",
    "accent": "#FFFF00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Brand updated successfully",
  "data": {
    "id": "brand_123",
    "name": "Updated Business Name"
  }
}
```

#### DELETE /api/brands/:id

Delete a brand (soft delete).

**Authentication:** Required (Super Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Brand deleted successfully"
}
```

#### POST /api/brands/:id/logo

Upload brand logo.

**Authentication:** Required (Brand Manager or Super Admin)

**Request:** Multipart form data
- `logo`: Image file (PNG, JPG, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "logoUrl": "https://cdn.onetouchbizcard.in/logos/brand_123.png"
}
```

---

### Branches

#### GET /api/branches

Get all branches (filtered by user role).

**Authentication:** Required

**Query Parameters:**
- `brandId` (optional): Filter by brand ID
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "branch_456",
      "name": "Main Office",
      "slug": "main-office",
      "brandId": "brand_123",
      "address": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001",
        "country": "India"
      },
      "contact": {
        "phone": "+91-9876543210",
        "whatsapp": "+91-9876543210",
        "email": "contact@mybusiness.com"
      },
      "micrositeUrl": "https://onetouchbizcard.in/my-business/main-office"
    }
  ]
}
```

#### POST /api/branches

Create a new branch.

**Authentication:** Required (Brand Manager or Super Admin)

**Request Body:**
```json
{
  "brandId": "brand_123",
  "name": "New Branch",
  "slug": "new-branch",
  "address": {
    "street": "456 Park Ave",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  },
  "contact": {
    "phone": "+91-9876543210",
    "email": "newbranch@mybusiness.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Branch created successfully",
  "data": {
    "id": "branch_789",
    "micrositeUrl": "https://onetouchbizcard.in/my-business/new-branch"
  }
}
```

---

### Microsites

#### GET /api/microsites/:brandSlug/:branchSlug

Get microsite configuration and content.

**Authentication:** Not required (public endpoint)

**Response:**
```json
{
  "success": true,
  "data": {
    "brand": {
      "name": "My Business",
      "logo": "https://cdn.onetouchbizcard.in/logos/brand_123.png",
      "colorTheme": {
        "primary": "#FF6600",
        "secondary": "#333333"
      }
    },
    "branch": {
      "name": "Main Office",
      "address": "123 Main St, Mumbai",
      "contact": {
        "phone": "+91-9876543210",
        "email": "contact@mybusiness.com"
      }
    },
    "config": {
      "sections": {
        "hero": {
          "enabled": true,
          "title": "Welcome to My Business",
          "subtitle": "Your trusted partner"
        },
        "services": {
          "enabled": true,
          "items": [...]
        }
      }
    }
  }
}
```

#### PUT /api/microsites/:id/config

Update microsite configuration.

**Authentication:** Required (Branch Admin or higher)

**Request Body:**
```json
{
  "sections": {
    "hero": {
      "enabled": true,
      "title": "Updated Title",
      "backgroundImage": "https://..."
    },
    "services": {
      "enabled": true,
      "items": [
        {
          "name": "Service 1",
          "description": "Description",
          "price": 999
        }
      ]
    }
  }
}
```

---

### QR Codes

#### GET /api/qr-codes/:branchId

Get QR code for a branch.

**Authentication:** Required

**Query Parameters:**
- `format` (optional): png, svg, pdf (default: png)
- `size` (optional): 200-1000 (default: 500)

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCodeUrl": "https://cdn.onetouchbizcard.in/qr/branch_456.png",
    "downloadUrl": "https://onetouchbizcard.in/api/qr-codes/branch_456/download"
  }
}
```

#### GET /api/qr-codes/:branchId/analytics

Get QR code scan analytics.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScans": 1234,
    "scansThisMonth": 156,
    "scansByLocation": [
      {"country": "India", "count": 800},
      {"country": "USA", "count": 234}
    ],
    "recentScans": [
      {
        "timestamp": "2024-01-01T12:00:00.000Z",
        "location": "Mumbai, India"
      }
    ]
  }
}
```

---

### Analytics

#### GET /api/analytics/overview

Get analytics overview for user's brands/branches.

**Authentication:** Required

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `brandId` (optional): Filter by brand
- `branchId` (optional): Filter by branch

**Response:**
```json
{
  "success": true,
  "data": {
    "pageViews": 5432,
    "uniqueVisitors": 3210,
    "qrScans": 1234,
    "leads": 89,
    "conversionRate": 2.77,
    "topPages": [
      {
        "url": "/my-business/main-office",
        "views": 2345
      }
    ]
  }
}
```

---

### Subscriptions

#### GET /api/subscriptions/plans

Get available subscription plans.

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_basic",
      "name": "Basic",
      "price": 999,
      "duration": "monthly",
      "features": {
        "maxBranches": 3,
        "customDomain": false,
        "analytics": true,
        "qrCodes": true
      }
    },
    {
      "id": "plan_professional",
      "name": "Professional",
      "price": 2999,
      "duration": "monthly",
      "features": {
        "maxBranches": 10,
        "customDomain": true,
        "analytics": true,
        "qrCodes": true
      }
    }
  ]
}
```

#### POST /api/subscriptions/checkout

Create checkout session for subscription.

**Authentication:** Required

**Request Body:**
```json
{
  "planId": "plan_professional",
  "gateway": "stripe"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_..."
}
```

---

### Payments

#### POST /api/payments/webhook/stripe

Stripe webhook endpoint (internal use).

**Authentication:** Webhook signature verification

#### POST /api/payments/webhook/razorpay

Razorpay webhook endpoint (internal use).

**Authentication:** Webhook signature verification

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated requests:** 100 requests per 15 minutes
- **Unauthenticated requests:** 20 requests per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Webhooks

OneTouch BizCard can send webhooks for various events.

### Webhook Events

- `lead.created`: New lead submitted
- `subscription.created`: New subscription
- `subscription.renewed`: Subscription renewed
- `subscription.expired`: Subscription expired
- `payment.succeeded`: Payment successful
- `payment.failed`: Payment failed

### Webhook Payload

```json
{
  "event": "lead.created",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "data": {
    "leadId": "lead_123",
    "branchId": "branch_456",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://onetouchbizcard.in/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Get brands
const brands = await api.get('/brands');

// Create branch
const branch = await api.post('/branches', {
  brandId: 'brand_123',
  name: 'New Branch',
  slug: 'new-branch',
});
```

### Python

```python
import requests

API_BASE = 'https://onetouchbizcard.in/api'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json',
}

# Get brands
response = requests.get(f'{API_BASE}/brands', headers=headers)
brands = response.json()

# Create branch
branch_data = {
    'brandId': 'brand_123',
    'name': 'New Branch',
    'slug': 'new-branch',
}
response = requests.post(f'{API_BASE}/branches', json=branch_data, headers=headers)
```

---

## Support

For API support:
- Email: api-support@onetouchbizcard.in
- Documentation: https://docs.onetouchbizcard.in
- Status: https://status.onetouchbizcard.in

---

**API Version**: 1.0
**Last Updated**: [Date]
