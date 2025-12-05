# Advanced Microsite Features - Architecture

## Component Hierarchy

```
MicrositePage
│
├── HeroSection (Enhanced)
│   ├── Video Background Support
│├── <video> element with autoplay/loop/mute
│   │   ├── Multiple format support (MP4, WebM)
│   │   └── Gradient overlay for text contrast
│   │
│   └── Built-in Animations
│       ├── Fade-in title
│       ├── Fade-in subtitle (delayed)
│       └── Fade-in CTA buttons (delayed)
│
├── AboutSection
│   └── Can be wrapped with AnimatedSection
│
├── ServicesSection
│   └── InteractiveProductCatalog (Enhanced)
│       ├── Search Bar
│       │   └── Real-time filtering
│       │
│       ├── Category Filter
│       │   ├── Dynamic category buttons
│       │   └── Smooth transitions
│       │
│       ├── Sort Dropdown
│       │   ├── Sort by name
│       │   ├── Sort by price (low to high)
│       │   └── Sort by price (high to low)
│       │
│       ├── View Mode Toggle
│       │   ├── Grid view
│       │   └── List view
│       │
│       ├── Product Cards
│       │   ├── Staggered fade-in animations
│       │   ├── Hover scale effects
│       │   ├── Availability badges
│       │   └── Click to open modal
│       │
│       └── Product Detail Modal
│           ├── Full product information
│           ├── Feature list
│           ├── Inquire button (WhatsApp)
│           └── Smooth animations
│
├── GallerySection
│   └── Can be wrapped with AnimatedSection
│
├── VideosSection
│   └── Can be wrapped with AnimatedSection
│
└── ContactSection (Enhanced)
    ├── Contact Information
    │   ├── Quick action buttons
    │   └── Business hours
    │
    ├── AppointmentBooking (New)
    │   ├── Date Picker (next 14 days)
    │   ├── Time Slot Selection (day-specific)
    │   ├── Contact Form
    │   │   ├── Name (required)
    │   │   ├── Phone (required)
    │   │   ├── Email (optional)
    │   │   └── Notes (optional)
    │   │
    │   ├── WhatsApp Integration
    │   │   └── Sends formatted appointment request
    │   │
    │   └── Analytics Tracking
    │
    ├── Lead Form
    │   ├── Configurable fields
    │   ├── Validation
    │   └── Success/Error states
    │
    ├── Google Maps
    │   └── Embedded map iframe
    │
    └── LiveChatWidget (New)
        ├── Provider Support
        │   ├── Tawk.to
        │   ├── Intercom
        │   ├── Crisp
        │   └── Custom script
        │
        ├── Async Loading
        │   └── No performance impact
        │
        └── Auto Cleanup
            └── Removes scripts on unmount
```

## Data Flow

### 1. Video Background Flow
```
MicrositeConfig (JSON)
    ↓
HeroSection Component
    ↓
Check backgroundType === 'video'
    ↓
Load <video> element
    ↓
Apply filters & overlays
    ↓
Render content on top
```

### 2. Animation Flow
```
Component Mount
    ↓
AnimatedSection wrapper
    ↓
Intersection Observer setup
    ↓
Wait for element to enter viewport
    ↓
Apply animation class with delay
    ↓
CSS transition executes
    ↓
Animation complete
```

### 3. Product Catalog Flow
```
User Input (Search/Filter/Sort)
    ↓
Update State
    ↓
Filter items by category
    ↓
Filter items by search query
    ↓
Sort items by selected criteria
    ↓
Render with staggered animations
    ↓
User clicks product
    ↓
Open modal with product details
    ↓
User clicks "Inquire"
    ↓
Open WhatsApp with pre-filled message
```

### 4. Appointment Booking Flow
```
User opens appointment form
    ↓
Select date (next 14 days)
    ↓
Load available slots for selected day
    ↓
Select time slot
    ↓
Fill contact information
    ↓
Submit form
    ↓
Validate all fields
    ↓
Format appointment message
    ↓
Open WhatsApp with message
    ↓
Track analytics event
    ↓
Show success message
```

### 5. Live Chat Flow
```
ContactSection mounts
    ↓
Check liveChatEnabled === true
    ↓
LiveChatWidget component loads
    ↓
Identify provider (tawk/intercom/crisp/custom)
    ↓
Create script element
    ↓
Set script src based on provider
    ↓
Append to document.body
    ↓
Widget loads asynchronously
    ↓
User interacts with chat
    ↓
Component unmounts
    ↓
Cleanup: Remove scripts & widgets
```

## State Management

### InteractiveProductCatalog State
```typescript
{
  selectedCategory: string,      // Current category filter
  viewMode: 'grid' | 'list',     // Display mode
  selectedProduct: ServiceItem | null,  // Modal product
  searchQuery: string,           // Search input
  sortBy: 'name' | 'price-low' | 'price-high'  // Sort criteria
}
```

