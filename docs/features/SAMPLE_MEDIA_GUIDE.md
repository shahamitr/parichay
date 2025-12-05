# Sample Media Guide for Microsite

## Sample Images for Gallery

### Using Unsplash (Free, High-Quality Images)

You can use these Unsplash URLs directly in your gallery:

```javascript
// Professional Business Images
const sampleGalleryImages = [
  // Office & Workspace
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // Modern office
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', // Workspace
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', // Team meeting

  // Team & People
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', // Team collaboration
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80', // Team discussion
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', // Professional meeting

  // Products & Services
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Business analytics
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Data visualization
  'https:/ages.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', // Customer service

  // Technology
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', // Technology
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80', // Laptop work
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', // Startup office
];
```

### Using Placeholder Services

For testing purposes, you can use:

```javascript
// Placeholder Images (for testing)
const placeholderImages = [
  'https://placehold.co/800x800/7b61ff/white?text=Gallery+1',
  'https://placehold.co/800x800/ff7b00/white?text=Gallery+2',
  'https://placehold.co/800x800/3b82f6/white?text=Gallery+3',
  'https://placehold.co/800x800/10b981/white?text=Gallery+4',
  'https://placehold.co/800x800/f59e0b/white?text=Gallery+5',
  'https://placehold.co/800x800/ef4444/white?text=Gallery+6',
];
```

## Sample Videos

### Using YouTube Embeds

Professional sample videos you can use:

```javascript
const sampleVideos = [
  {
    id: 'dQw4w9WgXcQ', // Replace with your video ID
    title: 'Company Introduction',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'ScMzIvxBSi4', // Sample business video
    title: 'Product Demo',
    thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
  },
  {
    id: 'jNQXAC9IVRw', // Sample tutorial
    title: 'How It Works',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
  }
];
```

### Using Vimeo

```javascript
const vimeoVideos = [
  {
    id: '148751763',
    title: 'Professional Showcase',
    url: 'https://vimeo.com/148751763'
  }
];
```

### Using Direct Video URLs

For self-hosted videos:

```javascript
const directVideos = [
  {
    url: '/videos/company-intro.mp4',
    thumbnail: '/images/video-thumb-1.jpg',
    title: 'Company Introduction'
  },
  {
    url: '/videos/product-demo.mp4',
    thumbnail: '/images/video-thumb-2.jpg',
    title: 'Product Demonstration'
  }
];
```

## How to Add Sample Media to Your Microsite

### Option 1: Via Database Seed

Create a seed file to populate sample data:

```typescript
// prisma/seed-sample-media.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSampleMedia() {
  // Update a branch with sample gallery images
  await prisma.branch.update({
    where: { id: 'your-branch-id' },
    data: {
      micrositeConfig: {
        sections: {
          gallery: {
            enabled: true,
            images: [
              'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
              'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
              'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
              'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
              'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
            ]
          },
          videos: {
            enabled: true,
            videos: [
              {
                id: 'video-1',
                title: 'Company Introduction',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
              },
              {
                id: 'video-2',
                title: 'Product Demo',
                url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg'
              }
            ]
          }
        }
      }
    }
  });
}

seedSampleMedia();
```

### Option 2: Via Admin Dashboard

1. Go to your admin dashboard
2. Navigate to Branch Settings > Microsite Configuration
3. In the Gallery section, add image URLs
4. In the Videos section, add video URLs
5. Save changes

### Option 3: Via API

```typescript
// Example API call to update microsite config
const response = await fetch('/api/branches/[branchId]/microsite-config', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sections: {
      gallery: {
        enabled: true,
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
          // ... more images
        ]
      },
      videos: {
        enabled: true,
        videos: [
          {
            id: 'video-1',
            title: 'Company Introduction',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      }
    }
  })
});
```

## Best Practices

### Images
- **Resolution**: Use at least 800x800px for gallery images
- **Format**: JPEG for photos, PNG for graphics with transparency
- **Optimization**: Compress images to keep file size under 200KB
- **Aspect Ratio**: Square (1:1) works best for gallery grid
- **Quality**: Use high-quality, professional images

### Videos
- **Length**: Keep videos under 3 minutes for best engagement
- **Thumbnail**: Always provide a custom thumbnail
- **Hosting**: YouTube/Vimeo for better performance
- **Captions**: Add captions for accessibility
- **Quality**: 1080p minimum for professional appearance

## Free Stock Media Resources

### Images
- [Unsplash](https://unsplash.com/) - Free high-quality images
- [Pexels](https://www.pexels.com/) - Free stock photos
- [Pixabay](https://pixabay.com/) - Free images and videos

### Videos
- [Pexels Videos](https://www.pexels.com/videos/) - Free stock videos
- [Pixabay Videos](https://pixabay.com/videos/) - Free video clips
- [Coverr](https://coverr.co/) - Free background videos

## Testing Your Media

After adding media, test:
- [ ] Images load correctly in gallery
- [ ] Gallery lightbox works
- [ ] Videos play properly
- [ ] Thumbnails display correctly
- [ ] Mobile responsiveness
- [ ] Loading performance

---

**Note**: Always ensure you have the right to use any media you add to your microsite. The Unsplash URLs provided are free to use under the Unsplash License.
