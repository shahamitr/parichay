# Advanced Microsite Features Guide

This guide covers the advanced features available for microsites including video backgrounds, animations, interactive product catalogs, appointment booking, and live chat integration.

## 1. Video Background Support

### Configuration

Add video backgrounds to your hero section by configuring the `HeroSection` in your microsite config:

```json
{
  "sections": {
    "hero": {
      "enabled": true,
      "title": "Welcome to Our Business",
      "subtitle": "Experience excellence in every interaction",
      "backgroundType": "video",
      "backgroundVideo": "https://example.com/videos/hero-background.mp4",
      "animationEnabled": true
    }
  }
}
```

### Supported Video Formats
- MP4 (recommended)
- WebM (fallback)

### Best Practices
- Keep video files under 5MB for optimal loading
- Use 1920x1080 resolution or lower
- Ensure videos are optimized for web (compressed)
- Videos auto-play, loop, and are muted by default
- Include a fallback image for browsers that don't support video

## 2. Animation and Transition Effects

### Hero Section Animations

Enable smooth animations in the hero section:

```json
{
  "hero": {
    "animationEnabled": true
  }
}
```

This enables:
- Fade-in effects for title and subtitle
- Staggered animations with delays
- Smooth button hover effects
- Scroll indicators

### Using AnimatedSection Component

Wrap any section with the `AnimatedSection` component for scroll-triggered animations:

```tsx
import AnimatedSection from '@/components/microsites/AnimatedSection';

<AnimatedSection
  animation="slide-up"
  delay={200}
  duration={800}
>
  <YourContent />
</AnimatedSection>
```

**Available Animations:**
- `fade-in` - Simple fade in effect
- `slide-up` - Slide from bottom
- `slide-left` - Slide from right
- `slide-right` - Slide from left
- `zoom-in` - Scale up effect
- `none` - No animation

## 3. Interactive Product Catalog

### Features

The interactive product catalog includes:

- **Search Functionality**: Real-time search across product names and descriptions
- **Category Filtering**: Filter products by category
- **Sorting Options**: Sort by name, price (low to high), or price (high to low)
- **View Modes**: Toggle between grid and list views
- **Product Details Modal**: Click any product for detailed view
- **Availability Status**: Show limited stock or out of stock badges
- **Smooth Animations**: Staggered fade-in animations for products

### Configuration

```json
{
  "sections": {
    "services": {
      "enabled": true,
      "items": [
        {
          "id": "prod-1",
          "name": "Premium Service Package",
          "description": "Comprehensive service with all features included",
          "image": "https://example.com/images/service1.jpg",
          "price": 9999,
          "category": "premium",
          "availability": "available",
          "features": [
            "24/7 Support",
            "Priority Processing",
            "Custom Solutions",
            "Dedicated Account Manager"
          ]
        }
      ]
    }
  }
}
```

### Availability Options
- `available` - Product is in stock
- `limited` - Limited stock (shows orange badge)
- `out_of_stock` - Not available (shows red badge, disables inquire button)

## 4. Appointment Booking Integration

### Configuration

Enable appointment booking with WhatsApp integration:

```json
{
  "sections": {
    "contact": {
      "enabled": true,
      "appointmentBooking": {
        "enabled": true,
        "provider": "custom",
        "availableSlots": [
          {
            "day": "monday",
            "slots": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
          },
          {
            "day": "tuesday",
            "slots": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
          },
          {
            "day": "wednesday",
            "slots": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
          },
          {
            "day": "thursday",
            "slots": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
          },
          {
            "day": "friday",
            "slots": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
          }
        ]
      }
    }
  }
}
```

### How It Works

1. User selects a date from the next 14 days
2. Available time slots are shown based on the day of the week
3. User fills in their contact information
4. Appointment request is sent via WhatsApp to the branch contact
5. Business confirms the appointment through WhatsApp

### Features
- Date picker with next 14 days
- Day-specific time slots
- WhatsApp integration for confirmations
- Form validation
- Analytics tracking

## 5. Live Chat Widget Integration

### Supported Providers

- **Tawk.to** - Free live chat solution
- **Intercom** - Premium customer messaging platform
- **Crisp** - Modern customer support platform
- **Custom** - Use your own chat script

### Configuration Examples

#### Tawk.to Integration

```json
{
  "sections": {
    "contact": {
      "enabled": true,
      "liveChatEnabled": true,
      "liveChatProvider": "tawk",
      "liveChatConfig": {
        "widgetId": "your-tawk-widget-id"
      }
    }
  }
}
```

