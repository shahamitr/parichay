# OneTouch BizCard - Demo Guide

## 🎯 Overview

This guide will help you set up and showcase the OneTouch BizCard platform with realistic demo data.

---

## 🚀 Quick Setup

### Step 1: Seed Demo Data

**Windows:**
```bash
scripts\seed-demo-data.bat
```

**Linux/Mac:**
```bash
bash scripts/seed-demo-data.sh
```

**Or manually:**
```bash
npm install
npx prisma generate
npx tsx prisma/seed-demo.ts
```

### Step 2: Start the Application

```bash
npm run dev
```

### Step 3: Login

Navigate to `http://localhost:3000/login`

---

## 👥 Demo Accounts

### Executive Accounts

| Name | Email | Password | Branches |
|------|-------|----------|----------|
| John Smith | john.smith@demo.executive | Demo@123 | 8-10 |
| Sarah Johnson | sarah.johnson@demo.executive | Demo@123 | 6-8 |
| Michael Chen | michael.chen@demo.executive | Demo@123 | 5-7 |
| Priya Patel | priya.patel@demo.executive | Demo@123 | 4-6 |
| David Kumar | david.kumar@demo.executive | Demo@123 | 3-5 |

**Note:** All executives have different performance metrics for showcasing the leaderboard.

---

## 🏢 Demo Brands

