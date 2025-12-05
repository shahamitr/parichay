# Enhanced Microsite Builder - Quick Start Guide

## Installation

1. **Install required dependencies**:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

2. **Restart your dev server**:
```bash
npm run dev
```

---

## Usage

### Replace your existing builder:

**Before** (in your microsite management page):
```tsx
import MicrositeBuilder from '@/components/microsites/MicrositeBuilder';

<MicrositeBuilder
  branchId={branchId}
  initialData={micrositeData}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

**After**:
```tsx
import EnhancedMicrositeBuilder from '@/components/microsites/EnhancedMicrositeBuilder';

<EnhancedMicrositeBuilder
  branchId={branchId}
  initialData={micrositeData}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

---

## Features Overview

### 1. Drag & Drop Sections
- Go to **Sections** tab
- Drag sections to reorder
- Click eye icon to show/hide
- Click settings icon to edit

### 2. Mobile Preview
- Top toolbar: Click **Desktop / Tablet / Mobile**
- Click fullscreen icon for distraction-free preview
- Preview updates in real-time

### 3. Color Themes
- Go to **Design** tab
- Choose from:
  - **Presets**: 12 ready-made themes
  - **Industry**: 8 industry-specific themes
  - **Custom**: Pick your own colors
- Auto-generate complementary colors

### 4. Typography
- Go to **Design** tab (scroll down)
- Choose from:
  - **Font Pairings**: 8 pre-designed combinations
  - **Custom**: Select heading and body fonts separately
- 15 Google Fonts available

### 5. Section Templates
- Go to **Content** tab
- Select a section to edit
- Click **"Choose Layout Template"** button
- Pick from multiple layout options per section

### 6. Image Cropping
- When uploading images in content editor
- Click **Crop** button on uploaded image
- Use tools:
  - Drag to move crop area
  - Drag corner to resize
  - Rotate, flip, zoom controls
  - Aspect ratio presets
- Click **Apply** to save

### 7. History Panel
- Bottom of sidebar (expandable)
- See all your changes with timestamps
- Click any point to jump back
- Quick undo/redo buttons
- Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Y` (redo)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo (alternative) |
| `Ctrl+S` / `Cmd+S` | Save |

---

## Tips & Tricks

1. **Start with a template**: Click "Templates" in header to choose a starting point
2. **Use industry themes**: They're optimized for specific business types
3. **Preview on mobile first**: Most visitors will be on mobile
4. **Use history**: Don't be afraid to experiment - you can always undo
5. **Save frequently**: Use `Ctrl+S` to save your work
6. **Fullscreen preview**: Great for client presentations

---

## Troubleshooting

### Drag & Drop not working?
- Make sure `@dnd-kit` packages are installed
- Restart dev server after installation

### Preview not updating?
- Check browser console for errors
- Ensure `initialData` prop is passed correctly

### Images not cropping?
- Check image file size (max 5MB recommended)
- Ensure image format is supported (JPG, PNG, WebP)

### History not showing?
- History starts tracking after first change
- Expand the history panel at bottom of sidebar

---

## File Locations

All new components are in:
```
src/components/microsites/builder/
```

Main builder:
```
src/components/microsites/EnhancedMicrositeBuilder.tsx
```

---

## Support

For issues or questions:
1. Check `MICROSITE_BUILDER_ENHANCEMENTS.md` for detailed documentation
2. Review component source code in `src/components/microsites/builder/`
3. Check browser console for error messages

---

**Happy Building! 🚀**
