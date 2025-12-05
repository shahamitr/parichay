# 🎉 Festival-Based Theming System

## Overview

Automatic festival detection and themed banners/effects for microsites to attract customers and create festive atmosphere.

---

## 🎊 Supported Festivals

### 1. New Year (Dec 25 - Jan 7)
- **Colors:** Gold, Red, Teal
- **Banner:** "🎊 Happy New Year! Special offers inside 🎊"
- **Effects:** Confetti, Fireworks
- **Theme:** Purple gradient

### 2. Diwali (Oct 20 - Nov 5)
- **Colors:** Orange, Yellow, Gold
- **Banner:** "🪔 Happy Diwali! Wishing you prosperity 🪔"
- **Effects:** Sparkles, Fireworks
- **Theme:** Pink-Red gradient

### 3. Christmas (Dec 15 - Dec 26)
- **Colors:** Red, Green, Gold
- **Banner:** "🎄 Merry Christmas! Season's Greetings 🎄"
- **Effects:** Snow
- **Theme:** Red-Green gradient

### 4. Holi (Mar 1 - Mar 15)
- **Colors:** Pink, Cyan, Gold
- **Banner:** "🎨 Happy Holi! Colors of joy 🎨"
- **Effects:** Confetti, Sparkles
- **Theme:** Multi-color gradient

### 5. Independence Day (Aug 10 - Aug 16)
- **Colors:** Saffron, White, Green
- **Banner:** "🇮🇳 Happy Independence Day! Jai Hind 🇮🇳"
- **Effects:** Confetti
- **Theme:** Tricolor gradient

### 6. Valentine's Day (Feb 10 - Feb 15)
- **Colors:** Pink, Hot Pink, Light Pink
- **Banner:** "💝 Happy Valentine's Day! Spread the love 💝"
- **Effects:** Sparkles
- **Theme:** Pink gradient

### 7. Eid (Apr 1 - Apr 10)
- **Colors:** Green, Gold, White
- **Banner:** "🌙 Eid Mubarak! Blessings and joy 🌙"
- **Effects:** Sparkles
- **Theme:** Green-Gold gradient

### 8. Raksha Bandhan (Aug 1 - Aug 10)
- **Colors:** Pink, Rose, Gold
- **Banner:** "🎀 Happy Raksha Bandhan! Bond of love 🎀"
- **Effects:** Sparkles
- **Theme:** Pink gradient

---

## 🎨 Visual Effects

### Confetti
- Colorful falling particles
- Random colors and positions
- Smooth animation
- Non-intrusive

### Snow
- White falling snowflakes
- Gentle drift effect
- Perfect for Christmas
- Subtle and elegant

### Fireworks
- Burst animations
- Multiple colors
- Periodic display
- Celebratory feel

### Sparkles
- Twinkling stars
- Gold/yellow colors
- Pulsing animation
- Magical effect

---

## 🚀 How It Works

### Automatic Detection
```typescript
import { getCurrentFestival } from '@/lib/festival-themes';

const festival = getCurrentFestival();
// Returns current festival or null
```

### Date-Based Logic
- Checks current date against festival ranges
- Handles year-crossing festivals (New Year)
- Automatically activates/deactivates
- No manual intervention needed

### User Dismissal
- Users can dismiss banner
- Stored in localStorage
- Per-festival tracking
- Respects user preference

---

## 📦 Components

### 1. FestivalBanner
**Location:** `src/components/microsites/FestivalBanner.tsx`

**Features:**
- Auto-detects current festival
- Displays themed banner
- Dismissible by user
- Animated entrance
- Gradient backgrounds
- Festival emojis

**Usage:**
```tsx
import FestivalBanner from '@/components/microsites/FestivalBanner';

<FestivalBanner onClose={() => console.log('Banner closed')} />
```

### 2. FestivalEffects
**Location:** `src/components/microsites/FestivalEffects.tsx`

**Features:**
- Confetti animation
- Snow effect
- Fireworks display
- Auto-activates based on festival
- Non-intrusive
- Performance optimized

**Usage:**
```tsx
import FestivalEffects from '@/components/microsites/FestivalEffects';

<FestivalEffects />
```