### 1. TechVision Solutions
- **Industry:** Technology / Software
- **Branches:** Mumbai HQ, Pune Office, Bangalore Center
- **Services:** Software Development, Cloud Migration, Mobile Apps
- **Color Theme:** Blue (#3B82F6)

### 2. Spice Garden Restaurant
- **Industry:** Food & Beverage
- **Branches:** Bandra, Powai, Andheri
- **Services:** Dine-in, Takeaway, Catering
- **Color Theme:** Red (#EF4444)

### 3. FitLife Gym & Wellness
- **Industry:** Fitness & Health
- **Branches:** Powai, Bandra, Thane
- **Services:** Gym Membership, Personal Training, Yoga
- **Color Theme:** Green (#10B981)

### 4. Prime Properties Group
- **Industry:** Real Estate
- **Branches:** South Mumbai, Navi Mumbai
- **Services:** Residential, Commercial, Rentals
- **Color Theme:** Purple (#8B5CF6)

### 5. HealthCare Plus Clinic
- **Industry:** Healthcare
- **Branches:** Andheri, Borivali
- **Services:** General Practice, Diagnostics, Wellness
- **Color Theme:** Cyan (#06B6D4)

---

## 📊 Demo Data Included

### Branches
- **Total:** 10-15 branches across 5 brands
- **Status:** Mix of active and inactive
- **Onboarding Dates:** Spread over last 3 months
- **Complete Configurations:** All have full microsite setups

### Executives
- **Total:** 5 executives
- **Performance:** Varied onboarding counts
- **Trends:** Mix of positive and negative trends
- **Success Rates:** 70-95% range

### Leads
- **Total:** 20+ sample leads
- **Sources:** QR Code, Direct Visit, Social Share
- **Distribution:** Across all branches
- **Dates:** Last 30 days

### Analytics
- **Total:** 100+ events
- **Types:** Page Views, Clicks, QR Scans, Lead Submits, vCard Downloads
- **Distribution:** Across all branches
- **Period:** Last 30 days

---

## 🎬 Demo Scenarios

### Scenario 1: Executive Portal Showcase

**Login as:** john.smith@demo.executive

**What to Show:**
1. **Dashboard Tab**
   - Performance statistics
   - Success rate (85%+)
   - Monthly trends
   - Leaderboard ranking

2. **Onboard New Tab**
   - Manual entry form
   - Preview functionality
   - Google Business import
   - Form validation

3. **My Branches Tab**
   - List of onboarded branches
   - Preview button
   - Branch details
   - Status indicators

**Key Features:**
- Device mode preview (Desktop/Tablet/Mobile)
- Temporary preview before creation
- Google Business import with preview
- Real-time statistics

### Scenario 2: Admin Dashboard Showcase

**Login as:** Admin account (create separately)

**What to Show:**
1. **Executive Leaderboard**
   - Rankings by performance
   - Statistics cards
   - Trend indicators
   - Top performers

2. **Branch Management**
   - All branches across brands
   - Assign executives
   - Preview microsites
   - Edit configurations

3. **Analytics Dashboard**
   - Overall statistics
   - Brand performance
   - Lead generation
   - QR code scans

### Scenario 3: Microsite Preview

**What to Show:**
1. **Existing Microsite**
   - Navigate to My Branches
   - Click "Preview" on any branch
   - Switch device modes
   - Show responsiveness

2. **Temporary Preview**
   - Go to Onboard New
   - Fill form partially
   - Click "Preview Microsite"
   - Show how it looks before creation

3. **Google Import Preview**
   - Select "Import from Google"
   - Enter demo Business ID
   - Fetch data
   - Preview imported microsite
   - Show one-click import

### Scenario 4: Performance Tracking

**What to Show:**
1. **Executive Stats**
   - Total onboarded
   - Active vs inactive
   - Monthly trends
   - Success rate

2. **Leaderboard**
   - Top performers
   - Rankings
   - Badges for top 3
   - Performance comparison

3. **Branch Analytics**
   - Page views
   - Lead generation
   - QR code scans
   - Conversion rates

---

## 🎨 Visual Highlights

### Color-Coded Brands
Each brand has distinct colors for easy identification:
- **TechVision:** Blue theme
- **Spice Garden:** Red theme
- **FitLife:** Green theme
- **Prime Properties:** Purple theme
- **HealthCare Plus:** Cyan theme

### Status Indicators
- **Active:** Green badge
- **Inactive:** Red badge
- **Trending Up:** Green arrow
- **Trending Down:** Red arrow

### Device Modes
- **Desktop:** Full width view
- **Tablet:** 768px width
- **Mobile:** 375px width

---

## 📱 Demo Flow

### Complete Demo (15-20 minutes)

**Part 1: Executive Portal (5 min)**
1. Login as executive
2. Show dashboard statistics
3. Navigate through tabs
4. Preview existing branch
5. Show onboarding form

**Part 2: Onboarding Process (5 min)**
1. Fill manual entry form
2. Preview before creating
3. Show Google import
4. Fetch demo business data
5. Preview imported data
6. Create branch

**Part 3: Performance Tracking (5 min)**
1. Show executive leaderboard
2. Explain metrics
3. Show trends
4. Compare executives
5. Show branch statistics

**Part 4: Microsite Preview (5 min)**
1. Preview in different devices
2. Show responsiveness
3. Test features
4. Show live microsite
5. Explain customization

---

## 💡 Key Talking Points

### For Executives
- "Streamlined onboarding process"
- "Preview before committing"
- "Import from Google Business"
- "Track your performance"
- "Mobile-friendly interface"

### For Management
- "Complete visibility into onboarding"
- "Performance-based rankings"
- "Quality control with preview"
- "Data-driven decisions"
- "Scalable solution"

### For Clients
- "Professional microsites"
- "Mobile-responsive design"
- "Easy to update"
- "Lead capture built-in"
- "Analytics included"

---

## 🔧 Customization for Demo

### Adjust Performance Data

Edit `prisma/seed-demo.ts` to change:
- Number of branches per executive
- Onboarding dates
- Success rates
- Lead counts
- Analytics events

### Add More Brands

Add new brands in the seed script:
```typescript
prisma.brand.create({
  data: {
    name: 'Your Brand Name',
    slug: 'demo-yourbrand',
    // ... other fields
  },
})
```

### Modify Microsite Configs

Update branch configurations:
- Hero section content
- Services/products
- Gallery images
- Contact information
- Business hours

---

## 🎯 Demo Checklist

### Before Demo
- [ ] Seed demo data
- [ ] Start application
- [ ] Test login credentials
- [ ] Check all features work
- [ ] Prepare talking points

### During Demo
- [ ] Show executive portal
- [ ] Demonstrate onboarding
- [ ] Preview functionality
- [ ] Performance tracking
- [ ] Microsite preview

### After Demo
- [ ] Answer questions
- [ ] Provide documentation
- [ ] Discuss customization
- [ ] Next steps

---

## 🐛 Troubleshooting

### Demo Data Not Showing

**Problem:** After seeding, data doesn't appear

**Solutions:**
1. Check database connection
2. Verify Prisma client generated
3. Check for errors in seed script
4. Restart application

### Login Not Working

**Problem:** Can't login with demo credentials

**Solutions:**
1. Verify email is correct
2. Check password: Demo@123
3. Ensure user was created
4. Check database

### Preview Not Loading

**Problem:** Preview modal doesn't show microsite

**Solutions:**
1. Check branch has micrositeConfig
2. Verify slug is correct
3. Check browser console
4. Try different branch

---

## 📞 Support

### Documentation
- **User Guide:** `docs/EXECUTIVE_PORTAL_GUIDE.md`
- **Preview Guide:** `docs/MICROSITE_PREVIEW_GUIDE.md`
- **Implementation:** Various `*_IMPLEMENTATION.md` files

### Quick Help
- Check console for errors
- Verify database connection
- Ensure all dependencies installed
- Review seed script output

---

## 🎉 Success Metrics

### What to Highlight

**Efficiency:**
- "Onboard a branch in under 5 minutes"
- "Preview before committing"
- "Import from Google in seconds"

**Quality:**
- "85%+ success rate"
- "Professional microsites"
- "Mobile-responsive design"

**Visibility:**
- "Real-time performance tracking"
- "Complete analytics"
- "Executive leaderboard"

**Scalability:**
- "Unlimited executives"
- "Multiple brands"
- "Thousands of branches"

---

## 📈 Next Steps

### After Demo

1. **Discuss Requirements**
   - Number of executives
   - Number of brands
   - Expected volume

2. **Customization**
   - Branding requirements
   - Custom features
   - Integration needs

3. **Deployment**
   - Hosting options
   - Domain setup
   - SSL certificates

4. **Training**
   - Executive training
   - Admin training
   - Documentation

5. **Go Live**
   - Data migration
   - Testing
   - Launch

---

**Demo Version:** 1.0.0
**Last Updated:** November 3, 2025
**Status:** ✅ Ready for Showcase
