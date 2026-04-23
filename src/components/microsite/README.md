# Microsite Dashboard Editor

A comprehensive, role-based dashboard UI for managing microsite content with dynamic field management.

## 🎯 Features

### ✅ Implemented
- **Dynamic Field Arrays** - Add/remove multiple items (phones, emails, videos, etc.)
- **Image Upload with Gallery** - Drag-and-drop, reorder, preview
- **Tab-based Navigation** - Easy section switching
- **Role-based Access Control** - Admin, Executive, Branch Admin permissions
- **Auto-save Draft** - Saves to localStorage
- **Real-time Preview** - See changes before publishing
- **Responsive Design** - Works on all devices

### 🚧 To Be Implemented
- Hero Section Editor
- About Section Editor (Rich Text)
- Services/Products Editor
- Impact/Metrics Editor
- Testimonials Editor
- Trust Indicators Editor
- CTA Editor
- Contact Form Editor
- Payment Methods Editor
- SEO Settings Editor

## 📁 File Structure

```
src/components/dashboard/microsite/
├── MicrositeEditor.tsx              # Main editor component
├── MicrositeEditorTabs.tsx          # Tab navigation
├── DynamicFieldArray.tsx            # Reusable dynamic fields
├── ImageUploadArray.tsx             # Image upload & management
├── README.md                        # This file
└── sections/
    ├── ProfileEditor.tsx            # ✅ Profile & contact info
    ├── HeroEditor.tsx               # 🚧 Hero section
    ├── AboutEditor.tsx              # 🚧 About section
    ├── ServicesEditor.tsx           # 🚧 Services/products
    ├── ImpactEditor.tsx             # 🚧 Metrics/stats
    ├── TestimonialsEditor.tsx       # 🚧 Customer reviews
    ├── GalleryEditor.tsx            # ✅ Image gallery
    ├── TrustIndicatorsEditor.tsx    # 🚧 Certifications
    ├── VideosEditor.tsx             # ✅ Video links
    ├── CTAEditor.tsx                # 🚧 Call-to-action
    ├── ContactEditor.tsx            # 🚧 Contact forms
    ├── PaymentEditor.tsx            # 🚧 Payment methods
    └── SEOEditor.tsx                # 🚧 SEO settings
```

## 🚀 Usage

### Basic Implementation

```tsx
import MicrositeEditor from '@/components/dashboard/microsite/MicrositeEditor';

export default function EditMicrositePage() {
  return (
    <MicrositeEditor
      branchId="branch-123"
      brandId="brand-456"
      initialConfig={micrositeConfig}
      userRole="ADMIN"
    />
  );
}
```

### Role-based Permissions

```typescript
// Admin - Full access
userRole="ADMIN"
- Can edit branding (logo, name, tagline)
- Can edit all sections
- Can access advanced settings

// Executive - Limited access
userRole="EXECUTIVE"
- Cannot edit branding
- Can edit content sections
- Can access some advanced settings

// Branch Admin - Basic access
userRole="BRANCH_ADMIN"
- Cannot edit branding
- Can edit basic content
- No advanced settings access
```

## 🎨 Components

### 1. DynamicFieldArray

Allows adding/removing multiple values dynamically.

**Features:**
- Add/remove items
- Drag-and-drop reordering
- Type validation (text, url, tel, email)
- Maximum items limit
- Help text support

**Usage:**
```tsx
<DynamicFieldArray
  label="Phone Numbers"
  values={phones}
  onChange={setPhones}
  type="tel"
  placeholder="Enter phone number"
  maxItems={5}
  helpText="Add multiple phone numbers"
/>
```

**Use Cases:**
- Multiple phone numbers
- Multiple email addresses
- WhatsApp numbers
- Video URLs
- Social media links
- Any array of strings

### 2. ImageUploadArray

Upload and manage multiple images with preview.

**Features:**
- Drag-and-drop upload
- Image compression
- Reorder images
- Delete images
- Preview thumbnails
- Progress indicator

**Usage:**
```tsx
<ImageUploadArray
  label="Gallery Images"
  images={images}
  onChange={setImages}
  maxImages={50}
  helpText="Upload high-quality images"
/>
```

**Use Cases:**
- Gallery images
- Product photos
- Team photos
- Certification logos
- Partner logos

### 3. MicrositeEditorTabs

Tab navigation for different sections.

**Features:**
- Icon-based tabs
- Active state
- Disabled state for optional sections
- Badge support
- Responsive scrolling

**Usage:**
```tsx
<MicrositeEditorTabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
  enabledSections={enabledSections}
/>
```

## 📝 Dynamic Fields Implemented

### Profile Section
- ✅ Multiple phone numbers
- ✅ Multiple email addresses
- ✅ Multiple WhatsApp numbers
- ✅ Facebook page URL
- ✅ Instagram profile URL
- ✅ LinkedIn page URL
- ✅ Twitter/X profile URL
- ✅ YouTube channel URL
- ✅ Google Reviews URL

### Gallery Section
- ✅ Multiple images (up to 50)
- ✅ Drag-and-drop upload
- ✅ Reorder images
- ✅ Delete images

### Videos Section
- ✅ Multiple video URLs (up to 20)
- ✅ YouTube support
- ✅ Vimeo support
- ✅ Direct upload support

## 🔧 API Integration

### Save Configuration

