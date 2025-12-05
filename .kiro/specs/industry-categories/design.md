# Industry Categories Feature - Design

## Overview

This feature implements a comprehensive industry-specific experience the OneTouch BizCard platform, from landing page to microsite creation.

## Architecture

### Data Model

```typescript
interface IndustryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  enabled: boolean;
  features: string[];
  benefits: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface MicrositeTemplate {
  id: string;
  name: string;
  categoryId: string;
  preview: string;
  sections: TemplateSection[];
  theme: ThemeConfig;
}

interface ThemeConfig {
  colors: ColorScheme;
  fonts: FontConfig;
  layout: LayoutConfig;
}
```

## Components

### 1. Landing Page Sections

**Component**: `IndustryCategoriesSection.tsx`
- Grid layout with 6 category cards
- Each card shows icon, title, description, features
- CTA button for each category
- Responsive design (3 cols desktop, 2 cols tablet, 1 col mobile)

### 2. Category Selection (Registration)

**Component**: `CategorySelector.tsx`
- Step in registration flow
- Visual cards for each category
- Single selection
- Skip option available
- Stores selection in user profile

### 3. Template Gallery

**Component**: `TemplateGallery.tsx`
- Filtered by category
- Preview thumbnails
- Template details modal
- Apply template action

### 4. Theme Selector

**Component**: `ThemeSelector.tsx`
- Visual theme previews
- Color scheme display
- Apply theme action
- Live preview

### 5. System Settings

**Component**: `IndustryCategoriesSettings.tsx`
- Enable/disable categories
- Edit category details
- Manage templates
- Configure themes

## Data Structure

### Industry Categories Data

```json
{
  "categories": [
    {
      "id": "business-owners",
      "name": "Business Owners",
      "slug": "business-owners",
      "description": "Perfect for entrepreneurs and business owners",
      "icon": "briefcase",
      "features": [
        "Business profile showcase",
        "Product/service catalog",
        "Customer testimonials",
        "Contact forms"
      ],
      "benefits": [
        "Professional online presence",
        "24/7 business card availability",
        "Easy client communication"
      ],
      "colorScheme": {
        "primary": "#1E40AF",
        "secondary": "#3B82F6",
        "accent": "#60A5FA"
      }
    }
  ]
}
```

## User Flows

### Registration Flow
1. User lands on registration page
2. Enters basic info (email, password, name)
3. Selects industry category (optional)
4. System recommends templates based on category
5. User completes registration

### Template Selection Flow
1. User navigates to create microsite
2. System shows templates filtered by user's category
3. User can browse all categories
4. User previews template
5. User applies template
6. System creates microsite with template

## API Endpoints

### GET /api/categories
- Returns all enabled categories
- Public endpoint

### GET /api/templates?category={id}
- Returns templates for category
- Authenticated

### POST /api/users/category
- Updates user's category
- Authenticated

### GET /api/system/categories
- Admin: Get all categories
- Super Admin only

### PUT /api/system/categories/{id}
- Admin: Update category
- Super Admin only

## File Structure

```
src/
├── components/
│   ├── landing/
│   │   └── IndustryCategoriesSection.tsx
│   ├── onboarding/
│   │   └── CategorySelector.tsx
│   ├── templates/
│   │   ├── TemplateGallery.tsx
│   │   └── TemplateCard.tsx
│   └── themes/
│       └── ThemeSelector.tsx
├── data/
│   ├── categories.ts
│   ├── templates.ts
│   └── themes.ts
└── app/
    ├── api/
    │   ├── categories/
    │   ├── templates/
    │   └── system/categories/
    └── register/
        └── page.tsx
```

## Styling Approach

- Tailwind CSS for all components
- Industry-specific color schemes
- Consistent spacing and typography
- Responsive breakpoints
- Dark mode support (future)

## Testing Strategy

- Unit tests for data transformations
- Component tests for UI elements
- Integration tests for API endpoints
- E2E tests for registration flow
- Visual regression tests for themes
