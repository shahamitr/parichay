# Gradient and Dark Mode System Usage Guide

This guide explains how to use the refined gradient utilities and dark mode system implemented for the microsite visual enhancements.

## Gradient System

### Requirements Addressed
- **3.1**: Softened gradient colors using transparency values between 0.7 and 0.9
- **3.2**: Two-tone pastel combinations
- **3.3**: Limited gradient usage to buttons, headers, and accent elements only

### Available Gradients

#### CSS Classes

**Primary Gradients (Full Opacity)**
```css
.gradient-primary          /* Purple to Orange */
.gradient-accent           /* Orange to Light Orange */
```

**Softened Gradients (0.7-0.9 transparency)**
```css
.gradient-primary-soft     /* Soft purple to orange (0.8 opacity) */
.gradient-accent-soft      /* Soft orange gradient (0.7 opacity) */
```

**Two-Tone Pastel Gradients (0.3 transparency)**
```css
.gradient-pastel-purple-orange
.gradient-pastel-blue-green
.gradient-pastel-pink-yellow
.gradient-pastel-teal-blue
```

**Button-Specific Gradients**
```css
.gradient-button-primary   /* For primary buttons (0.9 opacity) */
.gradient-button-secondary /* For secondary buttons (0.85 opacity) */
.gradient-button-hover     /* For hover states (full opacity) */
```

**Header-Specific Gradients**
```css
.gradient-header-primary   /* For headers (0.75 opacity) */
.gradient-header-accent    /* For accent headers (0.8 opacity) */
```

**Subtle Background Gradients**
```css
.gradient-subtle           /* Very subtle background */
.gradient-subtle-vertical  /* Vertical fade */
.gradient-subtle-radial    /* Radial from top-right */
```

**Text Gradients**
```css
.text-gradient-primary     /* Gradient text effect */
.text-gradient-accent      /* Accent gradient text */
.text-gradient-soft        /* Soft gradient text */
.text-gradient-pastel      /* Pastel gradient text */
```

### Programmatic Usage

```typescript
import {
  getGradient,
  getButtonGradient,
  getHeaderGradient,
  createCustomGradient,
  createPastelGradient,
  isGradientAppropriate
} from '@/lib/gradient-utils';

// Get gradient by type
const gradient = getGradient('buttonPrimary');

// Get button gradient
const buttonGradient = getButtonGradient('primary');

// Get header gradient
const headerGradient = getHeaderGradient('accent');

// Create custom gradient
const customGradient = createCustomGradient('#7b61ff', '#ff7b00', 0.8, 135);

// Create pastel gradient
const pastelGradient = createPastelGradient('#7b61ff', '#ff7b00');

// Check if gradient is appropriate for element type
const isAppropriate = isGradientAppropriate('buttonPrimary', 'button'); // true
```

### Usage Examples

**Button with Gradient**
```tsx
<button className="gradient-button-primary hover:gradient-button-hover text-white px-6 py-3 rounded-xl">
  Click Me
</button>
```

**Header with Gradient**
```tsx
<header className="gradient-header-primary text-white py-16">
  <h1>Welcome</h1>
</header>
```

**Text with Gradient**
```tsx
<h2 className="text-gradient-primary text-4xl font-bold">
  Gradient Text
</h2>
```

**Subtle Background**
```tsx
<section className="gradient-subtle py-16">
  <div className="container">
    {/* Content */}
  </div>
</section>
```

## Dark Mode System

### Requirements Addressed
- **3.4**: Dark mode toggle that switches between light and dark color schemes
- **3.5**: All colors adjusted to maintain WCAG AA contrast ratios in dark mode

### Setup

1. **Wrap your app with DarkModeProvider**

```tsx
// app/layout.tsx
import { DarkModeProvider } from '@/lib/dark-mode-context';

export default funtLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: getDarkModeScript() }} />
      </head>
      <body>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
```

2. **Add Dark Mode Toggle**

```tsx
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <DarkModeToggle />
    </nav>
  );
}
```

### Using Dark Mode