### AppointmentBooking State
```typescript
{
  selectedDate: string,          // ISO date string
  selectedTime: string,          // Time slot
  formData: {
    name: string,
    phone: string,
    email: string,
    notes: string
  },
  isSubmitting: boolean,
  submitStatus: 'idle' | 'success' | 'error'
}
```

### AnimatedSection State
```typescript
{
  isVisible: boolean             // Triggered by Intersection Observer
}
```

## Configuration Schema

### Complete Advanced Features Config
```typescript
interface MicrositeConfig {
  sections: {
    hero: {
      enabled: boolean;
      title: string;
      subtitle: string;
      backgroundType: 'image' | 'video' | 'gradient';
      backgroundImage?: string;
      backgroundVideo?: string;
      animationEnabled: boolean;
    };
    services: {
      enabled: boolean;
      items: Array<{
        id: string;
        name: string;
        description: string;
        image?: string;
        price?: number;
        category?: string;
        availability: 'available' | 'limited' | 'out_of_stock';
        features?: string[];
      }>;
    };
    contact: {
      enabled: boolean;
      showMap: boolean;
      leadForm: {
        enabled: boolean;
        fields: string[];
      };
      appointmentBooking: {
        enabled: boolean;
        provider: 'calendly' | 'custom';
        availableSlots: Array<{
          day: string;
          slots: string[];
        }>;
      };
      liveChatEnabled: boolean;
      liveChatProvider: 'tawk' | 'intercom' | 'crisp' | 'custom';
      liveChatConfig: {
        widgetId?: string;
        customScript?: string;
      };
    };
  };
}
```

## Performance Optimization

### 1. Video Background
- Lazy loading consideration
- Compressed video files (< 5MB)
- Poster image for initial load
- Brightness filter via CSS (GPU accelerated)

### 2. Animations
- CSS transforms (GPU accelerated)
- Intersection Observer (efficient scroll detection)
- RequestAnimationFrame for smooth transitions
- Staggered delays prevent layout thrashing

### 3. Product Catalog
- Virtual scrolling for large catalogs (future)
- Image lazy loading with Next.js Image
- Debounced search input
- Memoized filter/sort functions

### 4. Live Chat
- Async script loading
- Load on user interaction (future)
- Cleanup on unmount
- No blocking of main thread

## Analytics Events

All features track analytics:

```typescript
// Video background view
{
  eventType: 'PAGE_VIEW',
  metadata: { hasVideoBackground: true }
}

// Product inquiry
{
  eventType: 'CLICK',
  metadata: {
    action: 'product_inquiry',
    productId: string,
    productName: string
  }
}

// Appointment booking
{
  eventType: 'CLICK',
  metadata: {
    action: 'appointment_booking',
    date: string,
    time: string
  }
}

// Live chat load
{
  eventType: 'CLICK',
  metadata: {
    action: 'live_chat_loaded',
    provider: string
  }
}
```

## Security Considerations

1. **Video URLs**: Validate and sanitize video URLs
2. **Custom Scripts**: Sanitize custom chat scripts (XSS prevention)
3. **Form Inputs**: Client and server-side validation
4. **WhatsApp Links**: Encode user input properly
5. **Analytics**: Don't track PII without consent

## Accessibility

1. **Video Backgrounds**:
   - Provide text alternatives
   - Respect prefers-reduced-motion
   - Ensure sufficient contrast

2. **Animations**:
   - Respect prefers-reduced-motion
   - Keyboard navigation support
   - Focus management

3. **Product Catalog**:
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

4. **Forms**:
   - Proper label associations
   - Error announcements
   - Focus management

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Video BG | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ |
| Live Chat (depends on provider) | ✅ | ✅ | ✅ | ✅ |

## Deployment Checklist

- [ ] Test video backgrounds on various network speeds
- [ ] Verify animations work on all target devices
- [ ] Test appointment booking WhatsApp integration
- [ ] Configure live chat provider credentials
- [ ] Test product catalog with large datasets
- [ ] Verify analytics tracking
- [ ] Check mobile responsiveness
- [ ] Test accessibility features
- [ ] Optimize video file sizes
- [ ] Configure CDN for video delivery
- [ ] Set up error monitoring
- [ ] Document configuration for clients

## Maintenance

### Regular Tasks
- Monitor video CDN costs
- Update live chat provider SDKs
- Review analytics data
- Optimize animation performance
- Update documentation

### Troubleshooting
- Check browser console for errors
- Verify configuration JSON structure
- Test WhatsApp number format
- Validate live chat widget IDs
- Monitor performance metrics
