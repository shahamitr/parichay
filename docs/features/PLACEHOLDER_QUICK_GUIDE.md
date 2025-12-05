# Placeholder Images - Quick Reference Guide

## Quick Start

### For User Avatars
```tsx
import { UserAvatar } from '@/components/ui/Avatar';

<UserAvatar
  user={{ firstName: "John", lastName: "Doe", avatar: user.avatar }}
  size="md"
/>
```

### For Brand Logos
```tsx
import { BrandAvatar } from '@/components/ui/Avatar';

<BrandAvatar
  brand={{ name: "Acme Corp", logo: brand.logo }}
  size="lg"
/>
```

### For Any Image with Fallback
```tsx
import { getImageWithFallback } from '@/lib/placeholder-utils';
import Image from 'next/image';

<Image
  src={getImageWithFallback(imageUrl, 'photo', 'Description')}
  alt="Description"
  width={800}
  height={600}
/>
```

## Image Types

| Type | Use Case | Example |
|------|----------|---------|
| `avatar` | User profile pictures | User avatars, executive photos |
| `logo` | Brand/company logos | Brand logos, branch logos |
| `photo` | General photos | Gallery images, team photos |
| `product` | Product images | Service items, catalog products |
| `banner` | Hero/banner images | Hero backgrounds, page headers |

## Component Sizes

Avatar component supports these sizes:
- `xs` - 24px (w-6 h-6)
- `sm` - 32px (w-8 h-8)
- `md` - 48px (w-12 h-12) - **Default**
- `lg` - 64px (w-16 h-16)
- `xl` - 96px (w-24 h-24)
- `2xl` - 128px (w-32 h-32)

## Common Patterns

### Pattern 1: User List with Avatars
```tsx
{users.map(user => (
  <div key={user.id} className="flex items-center gap-3">
    <UserAvatar user={user} size="md" />
    <div>
      <p>{user.firstName} {user.lastName}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  </div>
))}
```

### Pattern 2: Brand Card with Logo
```tsx
<div className="brand-card">
  <BrandAvatar brand={brand} size="xl" />
  <h3>{brand.name}</h3>
  <p>{brand.tagline}</p>
</div>
```

### Pattern 3: Product Grid with Images
```tsx
{products.map(product => (
  <div key={product.id}>
    <Image
      src={getImageWithFallback(product.image, 'product', product.name)}
      alt={product.name}
      width={300}
      height={300}
    />
    <h4>{product.name}</h4>
  </div>
))}
```

### Pattern 4: Gallery with Placeholders
```tsx
{images.map((img, idx) => (
  <Image
    key={idx}
    src={getImageWithFallback(img.url, 'photo', `Gallery ${idx + 1}`)}
    alt={img.alt || `Gallery image ${idx + 1}`}
    fill
    className="object-cover"
  />
))}
```

## When to Use What

### Use Avatar Component When:
- ✅ Displaying user profiles
- ✅ Showing brand/company logos
- ✅ Need consistent circular/rounded avatars
- ✅ Want automatic initials fallback

### Use getImageWithFallback When:
- ✅ Displaying product images
- ✅ Gallery/photo sections
- ✅ Hero/banner backgrounds
- ✅ Any custom image implementation
- ✅ Using Next.js Image component

## Tips & Best Practices

1. **Always provide a name/description** for better placeholder generation
2. **Use appropriate image type** for better-looking placeholders
3. **Consistent sizing** - use the same size for similar elements
4. **Test with null/undefined** values to ensure fallbacks work
5. **Consider loading states** - placeholders show while images load

## Troubleshooting

### Placeholder not showing?
- Check if `getImageWithFallback` is imported
- Verify the image URL is actually null/undefined
- Check browser console for errors

### Wrong placeholder type?
- Ensure you're using the correct type: 'avatar', 'logo', 'photo', 'product', or 'banner'
- Check the second parameter in `getImageWithFallback()`

### Avatar not displaying initials?
- Verify the name prop is provided
- Check if `showInitials` prop is set to false
- Ensure the Avatar component is imported correctly

## Examples in Codebase

Check these files for working examples:
- `src/app/dashboard/users/page.tsx` - User avatars
- `src/components/brands/BrandList.tsx` - Brand logos
- `src/components/microsites/sections/ProfileSection.tsx` - Brand logo on microsite
- `src/components/microsites/sections/GallerySection.tsx` - Gallery images
- `src/components/microsites/InteractiveProductCatalog.tsx` - Product images
- `src/components/executive/ExecutiveHeader.tsx` - Executive avatar