**With useDarkMode Hook**
```tsx
import { useDarkMode } from '@/lib/dark-mode-context';

function MyComponent() {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useDarkMode();

  return (
    <div>
      <p>Current mode: {isDarkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleDarkMode}>Toggle</button>
      <button onClick={() => setDarkMode(true)}>Enable Dark Mode</button>
    </div>
  );
}
```

**With Tailwind Classes**
```tsx
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
  <h1 className="text-neutral-900 dark:text-neutral-50">Title</h1>
  <p className="text-neutral-700 dark:text-neutral-300">Content</p>
</div>
```

**With Utility Classes**
```tsx
<div className="bg-surface text-primary">
  <h1>Automatically adapts to dark mode</h1>
</div>
```

### Dark Mode Color Palette

The dark mode system includes inverted color scales that maintain proper contrast:

- **Background**: `#0a0a0a` (primary), `#171717` (secondary), `#262626` (tertiary)
- **Surface**: `#171717` (primary), `#262626` (secondary), `#404040` (tertiary)
- **Text**: `#fafafa` (primary), `#d4d4d4` (secondary), `#a3a3a3` (tertiary)
- **Border**: `#262626` (primary), `#404040` (secondary), `#525252` (tertiary)

### Dark Mode Utilities

```typescript
import {
  isDarkModeEnabled,
  validateDarkModeContrast,
  getTextColorForBackground,
  applyDarkModeStyles
} from '@/lib/dark-mode-utils';

// Check if dark mode is enabled
const isDark = isDarkModeEnabled();

// Validate contrast ratio
const { isValid, ratio } = validateDarkModeContrast('#fafafa', '#0a0a0a');
console.log(`Contrast ratio: ${ratio}:1, Valid: ${isValid}`);

// Get appropriate text color
const textColor = getTextColorForBackground('#0a0a0a'); // 'light'

// Apply dark mode styles
const styles = applyDarkModeStyles(
  { backgroundColor: '#ffffff', color: '#000000' },
  { backgroundColor: '#0a0a0a', color: '#fafafa' },
  isDark
);
```

### Persistence

Dark mode preference is automatically persisted to `localStorage` with the key `onetouch-dark-mode`. The system also respects the user's system preference (`prefers-color-scheme: dark`) if no preference is stored.

### Preventing Flash of Unstyled Content (FOUC)

The dark mode script should be injected inline in the document head to prevent FOUC:

```tsx
import { getDarkModeScript } from '@/lib/dark-mode-script';

<head>
  <script dangerouslySetInnerHTML={{ __html: getDarkModeScript() }} />
</head>
```

## Best Practices

### Gradient Usage
1. **Limit to specific elements**: Only use gradients on buttons, headers, and accent elements (Requirement 3.3)
2. **Use appropriate transparency**: Stick to 0.7-0.9 range for softened gradients (Requirement 3.1)
3. **Choose pastel for backgrounds**: Use pastel gradients (0.3 opacity) for subtle backgrounds (Requirement 3.2)
4. **Check appropriateness**: Use `isGradientAppropriate()` to verify gradient usage

### Dark Mode
1. **Always provide dark variants**: Use `dark:` prefix for all color classes
2. **Test contrast**: Ensure WCAG AA compliance (4.5:1 for normal text)
3. **Use semantic classes**: Prefer `.bg-surface` over specific colors
4. **Respect user preference**: The system automatically respects `prefers-reduced-motion`

## Examples

### Complete Button Component
```tsx
function GradientButton({ children, variant = 'primary' }) {
  return (
    <button
      className={`
        ${variant === 'primary' ? 'gradient-button-primary' : 'gradient-button-secondary'}
        hover:gradient-button-hover
        text-white dark:text-neutral-50
        px-6 py-3 rounded-xl
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-neutral-900
      `}
    >
      {children}
    </button>
  );
}
```

### Complete Card Component
```tsx
function Card({ children }) {
  return (
    <div className="card-base card-hover">
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
```

### Complete Header Component
```tsx
function Header({ title, subtitle }) {
  return (
    <header className="gradient-header-primary py-16">
      <div className="container-custom">
        <h1 className="text-hero text-white dark:text-neutral-50 mb-4">
          {title}
        </h1>
        <p className="text-body text-white/90 dark:text-neutral-100/90">
          {subtitle}
        </p>
      </div>
    </header>
  );
}
```