```typescript
PUT /api/branches/{branchId}/config
Content-Type: application/json

{
  "micrositeConfig": {
    "sections": {
      "profile": { ... },
      "hero": { ... },
      // ... other sections
    },
    "seoSettings": { ... }
  }
}
```

### Upload Files

```typescript
POST /api/upload
Content-Type: multipart/form-data

{
  "file": File,
  "type": "logo" | "gallery" | "video" | "document"
}

Response:
{
  "url": "https://cdn.example.com/uploads/file.jpg"
}
```

## 🎯 Implementation Roadmap

### Phase 1: Core Editors (Priority)
1. **Hero Editor**
   - Title/subtitle inputs
   - Background image/video upload
   - Background type selector (image/video/gradient)
   - Animation toggle

2. **About Editor**
   - Rich text editor (TinyMCE or similar)
   - Character count
   - Preview mode

3. **Services Editor**
   - Dynamic service items
   - Name, description, price
   - Image upload per service
   - Features list
   - Category selector
   - Availability status

### Phase 2: Enhanced Sections
4. **Impact/Metrics Editor**
   - Dynamic metric items
   - Value, label, icon
   - Icon picker

5. **Testimonials Editor**
   - Dynamic testimonial items
   - Name, role, photo, content
   - Star rating selector

6. **Contact Editor**
   - Lead form field selector
   - Map toggle
   - Appointment booking config
   - Live chat integration

### Phase 3: Advanced Features
7. **Payment Editor**
   - UPI ID input
   - QR code upload
   - Bank details form
   - Payment methods checkboxes

8. **Trust Indicators Editor**
   - Certifications list
   - Partners list
   - Logo uploads

9. **CTA Editor**
   - Title/subtitle
   - Button text/link
   - Background options

10. **SEO Editor**
    - Meta title/description
    - Keywords (dynamic array)
    - OG image upload
    - Structured data

## 💡 Best Practices

### 1. Data Validation
```typescript
// Validate before saving
const validateConfig = (config: MicrositeConfig) => {
  // Check required fields
  if (!config.sections.hero.title) {
    throw new Error('Hero title is required');
  }

  // Validate URLs
  config.sections.videos.videos.forEach(url => {
    if (!isValidUrl(url)) {
      throw new Error(`Invalid video URL: ${url}`);
    }
  });
};
```

### 2. Image Optimization
```typescript
// Compress before upload
import { compressImageWithPreset } from '@/lib/image-utils';

const compressed = await compressImageWithPreset(file, 'standard');
```

### 3. Auto-save
```typescript
// Save draft to localStorage
useEffect(() => {
  if (hasChanges) {
    localStorage.setItem(`microsite-draft-${branchId}`, JSON.stringify(config));
  }
}, [config]);

// Restore draft on load
useEffect(() => {
  const draft = localStorage.getItem(`microsite-draft-${branchId}`);
  if (draft) {
    const shouldRestore = confirm('Restore unsaved changes?');
    if (shouldRestore) {
      setConfig(JSON.parse(draft));
    }
  }
}, []);
```

### 4. Error Handling
```typescript
try {
  await handleSave();
} catch (error) {
  // Show user-friendly error
  setSaveError(error.message);

  // Log for debugging
  console.error('Save error:', error);

  // Track error
  trackError('microsite_save_failed', { error, branchId });
}
```

## 🧪 Testing

### Unit Tests
```typescript
// Test dynamic field array
describe('DynamicFieldArray', () => {
  it('should add new field', () => {
    // Test implementation
  });

  it('should remove field', () => {
    // Test implementation
  });

  it('should reorder fields', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Test full editor flow
describe('MicrositeEditor', () => {
  it('should save configuration', async () => {
    // Test implementation
  });

  it('should handle upload errors', async () => {
    // Test implementation
  });
});
```

## 📱 Responsive Design

All components are fully responsive:
- Mobile: Single column, stacked layout
- Tablet: Two columns where appropriate
- Desktop: Full layout with sidebar

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels
- Focus management
- Screen reader friendly
- Color contrast compliance

## 🔐 Security

- File type validation
- File size limits
- URL validation
- XSS prevention
- CSRF protection

## 📊 Analytics

Track user interactions:
```typescript
// Track section edits
trackEvent('microsite_section_edited', {
  section: 'hero',
  branchId,
  userRole,
});

// Track saves
trackEvent('microsite_saved', {
  branchId,
  sectionsModified: ['hero', 'about'],
});
```

## 🐛 Known Issues

1. **Image Upload** - Large files may timeout (implement chunked upload)
2. **Rich Text Editor** - Not yet implemented for About section
3. **Drag-and-Drop** - May not work on touch devices (add touch support)

## 🚀 Future Enhancements

1. **Template System** - Pre-built section templates
2. **Version History** - Undo/redo functionality
3. **Collaboration** - Real-time multi-user editing
4. **AI Assistance** - Content suggestions
5. **A/B Testing** - Test different configurations
6. **Analytics Integration** - Section performance metrics

## 📞 Support

For questions or issues:
- Check the main documentation: `MICROSITE_DATA_MAPPING.md`
- Review section examples: `MICROSITE_SECTIONS_SUMMARY.md`
- Contact the development team

---

**Status**: 🚧 In Development
**Last Updated**: November 2025
**Version**: 1.0.0
