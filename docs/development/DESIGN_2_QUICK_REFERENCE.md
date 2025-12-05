# Design 2 - Quick Reference Card

## 🎨 Color Palette

```css
/* Backgrounds */
bg-white           /* Primary background */
bg-gray-50         /* Subtle sections */
bg-gray-100        /* Cards, hover states */

/* Text */
text-gray-900      /* Headings */
text-gray-700      /* Body text */
text-gray-600      /* Secondary text */
text-gray-500      /* Tertiary text */

/* Brand (Dynamic) */
bg-brand-primary   /* Main CTAs */
text-brand-primary /* Links, accents */
```

## 📏 Spacing

```css
/* Sections */
py-20 px-6         /* Standard section padding */

/* Containers */
max-w-4xl          /* Standard content */
max-w-7xl          /* Wide layouts */

/* Gaps */
gap-3              /* Tight (12px) */
gap-6              /* Standard (24px) */
gap-12             /* Generous (48px) */
```

## 🔤 Typography

```css
/* Headings */
text-3xl sm:text-4xl font-bold  /* Section titles */
text-xl font-bold               /* Subsections */
text-lg font-bold               /* Card titles */

/* Body */
text-lg            /* Main content */
text-base          /* Standard text */
text-sm            /* Labels, captions */
```

## 🔘 Buttons

```css
/* Primary */
px-8 py-4 bg-brand-primary text-white rounded-xl
hover:bg-brand-primary/90 transition-colors duration-200
shadow-sm hover:shadow-md font-medium

/* Secondary */
px-8 py-4 bg-white border-2 border-gray-300
text-gray-700 rounded-xl hover:border-gray-400
hover:bg-gray-50 transition-colors duration-200 font-medium
```

## 📦 Cards

```css
/* Standard Card */
bg-gray-50 rounded-xl p-6
hover:bg-gray-100 transition-colors duration-200

/* Content Card */
bg-white rounded-2xl p-10
shadow-sm border border-gray-100
```

## 📝 Forms

```css
/* Input */
px-4 py-3 border border-gray-300 rounded-xl
focus:outline-none focus:ring-2 focus:ring-brand-primary
focus:border-transparent transition-shadow

/* Label */
text-sm font-medium text-gray-700 mb-2
```

## 🎯 Section Pattern

```tsx
<section className="relative bg-white py-20 px-6">
  <div className="max-w-4xl mx-auto">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Title
      </h2>
      <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full"></div>
    </div>

    {/* Content */}
  </div>
</section>
```

## ✨ Key Principles

1. **White Space**: Generous padding everywhere
2. **Simplicity**: No decorative elements
3. **Consistency**: Same patterns throughout
4. **Professionalism**: Clean, corporate aesthetic
5. **Accessibility**: WCAG AA compliant

## 🚫 Avoid

- ❌ Gradient backgrounds
- ❌ Decorative orbs/shapes
- ❌ Excessive animations
- ❌ Busy patterns
- ❌ Inconsistent spacing
- ❌ Flashy effects

## ✅ Use

- ✅ White/gray-50 backgrounds
- ✅ Subtle transitions (200ms)
- ✅ Consistent spacing
- ✅ Clean typography
- ✅ Professional colors
- ✅ Simple shadows

---

**Remember**: Less is more. Clean, professional, premium.
