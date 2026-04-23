# Parichay API Documentation

## Overview

The Parichay API is a comprehensive REST API that powers the digital business card and microsite platform. It provides endpoints for authentication, brand management, lead capture, analytics, and more.

## 🚀 Quick Start

### 1. Access the Interactive Documentation

Visit the Swagger UI for interactive API testing:
- **Development**: http://localhost:3000/api-doc
- **Production**: https://your-domain.com/api-doc

### 2. Authentication

Most endpoints require authentication. Get your JWT token by logging in:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Use the returned `accessToken` in subsequent requests:

```bash
curl -X GET http://localhost:3000/api/brands \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Test the API

Run the comprehensive test suite:

```bash
# Test against development server
npm run test:api:dev

# Test against production server
npm run test:api:prod

# Custom API endpoint
API_BASE_URL=https://your-api.com/api npm run test:api
```

## 📚 API Reference

### Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.parichay.com`

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Content Type

All requests should use JSON:

```
Content-Type: application/json
```

### Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour
- **File uploads**: 50 requests per hour

## 🔐 Authentication Endpoints

### POST /auth/login

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "mfaToken": "123456" // Optional, required if MFA is enabled
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BRAND_MANAGER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "BUSINESS_OWNER"
}
```

### GET /auth/me

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "BRAND_MANAGER",
  "brandId": "456e7890-e89b-12d3-a456-426614174001"
}
```

## 🏢 Brand Management Endpoints

### GET /brands

List brands (all for Super Admin, user's brand for others).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "brands": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Acme Corporation",
      "slug": "acme-corporation",
      "tagline": "Innovation at its best",
      "colorTheme": {
        "primary": "#3B82F6",
        "secondary": "#1E40AF",
        "accent": "#F59E0B"
      },
      "stats": {
        "views": 1250,
        "leads": 45
      },
      "subscription": {
        "status": "ACTIVE",
        "plan": {
          "name": "Professional"
        }
      }
    }
  ]
}
```

### POST /brands

Create a new brand.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "name": "Acme Corporation",
  "tagline": "Innovation at its best",
  "description": "Leading technology company",
  "website": "https://acme.com",
  "colorTheme": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF",
    "accent": "#F59E0B"
  },
  "initialBranch": {
    "name": "Main Office",
    "address": "123 Business St, City, State 12345",
    "phone": "+1-555-0123",
    "email": "contact@acme.com"
  }
}
```

## 🏪 Branch Management Endpoints

### GET /branches

List branches for a brand.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `brandId` (required): Brand ID to filter branches

**Example:**
```bash
curl -X GET "http://localhost:3000/api/branches?brandId=123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### POST /branches

Create a new branch.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "name": "Downtown Branch",
  "slug": "downtown-branch",
  "brandId": "123e4567-e89b-12d3-a456-426614174000",
  "address": {
    "street": "456 Main St",
    "city": "Downtown",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  },
  "contact": {
    "phone": "+1-555-0456",
    "email": "downtown@acme.com"
  }
}
```

## 👥 Lead Management Endpoints

### GET /leads

List leads with filtering and pagination.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `branchId` (optional): Filter by branch
- `status` (optional): Filter by lead status (NEW, CONTACTED, QUALIFIED, CONVERTED, LOST)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page (max 100)

**Example:**
```bash
curl -X GET "http://localhost:3000/api/leads?branchId=123&status=NEW&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### POST /leads

Create a new lead.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "branchId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Customer",
  "email": "john@example.com",
  "phone": "+1-555-0789",
  "source": "QR_CODE",
  "notes": "Interested in premium services"
}
```

## 📊 Analytics Endpoints

### GET /analytics

Get analytics data for branches.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `branchId` (optional): Filter by specific branch
- `period` (optional): Time period (7d, 30d, 90d, 1y)
- `startDate` (optional): Start date for custom period (YYYY-MM-DD)
- `endDate` (optional): End date for custom period (YYYY-MM-DD)

**Response:**
```json
{
  "views": 1250,
  "leads": 45,
  "conversions": 12,
  "qrScans": 89,
  "period": "30d",
  "data": [
    {
      "date": "2024-01-01",
      "views": 42,
      "leads": 3
    },
    {
      "date": "2024-01-02",
      "views": 38,
      "leads": 2
    }
  ]
}
```

## 📱 QR Code Endpoints

### GET /qrcodes

List QR codes for a branch.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `branchId` (required): Branch ID to filter QR codes

### POST /qrcodes

Generate a new QR code.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "branchId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "MICROSITE",
  "customization": {
    "size": 300,
    "color": "#000000",
    "backgroundColor": "#FFFFFF"
  }
}
```

**Response:**
```json
{
  "id": "qr123e4567-e89b-12d3-a456-426614174000",
  "branchId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "MICROSITE",
  "url": "https://parichay.com/acme-corporation/main-office",
  "qrCodeUrl": "https://cdn.parichay.com/qr/qr123e4567.png",
  "scanCount": 0,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## 🏥 Health Check Endpoints

### GET /health

Check system health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "up",
    "redis": "up",
    "storage": "up"
  }
}
```

## 🔧 Error Handling

All API endpoints return consistent error responses:

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **429**: Rate Limited
- **500**: Internal Server Error
- **503**: Service Unavailable

### Common Error Examples

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**Authentication Error (401):**
```json
{
  "error": "Invalid credentials",
  "code": "UNAUTHORIZED"
}
```

**Rate Limit Error (429):**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## 🧪 Testing

### Automated Testing

Run the comprehensive API test suite:

```bash
# Test development environment
npm run test:api:dev

# Test production environment
npm run test:api:prod

# Test custom environment
API_BASE_URL=https://staging.parichay.com/api npm run test:api
```

### Manual Testing with cURL

**Login and get token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}' \
  | jq -r '.accessToken')
```

**Use token for authenticated requests:**
```bash
curl -X GET http://localhost:3000/api/brands \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Postman

1. Import the OpenAPI specification from `/api/docs`
2. Set up environment variables for base URL and token
3. Use the pre-request scripts to handle authentication

## 📖 Additional Resources

### Interactive Documentation

- **Swagger UI**: http://localhost:3000/api-doc
- **OpenAPI Spec**: http://localhost:3000/api/docs

### Code Examples

Check the `test-api-comprehensive.js` file for complete examples of:
- Authentication flow
- CRUD operations
- Error handling
- Rate limiting tests

### Support

- **Email**: support@parichay.com
- **Documentation**: https://docs.parichay.com
- **GitHub Issues**: https://github.com/parichay/api/issues

## 🔄 Changelog

### Version 1.0.0
- Initial API release
- Authentication with JWT
- Brand and branch management
- Lead capture and management
- QR code generation
- Analytics and reporting
- Comprehensive documentation
- Interactive testing interface

---

*Last updated: January 28, 2026*