# Design Document

## Overview

This design document outlines the implementation approach for standardizing the orange arc visual elements across all microsite sections and updating the contact save button text. The changes will create a consistent visual identity while maintaining the existing functionality.

## Architecture

### Component Structure

The implementation will modify four existing React components:
- `ProfileSection.tsx` - Update button text and reduce arc size
- `FeedbackSection.tsx` - Add orange arc elements
- `VideosSection.tsx` - Add orange arc elements
- `PaymentSection.tsx` - Add orange arc elements

### Design Pattern

All sections will use the same CSS-based triangular corner approach:
- Top-left corner: Orange triangle using `border-l` and `border-b`
- Bottom-right corner: Orange triangle using `border-r` and `border-t`
- Positioned absolutely with `z-50` to overlay content
- Non-interactive with `pointer-events-none`

## Components and Interfaces

### Orange Arc Component Pattern

Each section will implement the arc pattern using this structure:

```tsx
<div className="relative bg-[section-bg-color] overflow-hidden">
  {/* Top Left Orange Corner */}
  <div className="absolute top-0 left-0 w-0 h-0 border-l-[120px] border-l-orange-500 border-b-[120px] border-b-transparent z-50 pointer-events-none" />

  {/* Bottom Right Orange Corner */}
  <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[120px] border-r-orange-500 border-t-[120px] border-t-transparent z-50 pointer-events-none" />

  {/* Section content */}
</div>
```

### Arc Size Specification

- **Current size (ProfileSection)**: 180px borders
- **New standardized size**: 120px borders
- **Reduction**: 33% smaller for better visual balance

### Button Text Update

The Save Contact button in ProfileSection will change from:
```tsx
<span>Add to Phone Book</span>
```

To:
```tsx
<span>Save Contact</span>
```

## Data Models

No data model changes required. All modifications are presentational only.

## Error Handling

### Potential Issues

1. **Content Overlap**: Arcs may overlap with section content on small screens
   - **Solution**: Sections already have appropriate padding; arcs use `z-50` to stay on top without blocking interaction

2. **Background Color Conflicts**: Arcs may not be visible on certain backgrounds
   - **Solution**: Orange (#f97316) provides sufficient contrast against all current section backgrounds (white, gray-50, gradient backgrounds)

3. **Responsive Behavior**: Arcs may appear disproportionate on mobile
   - **Solution**: 120px size is appropriate for mobile screens; can add responsive classes if needed

## Testing Strategy

### Visual Testing

1. **Cross-section consistency**: Verify all sections display arcs with identical size and positioning
2. **Responsive testing**: Check arc appearance on mobile (320px), tablet (768px), and desktop (1024px+) viewports
3. **Content clearance**: Ensure arcs don't obscure important content or interactive elements

### Functional Testing

1. **Save Contact button**: Verify vCard download still works with new button text
2. **Section interactions**: Confirm arcs don't interfere with form submissions, video playback, or copy actions

### Browser Compatibility

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (iOS and macOS)

CSS border triangles are well-supported across all modern browsers.

## Implementation Notes

### CSS Approach

The triangular corners use the CSS border trick:
- Setting width and height to 0
- Using large border widths
- Making adjacent borders transparent creates the triangle effect

### Z-Index Strategy

- Arcs use `z-50` to ensure they appear above section content
- Content uses `relative z-10` to maintain proper stacking context
- This prevents arcs from being hidden behind backgrounds while keeping them decorative

### Color Consistency

All arcs use `orange-500` (#f97316) from Tailwind's color palette, matching the existing brand color used in:
- Quick action buttons
- Icon backgrounds
- Dividers
- Hover states

## Design Decisions

### Why 120px instead of other sizes?

- 180px was too dominant and drew attention away from content
- 120px provides visual interest without overwhelming the design
- Maintains the triangular shape while being more subtle
- Better proportions for mobile screens

### Why not create a reusable Arc component?

- Each section has different background colors and layouts
- Inline implementation is simpler and more maintainable
- Only 4 components need modification
- Avoids prop drilling and component complexity

### Why keep arcs decorative (pointer-events-none)?

- Arcs are purely visual elements
- Should not interfere with user interactions
- Maintains accessibility by not creating clickable areas without purpose
