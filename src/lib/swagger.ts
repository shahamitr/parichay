
// Comprehensive Swagger API Documentation for Parichay Platform

export const getApiDocs = () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Parichay API Documentation',
      version: '1.0.0',
      description: `
# Parichay Platform API

A comprehensive digital business card and microsite platform API that enables businesses to create, manage, and track their digital presence.

## Features
- **Authentication & Authorization**: JWT-based auth with MFA support
- **Brand & Branch Management**: Multi-brand, multi-branch support
- **Digital Business Cards**: QR code generation and vCard support
- **Microsite Builder**: Customizable microsites with templates
- **Lead Management**: CRM functionality with analytics
- **Payment Integration**: Stripe and Razorpay support
- **Analytics & Tracking**: Comprehensive analytics and insights
- **AI Content Generation**: AI-powered content creation
- **SMS & Email**: Notification and marketing capabilities

## Base URL
- **Development**: \`http://localhost:3000/api\`
- **Production**: \`https://your-domain.com/api\`

## Rate Limiting
- **Authenticated requests**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour
- **File uploads**: 50 requests per hour

## Error Handling
All API endpoints return consistent error responses:
\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

## Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **429**: Rate Limited
- **500**: Internal Server Error
      `,
      contact: {
        name: 'Parichay Support',
        email: 'support@parichay.com',
        url: 'https://parichay.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.parichay.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/login endpoint'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for webhook and public endpoints'
        }
      },
      schemas: {
        // User & Authentication Schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'BRAND_MANAGER', 'BRANCH_MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER']
            },
            br