To get your Tawk.to widget ID:
1. Sign up at https://www.tawk.to/
2. Create a property
3. Go to Administration > Channels
4. Copy your widget ID from the embed code

#### Intercom Integration

```json
{
  "sections": {
    "contact": {
      "enabled": true,
      "liveChatEnabled": true,
      "liveChatProvider": "intercom",
      "liveChatConfig": {
        "widgetId": "your-intercom-app-id"
      }
    }
  }
}
```

#### Crisp Integration

```json
{
  "sections": {
    "contact": {
      "enabled": true,
      "liveChatEnabled": true,
      "liveChatProvider": "crisp",
      "liveChatConfig": {
        "widgetId": "your-crisp-website-id"
      }
    }
  }
}
```

#### Custom Script Integration

```json
{
  "sections": {
    "contact": {
      "enabled": true,
      "liveChatEnabled": true,
      "liveChatProvider": "custom",
      "liveChatConfig": {
        "customScript": "<!-- Your custom chat widget script here -->"
      }
    }
  }
}
```

### Default Behavior

- Live chat is **disabled by default**
- Must be explicitly enabled in the configuration
- Widget loads asynchronously to not impact page performance
- Automatically cleaned up when component unmounts

## Complete Configuration Example

Here's a complete example with all advanced features enabled:

```json
{
  "templateId": "modern-business",
  "sections": {
    "hero": {
      "enabled": true,
      "title": "Transform Your Business Today",
      "subtitle": "Experience innovation and excellence",
      "backgroundType": "video",
      "backgroundVideo": "https://cdn.example.com/hero-video.mp4",
      "animationEnabled": true
    },
    "services": {
      "enabled": true,
      "items": [
        {
          "id": "service-1",
          "name": "Consulting Services",
          "description": "Expert guidance for your business growth",
          "image": "https://cdn.example.com/consulting.jpg",
          "price": 15000,
          "category": "consulting",
          "availability": "available",
          "features": [
            "Strategic Planning",
            "Market Analysis",
            "Growth Strategies"
          ]
        }
      ]
    },
    "contact": {
      "enabled": true,
      "showMap": true,
      "leadForm": {
        "enabled": true,
        "fields": ["name", "email", "phone", "message"]
      },
      "appointmentBooking": {
        "enabled": true,
        "provider": "custom",
        "availableSlots": [
          {
            "day": "monday",
            "slots": ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
          }
        ]
      },
      "liveChatEnabled": true,
      "liveChatProvider": "tawk",
      "liveChatConfig": {
        "widgetId": "your-widget-id"
      }
    }
  },
  "seoSettings": {
    "title": "Your Business Name - Professional Services",
    "description": "Leading provider of professional services",
    "keywords": ["business", "consulting", "services"]
  }
}
```

## Performance Considerations

1. **Video Backgrounds**:
   - Use compressed videos (< 5MB)
   - Consider using poster images for mobile devices
   - Videos are set to autoplay, loop, and muted

2. **Animations**:
   - Animations are triggered on scroll using Intersection Observer
imal performance impact
   - Can be disabled by setting `animationEnabled: false`

3. **Live Chat Widgets**:
   - Load asynchronously
   - Don't block page rendering
   - Automatically cleaned up on unmount

4. **Product Catalog**:
   - Images should be optimized (WebP format recommended)
   - Lazy loading is implemented
   - Smooth animations with CSS transforms

## Analytics Tracking

All advanced features include built-in analytics tracking:

- Video background views
- Product catalog interactions
- Appointment booking requests
- Live chat widget loads
- Button clicks and form submissions

Events are automatically sent to `/api/analytics/track` endpoint.

## Troubleshooting

### Video Not Playing
- Check video URL is accessible
- Ensure video format is MP4 or WebM
- Verify video file size is reasonable
- Check browser console for errors

### Animations Not Working
- Verify `animationEnabled: true` in config
- Check browser supports Intersection Observer
- Ensure CSS is loading correctly

### Live Chat Not Appearing
- Verify `liveChatEnabled: true`
- Check widget ID is correct
- Ensure provider script is loading
- Check browser console for errors

### Appointment Booking Issues
- Verify WhatsApp number is configured in branch contact
- Check available slots are configured correctly
- Ensure date/time selections are valid

## Support

For additional help or custom implementations, contact the development team or refer to the main documentation.
