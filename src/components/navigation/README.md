# Navigation Components

Modern navigation components for microsite visual enhancements. These components provide a premium user experience with smooth animations, accessibility support, and responsive design.

## Components

### 1. StickyNav

A sticky navigation bar with backdrop blur effect and intelligent show/hide behavior.

**Features:**
- Sticky positioning at the top of the page
- Backdrop blur glassmorphism effect
- Hides on scroll down, shows on scroll up
- Smooth scroll to sections
- Active section highlighting
- Responsive design with mobile optimization
- Dark mode support
- Respects reduced motion preferences

**Usage:**

```tsx
import { StickyNav } from '@/components/navigation';

<StickyNav
  brand={brand}
  branch={branch}
  sections={[
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ]}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `brand` | `Brand` | Yes | Brand object with logo and name |
| `branch` | `Branch` | Yes | Branch object with name |
| `sections` | `Array<{id: string, label: string}>` | No | Navigation sections (uses defaults if not provided) |

**Requirements:** 8.1, 8.5

---

### 2. ScrollProgressBar

A visual indicator showing page scroll progress at the top of the viewport.

**Features:**
- Calculates scroll percentage automatically
- Updates smoothly on scroll
- Spring animation for natural feel
- Gradient color scheme matching brand
- Respects reduced motion preferences
- Zero-height, non-intrusive design

**Usage:**

```tsx
import { ScrollProgressBar } from '@/components/navigation';

<ScrollProgressBar />
```

**Props:**

This component has no props - it works automatically.

**Requirements:** 8.2

---

### 3. FloatingActionButton (FAB)

A floating action button for primary call-to-action.

**Features:**
- Fixed positioning at bottom-right or bottom-left
- Smooth entrance animation
- Pulse effect to draw attention
- Ripple background animation
- Tooltip on hover
- Optional label display
- Shows after scrolling past threshold
- Default action: scroll to contact section
- Respects reduced motion preferences

**Usage:**

```tsx
import { FloatingActionButton } from '@/components/navigation';

// Basic usage (scrolls to contact section)
<FloatingActionButton
  label="Contact Us"
/>

// With custom icon and action
<FloatingActionButton
  icon={<MessageIcon />}
  label="Chat with us"
  onClick={() => openChatModal()}
  position="bottom-right"
  showLabel={true}
  showAfterScroll={300}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `React.ReactNode` | No | Email icon | Icon to display in button |
| `label` | `string` | Yes | - | Label for accessibility and tooltip |
| `onClick` | `() => void` | No | Scroll to contact | Click handler function |
| `position` | `'bottom-right' \| 'bottom-left'` | No | `'bottom-right'` | Position of the FAB |
| `showLabel` | `boolean` | No | `false` | Show label text next to icon |
| `showAfterScroll` | `number` | No | `300` | Minimum scroll position (px) before showing |

**Requirements:** 8.3, 8.4

---

## Integration

### Complete Integration Example

```tsx
import { StickyNav, ScrollProgressBar, FloatingActionButton } from '@/components/navigation';

export default function MicrositeRenderer({ data }) {
  const { brand, branch } = data;

  return (
    <div className="microsite-container">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Sticky Navigation */}
      <StickyNav brand={brand} branch={branch} />

      {/* Floating Action Button */}
      <FloatingActionButton
        label="Contact Us"
        showLabel={false}
        position="bottom-right"
      />

      {/* Page content */}
      <main>
        {/* Your sections here */}
      </main>
    </div>
  );
}
```

---

## Accessibility

All navigation components follow accessibility best practices:

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **ARIA Labels:** Proper ARIA labels for screen readers
- **Focus Indicators:** Visible focus states for keyboard navigation
- **Reduced Motion:** Respects `prefers-reduced-motion` user preference
- **Semantic HTML:** Uses appropriate HTML elements
- **Color Contrast:** WCAG AA compliant contrast ratios

---

## Styling

### Customization

Components use design tokens from `@/config/design-tokens` for consistent styling. To customize:

1. **Colors:** Modify `designTokens.colors` in `design-tokens.ts`
2. **Animations:** Adjust animation variants in `@/config/animations`
3. **Z-Index:** Update `designTokens.zIndex` for layering control

### Dark Mode

All components support dark mode automatically through Tailwind's `dark:` variants. Ensure your app has dark mode provider configured.

---

## Performance

- **Passive Event Listeners:** Scroll events use `{ passive: true }` for better performance
- **Debouncing:** Scroll calculations are optimized to prevent excessive re-renders
- **Code Splitting:** Components can be lazy-loaded if needed
- **Spring Animations:** Use Framer Motion's optimized spring physics

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)
- Chrome Mobile (latest)

Graceful degradation for older browsers:
- Backdrop blur falls back to solid background
- Animations disabled if not supported
- Smooth scroll falls back to instant scroll

---

## Testing

### Manual Testing Checklist

- [ ] StickyNav appears at top of page
- [ ] StickyNav hides when scrolling down
- [ ] StickyNav shows when scrolling up
- [ ] Active section highlights correctly
- [ ] Clicking nav items scrolls smoothly to sections
- [ ] ScrollProgressBar updates as you scroll
- [ ] ScrollProgressBar reaches 100% at bottom
- [ ] FAB appears after scrolling past threshold
- [ ] FAB scrolls to contact section on click
- [ ] FAB tooltip shows on hover
- [ ] All components work on mobile
- [ ] Dark mode styling works correctly
- [ ] Reduced motion preference is respected

### Automated Testing

```bash
# Run component tests
npm test -- navigation

# Run accessibility tests
npm run test:a11y
```

---

## Troubleshooting

### StickyNav not showing

- Check z-index conflicts with other fixed elements
- Ensure `isVisible` state is being set correctly
- Verify scroll event listeners are attached

### ScrollProgressBar not updating

- Check if document height is calculated correctly
- Ensure scroll event listener is passive
- Verify component is mounted at root level

### FAB not appearing

- Check `showAfterScroll` threshold value
- Verify scroll position is being tracked
- Ensure z-index is higher than other elements

### Animations not working

- Check if Framer Motion is installed
- Verify `prefersReducedMotion()` is not blocking animations
- Ensure animation variants are properly defined

---

## Future Enhancements

Potential improvements for future iterations:

- [ ] Mobile hamburger menu integration
- [ ] Breadcrumb navigation
- [ ] Section progress indicators
- [ ] Multi-level navigation support
- [ ] Customizable animation speeds
- [ ] Theme switcher integration
- [ ] Search functionality
- [ ] Keyboard shortcuts (e.g., "/" to focus search)

---

## Related Documentation

- [Design Tokens](../../config/DESIGN_SYSTEM.md)
- [Animation System](../../config/ANIMATION_SYSTEM.md)
- [Accessibility Guidelines](../../docs/ACCESSIBILITY.md)
- [Component Library](../ui/README.md)
