# 🎬 Zintro Demo Setup Guide

This guide will help you set up comprehensive demo data to showcase all features of the Zintro platform.

## 📋 Prerequisites

- Database is set up and running
- Prisma is configured
- Environment variables are set

## 🚀 Quick Setup

### 1. Run the Demo Seed Script

```bash
# Navigate to project directory
cd onetouch-bizcard

# Run the demo seed
npx ts-node prisma/seed-demo.ts
```

### 2. Start the Application

```bash
npm run dev
```

### 3. Login

Navigate to `http://localhost:3000/login`

**Credentials:**
- Email: `admin@zintro.com`
- Password: `Demo@123`

## 🏢 Demo Data Overview

### Brands & Branches

The demo includes 3 diverse brands across different industries:

#### 1. **TechVision Solutions** (IT Services Company)
- **Slug**: `techvision`
- **Tagline**: "Innovating Tomorrow, Today"
- **Color Theme**: Blue (#2563EB)
- **Branches**:
  - **Mumbai Office** (`/techvision/mumbai`)
    - 5 services (Cloud Migration, AI/ML, Web Dev, Mobile Apps, Cybersecurity)
    - Appointment booking enabled
    - Price range: ₹75,000 - ₹250,000
  - **Bangalore Office** (`/techvision/bangalore`)
    - 2 services (AI R&D, Data Science)
    - Innovation hub focus

#### 2. **Green Earth Organics** (Organic Food Store)
- **Slug**: `greenearth`
- **Tagline**: "Pure. Natural. Organic."
- **Color Theme**: Green (#10B981)
- **Branches**:
  - **Pune Store** (`/greenearth/pune`)
    - 5 products (Vegetables, Fruits, Dairy, Grains, Honey)
    - Subscription-based model
    - Price range: ₹350 - ₹799
    - Appointment booking for consultations

#### 3. **Elite Fitness Studio** (Gym Chain)
- **Slug**: `elitefitness`
- **Tagline**: "Transform Your Body, Transform Your Life"
- **Color Theme**: Red (#EF4444)
- **Branches**:
  - **Delhi Central** (`/elitefitness/delhi-central`)
    - 6 services (Gym, Personal Training, Yoga, Zumba, Nutrition, CrossFit)
    - Price range: ₹1,499 - ₹15,000
    - Appointment booking for consultations

## 🌐 Demo Microsite URLs

Access these URLs after starting the application:

```
http://localhost:3000/techvision/mumbai
http://localhost:3000/techvision/bangalore
http://localhost:3000/greenearth/pune
http://localhost:3000/elitefitness/delhi-central
```

## 📊 Sample Data Included

### Subscription Plans
- ✅ **Starter** - ₹499/month (1 branch)
- ✅ **Basic** - ₹999/month (3 branches)
- ✅ **Professional** - ₹1,999/month (10 branches, custom domain)
- ✅ **Enterprise** - ₹4,999/month (unlimited branches, white-label)

### Sample Leads (5)
- Rahul Sharma - Cloud migration inquiry (TechVision Mumbai)
- Priya Patel - AI/ML consultation (TechVision Bangalore)
- Amit Kumar - Organic vegetable subscription (Green Earth Pune)
- Sneha Reddy - Personal training (Elite Fitness Delhi)
- Vikram Singh - Corporate membership (Elite Fitness Delhi)

### Analytics Events (24)
- Page views across all branches
- Click events (Call, WhatsApp, Email)
- QR code scans
- Lead submissions

## 💡 Features to Demonstrate

### 1. Multi-Brand Management
- Show 3 different brands with unique branding
- Different color themes applied automatically
- Brand-specific taglines and identities

### 2. Interactive Product Catalogs
- **TechVision**: Filter by category (cloud, ai, development, security)
- **Green Earth**: Filter by category (vegetables, fruits, dairy, grains, specialty)
- **Elite Fitness**: Filter by category (membership, training, classes, wellness)
- Search functionality
- Grid/List view toggle
- Product detail modals with features
- Availability indicators (Available, Limited Stock)

### 3. Appointment Booking
- All branches have custom appointment booking
- Different time slots per branch
- Form validation
- Email confirmations

### 4. Lead Capture
- Custom form fields per branch
- Lead routing to email/WhatsApp
- Source tracking (microsite, QR code, social)

### 5. Contact Actions
- Call Now buttons
- WhatsApp integration
- Email links
- Google Maps directions

### 6. Business Information
- Business hours display
- Address with map integration
- Social media links
- Contact information

### 7. Analytics Dashboard
- Page view tracking
- Click analytics
- QR code scan tracking
- Lead conversion metrics

## 🎯 Demo Flow Suggestions

### Flow 1: IT Services Company
1. Login as admin
2. Navigate to TechVision Mumbai microsite
3. Show interactive product catalog with 5 services
4. Filter by "AI" category
5. Click on "AI/ML Solutions" to show product modal
6. Demonstrate appointment booking
7. Submit a lead form
8. Check analytics dashboard

### Flow 2: Organic Food Store
1. Navigate to Green Earth Pune microsite
2. Show product catalog with subscription model
3. Filter by "fruits" category
4. Show "Limited Stock" indicator on Organic Honey
5. Demonstrate WhatsApp inquiry button
6. Book a consultation appointment
7. Show business hours (open 7 days)

### Flow 3: Fitness Center
1. Navigate to Elite Fitness Delhi microsite
2. Show 6 different fitness services
3. Filter by "classes" category
4. Show pricing range (₹1,499 - ₹15,000)
5. Demonstrate appointment booking for free consultation
6. Show extended business hours (5 AM - 10 PM)
7. Submit lead with fitness goals

### Flow 4: Multi-Branch Management
1. Show TechVision with 2 branches
2. Compare Mumbai (5 services) vs Bangalore (2 services)
3. Show different focus areas
4. Demonstrate brand consistency across branches

### Flow 5: Analytics & Reporting
1. Open analytics dashboard
2. Show page views per branch
3. Show click analytics breakdown
4. Show QR code scan tracking
5. Show lead conversion rates
6. Export data to CSV

## 📱 QR Code Demo

Each branch automatically has QR codes generated. To demonstrate:

1. Go to branch settings
2. Generate QR code
3. Download in PNG/SVG/PDF format
4. Scan with mobile device
5. Show mobile-responsive microsite
6. Track QR scan in analytics

## 🎨 Customization Demo

Show how easy it is to customize:

1. Edit branch microsite configuration
2. Change hero title and subtitle
3. Enable/disable sections
4. Add/remove products
5. Update contact information
6. Change appointment slots
7. Preview changes in real-time
8. Publish updates

## 🔐 User Roles Demo

### Super Admin
- Full access to all brands
- Can create new brands
- Manage subscription plans
- View platform-wide analytics

### Brand Manager (Future)
- Access to specific brand
- Manage all branches
- View brand analytics
- Manage brand users

### Branch Admin (Future)
- Access to specific branch
- Edit microsite content
- View branch analytics
- Manage leads

## 📈 Success Metrics to Highlight

- **4 branches** set up in minutes
- **20+ products/services** showcased
- **5 leads** captured automatically
- **24 analytics events** tracked
- **3 different industries** represented
- **100% mobile responsive**
- **SEO optimized** URLs
- **Zero coding** required

## 🛠️ Troubleshooting

### If seed fails:
```bash
# Reset database
npx prisma migrate reset

# Run seed again
npx ts-node prisma/seed-demo.ts
```

### If login doesn't work:
- Verify email: `admin@zintro.com`
- Verify password: `Demo@123`
- Check database connection
- Verify user was created in database

### If microsites don't load:
- Check branch slugs are correct
- Verify brand slugs are correct
- Check database has branch data
- Verify Next.js dynamic routes are working

## 📞 Support

For issues or questions:
- Check logs: `npm run dev`
- Verify database: Check Prisma Studio
- Review seed output for errors

---

**Zintro** - Your smart digital introduction

*Demo data is designed to showcase all platform features across different industries and use cases.*