: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            mfaToken: { type: 'string', description: 'Required if MFA is enabled' },
            backupCode: { type: 'string', description: 'Alternative to MFA token' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            requiresMFA: { type: 'boolean' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['BRAND_MANAGER', 'BUSINESS_OWNER'] }
          }
        },

        // Brand & Branch Schemas
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            logo: { type: 'string', nullable: true },
            tagline: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            website: { type: 'string', nullable: true },
            customDomain: { type: 'string', nullable: true },
            colorTheme: {
              type: 'object',
              properties: {
                primary: { type: 'string' },
                secondary: { type: 'string' },
                accent: { type: 'string' }
              }
            },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        BrandCreateRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            tagline: { type: 'string' },
            description: { type: 'string' },
            website: { type: 'string' },
            customDomain: { type: 'string' },
            colorTheme: {
              type: 'object',
              properties: {
                primary: { type: 'string' },
                secondary: { type: 'string' },
                accent: { type: 'string' }
              }
            },
            initialBranch: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                address: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string', format: 'email' }
              }
            }
          }
        },
        Branch: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            brandId: { type: 'string', format: 'uuid' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            contact: {
              type: 'object',
              properties: {
                phone: { type: 'string' },
                whatsapp: { type: 'string' },
                email: { type: 'string', format: 'email' }
              }
            },
            socialMedia: {
              type: 'object',
              properties: {
                facebook: { type: 'string' },
                instagram: { type: 'string' },
                linkedin: { type: 'string' },
                twitter: { type: 'string' }
              }
            },
            businessHours: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  open: { type: 'string' },
                  close: { type: 'string' },
                  closed: { type: 'boolean' }
                }
              }
            },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Lead Management Schemas
        Lead: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            branchId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            source: { type: 'string' },
            status: {
              type: 'string',
              enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']
            },
            notes: { type: 'string', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            customFields: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Analytics Schemas
        AnalyticsData: {
          type: 'object',
          properties: {
            views: { type: 'number' },
            leads: { type: 'number' },
            conversions: { type: 'number' },
            qrScans: { type: 'number' },
            period: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  views: { type: 'number' },
                  leads: { type: 'number' }
                }
              }
            }
          }
        },

        // Microsite Schemas
        Microsite: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            branchId: { type: 'string', format: 'uuid' },
            templateId: { type: 'string' },
            customDomain: { type: 'string', nullable: true },
            seoSettings: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                keywords: { type: 'array', items: { type: 'string' } }
              }
            },
            sections: { type: 'object' },
            isPublished: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // QR Code Schemas
        QRCode: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            branchId: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['MICROSITE', 'VCARD', 'CUSTOM'] },
            url: { type: 'string' },
            qrCodeUrl: { type: 'string' },
            customization: {
              type: 'object',
              properties: {
                size: { type: 'number' },
                color: { type: 'string' },
                backgroundColor: { type: 'string' },
                logo: { type: 'string' }
              }
            },
            scanCount: { type: 'number' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Subscription Schemas
        SubscriptionPlan: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            interval: { type: 'string', enum: ['MONTHLY', 'YEARLY'] },
            features: { type: 'array', items: { type: 'string' } },
            limits: {
              type: 'object',
              properties: {
                branches: { type: 'number' },
                qrCodes: { type: 'number' },
                leads: { type: 'number' },
                storage: { type: 'number' }
              }
            },
            isActive: { type: 'boolean' }
          }
        },

        // Error Schema
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
            details: { type: 'object' }
          }
        },

        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Authentication required',
                code: 'UNAUTHORIZED'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Insufficient permissions',
                code: 'FORBIDDEN'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Resource not found',
                code: 'NOT_FOUND'
              }
            }
          }
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: {
                  email: 'Invalid email format'
                }
              }
            }
          }
        },
        RateLimitError: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Rate limit exceeded',
                code: 'RATE_LIMIT_EXCEEDED'
              }
            }
          }
        }
      }
    },
    paths: {
      // Authentication Endpoints
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User login',
          description: 'Authenticate user with email and password. Returns JWT token and user information.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
                examples: {
                  basic: {
                    summary: 'Basic login',
                    value: {
                      email: 'user@example.com',
                      password: 'password123'
                    }
                  },
                  withMFA: {
                    summary: 'Login with MFA',
                    value: {
                      email: 'user@example.com',
                      password: 'password123',
                      mfaToken: '123456'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' },
                  example: {
                    success: true,
                    user: {
                      id: '123e4567-e89b-12d3-a456-426614174000',
                      email: 'user@example.com',
                      firstName: 'John',
                      lastName: 'Doe',
                      role: 'BRAND_MANAGER'
                    },
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '403': {
              description: 'MFA required',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      requiresMFA: { type: 'boolean' },
                      message: { type: 'string' },
                      userId: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'User registration',
          description: 'Register a new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
                example: {
                  email: 'newuser@example.com',
                  password: 'securepassword123',
                  firstName: 'Jane',
                  lastName: 'Smith',
                  role: 'BUSINESS_OWNER'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '409': {
              description: 'Email already exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current user',
          description: 'Get current authenticated user information',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'User information',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },

      // Brand Management Endpoints
      '/brands': {
        get: {
          tags: ['Brand Management'],
          summary: 'List brands',
          description: 'Get list of brands (all for Super Admin, user\'s brand for others)',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of brands',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      brands: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Brand' }
                      }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        },
        post: {
          tags: ['Brand Management'],
          summary: 'Create brand',
          description: 'Create a new brand (Super Admin or Brand Manager only)',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BrandCreateRequest' },
                example: {
                  name: 'Acme Corporation',
                  tagline: 'Innovation at its best',
                  description: 'Leading technology company',
                  website: 'https://acme.com',
                  colorTheme: {
                    primary: '#3B82F6',
                    secondary: '#1E40AF',
                    accent: '#F59E0B'
                  },
                  initialBranch: {
                    name: 'Main Office',
                    address: '123 Business St, City, State 12345',
                    phone: '+1-555-0123',
                    email: 'contact@acme.com'
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Brand created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      brand: { $ref: '#/components/schemas/Brand' }
                    }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '403': { $ref: '#/components/responses/ForbiddenError' }
          }
        }
      },

      // Branch Management Endpoints
      '/branches': {
        get: {
          tags: ['Branch Management'],
          summary: 'List branches',
          description: 'Get list of branches for a brand',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'brandId',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Brand ID to filter branches'
            }
          ],
          responses: {
            '200': {
              description: 'List of branches',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Branch' }
                  }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        },
        post: {
          tags: ['Branch Management'],
          summary: 'Create branch',
          description: 'Create a new branch for a brand',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'slug', 'brandId', 'address', 'contact'],
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    brandId: { type: 'string', format: 'uuid' },
                    address: {
                      type: 'object',
                      properties: {
                        street: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zipCode: { type: 'string' },
                        country: { type: 'string' }
                      }
                    },
                    contact: {
                      type: 'object',
                      properties: {
                        phone: { type: 'string' },
                        whatsapp: { type: 'string' },
                        email: { type: 'string', format: 'email' }
                      }
                    }
                  }
                },
                example: {
                  name: 'Downtown Branch',
                  slug: 'downtown-branch',
                  brandId: '123e4567-e89b-12d3-a456-426614174000',
                  address: {
                    street: '456 Main St',
                    city: 'Downtown',
                    state: 'CA',
                    zipCode: '90210',
                    country: 'USA'
                  },
                  contact: {
                    phone: '+1-555-0456',
                    email: 'downtown@acme.com'
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Branch created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Branch' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' },
            '403': { $ref: '#/components/responses/ForbiddenError' },
            '409': {
              description: 'Branch slug already exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },

      // Analytics Endpoints
      '/analytics': {
        get: {
          tags: ['Analytics'],
          summary: 'Get analytics data',
          description: 'Get analytics data for branches with filtering options',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'branchId',
              in: 'query',
              schema: { type: 'string', format: 'uuid' },
              description: 'Filter by specific branch'
            },
            {
              name: 'period',
              in: 'query',
              schema: { type: 'string', enum: ['7d', '30d', '90d', '1y'] },
              description: 'Time period for analytics'
            },
            {
              name: 'startDate',
              in: 'query',
              schema: { type: 'string', format: 'date' },
              description: 'Start date for custom period'
            },
            {
              name: 'endDate',
              in: 'query',
              schema: { type: 'string', format: 'date' },
              description: 'End date for custom period'
            }
          ],
          responses: {
            '200': {
              description: 'Analytics data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AnalyticsData' },
                  example: {
                    views: 1250,
                    leads: 45,
                    conversions: 12,
                    qrScans: 89,
                    period: '30d',
                    data: [
                      { date: '2024-01-01', views: 42, leads: 3 },
                      { date: '2024-01-02', views: 38, leads: 2 }
                    ]
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },

      // QR Code Endpoints
      '/qrcodes': {
        get: {
          tags: ['QR Codes'],
          summary: 'List QR codes',
          description: 'Get list of QR codes for a branch',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'branchId',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Branch ID to filter QR codes'
            }
          ],
          responses: {
            '200': {
              description: 'List of QR codes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/QRCode' }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        },
        post: {
          tags: ['QR Codes'],
          summary: 'Generate QR code',
          description: 'Generate a new QR code for a branch',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['branchId', 'type'],
                  properties: {
                    branchId: { type: 'string', format: 'uuid' },
                    type: { type: 'string', enum: ['MICROSITE', 'VCARD', 'CUSTOM'] },
                    customUrl: { type: 'string', description: 'Required for CUSTOM type' },
                    customization: {
                      type: 'object',
                      properties: {
                        size: { type: 'number', minimum: 100, maximum: 1000 },
                        color: { type: 'string' },
                        backgroundColor: { type: 'string' },
                        logo: { type: 'string' }
                      }
                    }
                  }
                },
                example: {
                  branchId: '123e4567-e89b-12d3-a456-426614174000',
                  type: 'MICROSITE',
                  customization: {
                    size: 300,
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'QR code generated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/QRCode' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },

      // Lead Management Endpoints
      '/leads': {
        get: {
          tags: ['Lead Management'],
          summary: 'List leads',
          description: 'Get list of leads with filtering and pagination',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'branchId',
              in: 'query',
              schema: { type: 'string', format: 'uuid' },
              description: 'Filter by branch'
            },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] },
              description: 'Filter by lead status'
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', minimum: 1 },
              description: 'Page number for pagination'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 100 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            '200': {
              description: 'List of leads',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      leads: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Lead' }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        },
        post: {
          tags: ['Lead Management'],
          summary: 'Create lead',
          description: 'Create a new lead',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['branchId', 'name'],
                  properties: {
                    branchId: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    source: { type: 'string' },
                    notes: { type: 'string' },
                    customFields: { type: 'object' }
                  }
                },
                example: {
                  branchId: '123e4567-e89b-12d3-a456-426614174000',
                  name: 'John Customer',
                  email: 'john@example.com',
                  phone: '+1-555-0789',
                  source: 'QR_CODE',
                  notes: 'Interested in premium services'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Lead created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Lead' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/UnauthorizedError' }
          }
        }
      },

      // Health Check Endpoints
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          description: 'Check system health status',
          responses: {
            '200': {
              description: 'System is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
                      timestamp: { type: 'string', format: 'date-time' },
                      services: {
                        type: 'object',
                        properties: {
                          database: { type: 'string', enum: ['up', 'down'] },
                          redis: { type: 'string', enum: ['up', 'down'] },
                          storage: { type: 'string', enum: ['up', 'down'] }
                        }
                      }
                    }
                  },
                  example: {
                    status: 'healthy',
                    timestamp: '2024-01-15T10:30:00Z',
                    services: {
                      database: 'up',
                      redis: 'up',
                      storage: 'up'
                    }
                  }
                }
              }
            },
            '503': {
              description: 'System is unhealthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      errors: { type: 'array', items: { type: 'string' } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Brand Management',
        description: 'Brand creation and management endpoints'
      },
      {
        name: 'Branch Management',
        description: 'Branch creation and management endpoints'
      },
      {
        name: 'Lead Management',
        description: 'Lead capture and CRM endpoints'
      },
      {
        name: 'Analytics',
        description: 'Analytics and reporting endpoints'
      },
      {
        name: 'QR Codes',
        description: 'QR code generation and management endpoints'
      },
      {
        name: 'System',
        description: 'System health and utility endpoints'
      }
    ]
  };
};