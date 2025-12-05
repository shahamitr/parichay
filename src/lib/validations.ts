import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  brandName: z.string().min(1, 'Brand name is required').optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Logo validation - accepts URLs, relative paths, data URLs, empty, null, or undefined
const logoSchema = z
  .union([
    z.string().url(), // Full URLs (https://...)
    z.string().startsWith('/'), // Relative paths (/uploads/...)
    z.string().startsWith('data:'), // Data URLs (data:image/...)
    z.literal(''),
  ])
  .nullable()
  .optional()
  .transform((val) => val || undefined); // Convert null/empty to undefined

// Brand validation schemas
export const brandCreateSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(100, 'Brand name too long'),
  tagline: z.string().max(200, 'Tagline too long').optional().or(z.literal('')),
  logo: logoSchema,
  customDomain: z.string().optional().or(z.literal('')), // Allow empty string or domain name
  colorTheme: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid primary color'),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid secondary color'),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid accent color'),
  }).optional(),
  initialBranch: z.object({
    name: z.string().min(1, 'Branch name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    address: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'ZIP code is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }).optional(),
});

export const brandUpdateSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(100, 'Brand name too long').optional(),
  tagline: z.string().max(200, 'Tagline too long').optional().or(z.literal('')),
  logo: logoSchema,
  customDomain: z.string().optional().or(z.literal('')), // Allow empty string or domain name
  colorTheme: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid primary color'),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid secondary color'),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid accent color'),
  }).optional(),
  sslEnabled: z.boolean().optional(),
});

// Branch validation schemas
export const branchCreateSchema = z.object({
  name: z.string().min(1, 'Branch name is required').max(100, 'Branch name too long'),
  slug: z.string().min(1, 'Slug is required'),
  brandId: z.string().min(1, 'Brand ID is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  contact: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    whatsapp: z.string().optional(),
    email: z.string().email('Invalid email address'),
  }),
  socialMedia: z.object({
    facebook: z.string().url('Invalid Facebook URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional(),
  }).optional(),
  businessHours: z.record(z.string(), z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })).optional(),
});

export const branchUpdateSchema = z.object({
  name: z.string().min(1, 'Branch name is required').max(100, 'Branch name too long').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }).optional(),
  contact: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    whatsapp: z.string().optional(),
    email: z.string().email('Invalid email address'),
  }).optional(),
  socialMedia: z.object({
    facebook: z.string().url('Invalid Facebook URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional(),
  }).optional(),
  businessHours: z.record(z.string(), z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })).optional(),
  micrositeConfig: z.any().optional(), // Will be validated separately
  isActive: z.boolean().optional(),
});

// Microsite configuration validation
export const micrositeConfigSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  sections: z.object({
    hero: z.object({
      enabled: z.boolean(),
      title: z.string(),
      subtitle: z.string(),
      backgroundImage: z.string().url().optional(),
    }),
    about: z.object({
      enabled: z.boolean(),
      content: z.string(),
    }),
    services: z.object({
      enabled: z.boolean(),
      items: z.array(z.object({
        name: z.string(),
        description: z.string(),
        image: z.string().url().optional(),
        price: z.number().optional(),
      })),
    }),
    gallery: z.object({
      enabled: z.boolean(),
      images: z.array(z.string().url()),
    }),
    contact: z.object({
      enabled: z.boolean(),
      showMap: z.boolean(),
      leadForm: z.object({
        enabled: z.boolean(),
        fields: z.array(z.string()),
      }),
    }),
  }),
  seoSettings: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    ogImage: z.string().url().optional(),
  }),
});

// Type exports
export type BrandCreateInput = z.infer<typeof brandCreateSchema>;
export type BrandUpdateInput = z.infer<typeof brandUpdateSchema>;
export type BranchCreateInput = z.infer<typeof branchCreateSchema>;
export type BranchUpdateInput = z.infer<typeof branchUpdateSchema>;
export type MicrositeConfigInput = z.infer<typeof micrositeConfigSchema>;