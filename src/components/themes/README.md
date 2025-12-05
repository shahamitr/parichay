# Brand Customization System

A comprehensive system for customizing microsite appearance including theme colors, typography, hero section, and brand assets.

## Components

### BrandCustomizationPanel

Main panel that integrates all customization features with tabs and live preview.

```tsx
import { BrandCustomizationPanel } from '@/components/themes';

<BrandCustomizationPanel
  brandId="brand-123"
  onSave={(customization) => {
    console.log('Saved:', customization);
  }}
/>
```

### ThemeEditor

Customize theme colors, typography, and dark mode.

```tsx
import { ThemeEditor } from '@/components/themes';

<ThemeEditor
  initialTheme={theme}
  onSave={(theme) => {
    // Save theme
  }}
  showPreview={true}
/>
```

### HeroCustomizer

Customize hero section background, title, subtitle, and CTA.

```tsx
import { HeroCustomizer } from '@/components/themes';

<HeroCustomizer
  initialHero={hero}
  onSave={(hero) => {
    // Save hero settings
  }}
/>
```

### BrandAssetsCustomizer

Upload and manage favicon and logo.

```tsx
import { BrandAssetsCustomizer } from '@/components/themes';

<BrandAssetsCustomizer
  initialAssets={assets}
  onSave={(assets) => {
    // Save brand assets
  }}
/>
```

## Data Types

### ThemeConfig

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
  };
  darkMode: boolean;
  customCSS?: string;
}
```

### HeroCustomization

```typescript
interface HeroCustomization {
  backgroundType: 'image' | 'video' | 'gradient';
  backgroundUrl?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}
```

### BrandAssets

```typescript
interface BrandAssets {
  favicon?: string;
  logo?: string;
}
```

### BrandCustomization

```typescript
interface BrandCustomization {
  theme: ThemeConfig;
  hero: HeroCustomization;
  assets: BrandAssets;
}
```

## Storage Utilities

### Save Customization

```typescript
import { saveBrandCustomization } from '@/lib/theme-storage';

saveBrandCustomization(brandId, customization);
```

### Load Customization

```typescript
import { loadBrandCustomization } from '@/lib/theme-storage';

const customization = loadBrandCustomization(brandId);
```

### Apply Theme to Document

```typescript
import { applyThemeToDocument } from '@/lib/theme-storage';

applyThemeToDocument(theme);
```

### Validate Theme

```typescript
import { validateThemeConfig } from '@/lib/theme-storage';

const validated = validateThemeConfig(theme);
if (!validated.isValid) {
  console.error(validated.errors);
}
```

## API Endpoints

### GET /api/customization

Load brand customization from server.

```typescript
const response = await fetch(`/api/customization?brandId=${brandId}`);
const data = await response.json();
```

### POST /api/customization

Save brand customization to server.

```typescript
const response = await fetch('/api/customization', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brandId, customization }),
});
```

## Image Utilities

### Validate Image

```typescript
import { validateImageFile } from '@/lib/image-utils';

const validation = await validateImageFile(file, {
  maxSizeMB: 5,
  allowedTypes: ['image/png', 'image/jpeg'],
  minWidth: 100,
  minHeight: 100,
});
```

### Compress Image

```typescript
import { compressImage } from '@/lib/image-utils';

const compressed = await compressImage(file, {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
});
```

### Validate Favicon

```typescript
import { validateFavicon } from '@/lib/image-utils';

const validation = await validateFavicon(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

## Font Options

Available fonts are defined in `@/data/fonts`:

```typescript
import { fontOptions, getFontByFamily } from '@/data/fonts';

// Get all fonts
const fonts = fontOptions;

// Get specific font
const font = getFontByFamily('Inter, system-ui, sans-serif');
```

## Database Schema

The customization data is stored in the `Brand` model:

```prisma
model Brand {
  // ... other fields
  customization Json? // BrandCustomization structure
}
```

## Usage Example

```tsx
'use client';

import { useState } from 'react';
import { BrandCustomizationPanel } from '@/components/themes';

export default function CustomizationPage() {
  const brandId = 'brand-123';

  const handleSave = async (customization) => {
    console.log('Customization saved:', customization);
    // Show success message
  };

  return (
    <div className="container mx-auto py-8">
      <BrandCustomizationPanel
        brandId={brandId}
        onSave={handleSave}
      />
    </div>
  );
}
```

## Features

- ✅ Color customization with live preview
- ✅ Typography selection from Google Fonts
- ✅ Dark mode toggle
- ✅ Hero section customization (background, text, CTA)
- ✅ Image/video background support
- ✅ Favicon and logo upload with validation
- ✅ Image compression and optimization
- ✅ Local storage caching
- ✅ Server-side persistence
- ✅ Live preview for all changes
- ✅ Validation and error handling
- ✅ Responsive design

## Requirements Covered

This implementation satisfies the following requirements from the spec:

- **6.1**: Theme color configuration (primary, secondary, accent)
- **6.2**: Custom typography selection
- **6.3**: Hero section customization (background, title, subtitle)
- **6.4**: CTA button customization (text, link)
- **6.5**: Favicon and logo upload