### 3. Festival Themes Library
**Location:** `src/lib/festival-themes.ts`

**Functions:**
- `getCurrentFestival()` - Get active festival
- `getFestivalByDate(date)` - Check specific date
- `isFestivalActive(id)` - Check if festival is active

---

## 🎯 Integration

### In Microsite Layout
```tsx
import FestivalBanner from '@/components/microsites/FestivalBanner';
import FestivalEffects from '@/components/microsites/FestivalEffects';

export default function MicrositeLayout({ children }) {
  return (
    <>
      <FestivalBanner />
      <FestivalEffects />
      {children}
    </>
  );
}
```

### In Public Pages
```tsx
// Add to any public-facing page
<FestivalBanner />
<FestivalEffects />
```

---

## ⚙️ Configuration

### Adding New Festivals

Edit `src/lib/festival-themes.ts`:

```typescript
{
  id: 'your-festival',
  name: 'Your Festival',
  startDate: '03-20', // MM-DD
  endDate: '03-25',
  colors: {
    primary: '#FF0000',
    secondary: '#00FF00',
    accent: '#0000FF',
    background: 'linear-gradient(...)',
  },
  banner: {
    text: '🎉 Your Festival Message 🎉',
    emoji: '🎉',
    gradient: 'linear-gradient(...)',
  },
  effects: {
    confetti: true,
    sparkles: true,
  },
}
```

### Adjusting Dates

Update dates in `festivals` array for lunar calendar festivals:
- Diwali
- Eid
- Holi
- Raksha Bandhan

These need yearly adjustment based on lunar calendar.

---

## 🎭 Customization

### Banner Text
Change `banner.text` in festival config

### Colors
Modify `colors` object for each festival

### Effects
Enable/disable effects:
```typescript
effects: {
  confetti: true,
  fireworks: false,
  snow: false,
  sparkles: true,
}
```

### Duration
Adjust `startDate` and `endDate` for each festival

---

## 📱 Mobile Optimization

- Responsive banner design
- Touch-friendly dismiss button
- Optimized animations
- Reduced particle count on mobile
- Performance-conscious

---

## 🔧 Performance

### Optimizations
- Lazy loading of effects
- CSS animations (GPU accelerated)
- Limited particle count
- Cleanup on unmount
- LocalStorage for dismissal

### Best Practices
- Effects are optional
- Banner is dismissible
- No impact on page load
- Minimal JavaScript
- Pure CSS animations

---

## 🎨 Design Principles

### Non-Intrusive
- Banner at top (easy to dismiss)
- Effects in background
- Doesn't block content
- Respects user preference

### Festive Feel
- Vibrant colors
- Animated effects
- Cultural relevance
- Emotional connection

### Professional
- Clean design
- Smooth animations
- Brand-appropriate
- Confidence-building

---

## 📊 Benefits

### For Business
- Increased engagement
- Cultural connection
- Seasonal relevance
- Professional appearance
- Customer confidence

### For Users
- Festive atmosphere
- Cultural celebration
- Visual appeal
- Memorable experience
- Emotional connection

---

## 🚀 Deployment

### Automatic Activation
- No manual switching needed
- Date-based activation
- Automatic deactivation
- Zero maintenance

### Testing
```typescript
// Test specific festival
import { getFestivalByDate } from '@/lib/festival-themes';

const testDate = new Date('2024-12-25');
const festival = getFestivalByDate(testDate);
console.log(festival); // New Year festival
```

---

## 📝 Maintenance

### Yearly Updates
1. Update lunar calendar festival dates
2. Test date ranges
3. Verify effects work
4. Check banner text relevance

### Adding Festivals
1. Add to `festivals` array
2. Define colors and effects
3. Create banner text
4. Test date logic

---

## 🎉 Summary

Festival theming system provides:
- ✅ 8 major festivals covered
- ✅ Automatic detection
- ✅ Beautiful visual effects
- ✅ Dismissible banners
- ✅ Cultural relevance
- ✅ Professional appearance
- ✅ Zero maintenance
- ✅ Performance optimized

**Result:** Microsites that celebrate with customers and build confidence in the platform!
