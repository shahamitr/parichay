# Accessibility Quick Reference Guide

Quick reference for developers working on the OneTouch BizCard microsite.

## Quick Checks Before Committing

- [ ] All buttons have `aria-label` or visible text
- [ ] All images have `alt` text
- [ ] All form inputs have labels
- [ ] Color contrast meets 4.5:1 (normal text) or 3:1 (large text)
- [ ] Interactive elements have visible focus indicators
- [ ] Tab order is logical
- [ ] Animations respect `prefers-reduced-motion`

## Common Patterns

### Button with Icon
```tsx
<button aria-label="Close menu">
  <XIcon aria-hidden="true" />
</button>
```

### Link with Icon
```tsx
<a href="/contact" aria-label="Contact us">
  <MailIcon aria-hidden="true" />
  <span>Contact</span>
</a>
```

### Section with Heading
```tsx
<section id="about" aria-labelledby="about-heading">
  <h2 id="about-heading">About Us</h2>
  {/* content */}
</section>
```

### Form Input
```tsx
<Input
  id="email"
  label="Email Address"
  type="email"
  aria-required="true"
  aria-describedby="email-help"
/>
<p id="email-help" className="text-sm text-neutral-500">
  We'll never share your email
</p>
```

### Modal/Dialog
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Modal Title</h2>
  {/* content */}
</div>
```

### Loading State
```tsx
<div role="status" aria-live="polite">
  {loading ? 'Loading...' : 'Content loaded'}
</div>
```

## Color Contrast Quick Reference

### ✅ Safe Text Colors on White
- Neutral 900 (#171717) - 16.07:1
- Neutral 700 (#404040) - 10.37:1
- Neutral 500 (#737373) - 4.69:1
- Primary 600 (#6d4aff) - 5.21:1

### ✅ Safe Button Colors (White Text)
- Primary 500 (#7b61ff) - 4.64:1
- Accent 700 (#ea580c) - 4.65:1

### ❌ Avoid for Normal Text
- Accent 500 (#ff7b00) - 3.12:1 (large text only)
- Error 500 (#ef4444) - 3.94:1 (large text only)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Next element |
| `Shift+Tab` | Previous element |
| `Enter/Space` | Activate |
| `Esc` | Close/Cancel |
| `Home` | Top of page |
| `End` | Bottom of page |
| `Alt+↓` | Next section |
| `Alt+↑` | Previous section |
| `Ctrl+K` | Contact section |
| `?` | Show shortcuts |

## Utility Functions

### Announce to Screen Reader
```typescript
import { announceToScreenReader } from '@/lib/accessibility-utils';

announceToScreenReader('Form submitted successfully', 'polite');
```

### Check Color Contrast
```typescript
import { getContrastRatio, meetsWCAGAA } from '@/lib/accessibility-utils';

const ratio = getContrastRatio('#7b61ff', '#ffffff');
const passes = meetsWCAGAA('#7b61ff', '#ffffff');
```

### Navigate to Section
```typescript
import { navigateToSection } from '@/lib/keyboard-navigation';

navigateToSection('contact');
```

## CSS Classes

### Screen Reader Only
```tsx
<span className="sr-only">Hidden from view but read by screen readers</span>
```

### Skip Link
```tsx
<a href="#main" className="skip-link">
  Skip to main content
</a>
```

### Focus Visible
```tsx
<button className="focus-visible-ring">
  Click me
</button>
```

### Touch Target
```tsx
<button className="touch-target">
  Minimum 44x44px
</button>
```

## Testing Commands

### Run Lighthouse
```bash
npm run lighthouse
```

### Check Contrast (Dev Tool)
Click "Contrast" button in top-right corner (dev mode)

### Test Keyboard Navigation
1. Press `Tab` to navigate
2. Press `?` to see all shortcuts
3. Test all interactive elements

## Common Mistakes to Avoid

❌ **Don't**: Use `div` or `span` as buttons
```tsx
<div onClick={handleClick}>Click me</div>
```

✅ **Do**: Use semantic `button` element
```tsx
<button onClick={handleClick}>Click me</button>
```

---

❌ **Don't**: Forget alt text on images
```tsx
<img src="/logo.png" />
```

✅ **Do**: Always include descriptive alt text
```tsx
<img src="/logo.png" alt="Company Logo" />
```

---

❌ **Don't**: Use color alone to convey information
```tsx
<span className="text-red-500">Error</span>
```

✅ **Do**: Use icons and text together
```tsx
<span className="text-red-500">
  <ErrorIcon aria-hidden="true" />
  Error: Please fix the form
</span>
```

---

❌ **Don't**: Remove focus indicators
```css
*:focus {
  outline: none; /* Bad! */
}
```

✅ **Do**: Style focus indicators properly
```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

## Resources

- 📖 [Full Implementation Guide](./ACCESSIBILITY_IMPLEMENTATION.md)
- 🎨 [Color Contrast Report](./COLOR_CONTRAST_COMPLIANCE.md)
- 📋 [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- 🔧 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Need Help?

1. Check the full [Accessibility Implementation Guide](./ACCESSIBILITY_IMPLEMENTATION.md)
2. Review [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
3. Test with screen readers (NVDA, JAWS, VoiceOver)
4. Use automated tools (Lighthouse, axe DevTools)

---

**Remember**: Accessibility is not optional. It's a requirement for all users to access our content.
