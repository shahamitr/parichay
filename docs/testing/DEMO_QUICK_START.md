# Demo Quick Start

## 🚀 Setup (2 minutes)

```bash
# Windows
scripts\seed-demo-data.bat

# Linux/Mac
bash scripts/seed-demo-data.sh

# Start app
npm run dev
```

## 👤 Login

```
URL: http://localhost:3000/login

Executives:
- john.smith@demo.executive / Demo@123
- sarah.johnson@demo.executive / Demo@123
- michael.chen@demo.executive / Demo@123
- priya.patel@demo.executive / Demo@123
- david.kumar@demo.executive / Demo@123
```

## 🎬 Demo Flow (15 min)

### 1. Executive Portal (5 min)
- Login as john.smith@demo.executive
- Show Dashboard stats
- Navigate to "My Branches"
- Click "Preview" on any branch
- Switch device modes

### 2. Onboarding (5 min)
- Click "Onboard New"
- Show Manual Entry form
- Click "Preview Microsite"
- Switch to "Import from Google"
- Show import process

### 3. Performance (5 min)
- View Dashboard statistics
- Show success rate
- Explain trends
- Show leaderboard (if admin)

## 📊 Demo Data

- **5 Brands** (Tech, Restaurant, Gym, Real Estate, Healthcare)
- **10-15 Branches** (Complete microsite configs)
- **5 Executives** (Varied performance)
- **20+ Leads** (Sample inquiries)
- **100+ Analytics** (Events and tracking)

## 🎯 Key Features to Show

✅ Executive Portal
✅ Microsite Preview (3 device modes)
✅ Temporary Preview (before creation)
✅ Google Business Import
✅ Performance Tracking
✅ Leaderboard Rankings

## 💡 Talking Points

- "Onboard in under 5 minutes"
- "Preview before committing"
- "Import from Google Business"
- "Track performance in real-time"
- "Mobile-responsive design"

## 🐛 Quick Fixes

**Data not showing?**
```bash
npx tsx prisma/seed-demo.ts
```

**Can't login?**
- Check email: john.smith@demo.executive
- Password: Demo@123

**Preview not working?**
- Refresh page
- Try different branch
- Check console

## 📖 Full Guide

See `DEMO_GUIDE.md` for complete documentation

---

**Ready to Demo!** 🎉
