# Quick Reference Guide - All Features

> **Quick access to all Parichay features and guides**

## 🚀 Getting Started

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Setup database
npm run db:setup

# 4. Start development
npm run dev
```

**Login:** http://localhost:3000
- Admin: admin@parichay.io / Admin@123
- Demo: demo@example.com / Demo@123

---

## 🔐 Authentication Quick Reference

### Login Flow
1. Visit `/login`
2. Enter email/password
3. Complete MFA if enabled
4. Redirected to dashboard

### Setup MFA
1. Dashboard → Settings → Security
2. Click "Enable MFA"
3. Scan QR code with authenticator app
4. Enter verification code
5. Save backup codes

### Password Reset
1. Click "Forgot Password" on login
2. Enter email
3. Check email for reset link
4. Set new password

**API Endpoints:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/mfa/setup` - Setup MFA
- `POST /api/auth/forgot-password` - Reset password

---

## 📊 Dashboard Quick Reference

### User Dashboard
- **Overview** - Key metrics and stats
- **Brands** - Manage brands and branches
- **Analytics** - View performance data
- **Settings** - Account configuration

### Admin Dashboard
- **Users** - User management
- **Brands** - All brands overview
- **System** - System settings
- **Billing** - Payment management
- **Analytics** - Platform analytics

### Navigation
- `/dashboard` - User dashboard
- `/admin` - Admin dashboard
- `/agency` - Agency portal (white-label)
- `/brands` - Brand management
- `/analytics` - Analytics

---

## 🎨 Microsite Builder Quick Reference

### Available Sections
1. **Hero** - Main banner with CTA
2. **About** - Company description
3. **Services** - Service listings
4. **Products** - Product showcase
5. **Team** - Team members
6. **Testimonials** - Customer reviews
7. **Gallery** - Image gallery
8. **Video** - Video embed
9. **Contact** - Contact form
10. **Social Links** - Social media
11. **Location** - Map integration
12. **FAQ** - Q&A section
13. **Pricing** - Pricing tables
14. **Blog** - Blog posts
15. **Portfolio** - Projects

### Quick Actions
- **Add Section** - Click "+" button
- **Reorder** - Drag and drop sections
- **Edit** - Click section to edit
- **Delete** - Click trash icon
- **Preview** - Click "Preview" button
- **Publish** - Click "Publish" button

### Customization
- **Colors** - Settings → Theme → Colors
- **Fonts** - Settings → Theme → Typography
- **Logo** - Settings → Branding → Logo
- **Favicon** - Settings → Branding → Favicon
- **SEO** - Settings → SEO

---

## 📈 Analytics Quick Reference

### Key Metrics
- **Page Views** - Total visits
- **QR Scans** - QR code scans
- **Contact Saves** - vCard downloads
- **Link Clicks** - External link clicks
- **Form Submissions** - Contact form submissions

### View Analytics
1. Dashboard → Analytics
2. Select date range
3. Choose brand/branch
4. View charts and data
5. Export report

### Track Custom Events
```typescript
// Track page view
await trackEvent({
  eventType: 'PAGE_VIEW',
  brandId: 'brand_id',
  metadata: { page: '/about' }
});

// Track link click
await trackEvent({
  eventType: 'LINK_CLICK',
  brandId: 'brand_id',
  metadata: { url: 'https://example.com' }
});
```

---

## 🏢 White-Label Quick Reference

### Setup Agency
```typescript
import { createTenant } from '@/lib/tenant/tenant-service';

const agency = await createTenant({
  name: 'My Agency',
  slug: 'myagency',
  brandName: 'Agency Brand',
  logo: 'https://example.com/logo.png',
  primaryColor: '#FF6B35',
  plan: 'AGENCY_PRO',
  clientLimit: 50,
}, ownerId);
```

### Add Client
1. Agency Dashboard → Clients
2. Click "Add Client"
3. Enter client details
4. Select brand
5. Set monthly fee
6. Click "Add Client"

### Customize Branding
1. Agency Dashboard → Settings
2. Upload logo
3. Set colors (primary, secondary, accent)
4. Set brand name
5. Configure domain
6. Save changes

---

## 🎯 Lead Management Quick Reference

### Capture Leads
- **Contact Form** - Microsite contact section
- **QR Scan** - Track QR code scans
- **vCard Save** - Track contact saves
- **Link Click** - Track external links

### View Leads
1. Dashboard → Leads
2. Filter by source/status
3. View lead details
4. Export leads

### Lead Actions
- **Assign** - Assign to team member
- **Status** - Update lead status
- **Notes** - Add notes
- **Follow-up** - Schedule follow-up
- **Export** - Export to CSV

---

## 🎨 Design System Quick Reference

### Colors
```css
/* Primary Colors */
--primary: #3B82F6;
--secondary: #10B981;
--accent: #8B5CF6;

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-900: #111827;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Typography
- **Headings** - Inter font, bold
- **Body** - Inter font, regular
- **Code** - Fira Code, monospace

### Components
- **Buttons** - Primary, secondary, outline, ghost
- **Cards** - Default, hover, active
- **Forms** - Input, select, textarea, checkbox
- **Modals** - Dialog, drawer, sheet
- **Toast** - Success, error, warning, info

---

## 🧪 Testing Quick Reference

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Authentication
```bash
node test-auth-flow.js
```

### Test Features
- **Login** - Visit `/login` and test credentials
- **Register** - Create new account
- **MFA** - Enable and test MFA
- **Dashboard** - Check all dashboard features
- **Builder** - Create and edit microsite
- **Analytics** - View analytics data
- **QR Code** - Generate and scan QR code

---

## 🔧 Admin Tools Quick Reference

### User Management
- **View Users** - Admin → Users
- **Add User** - Click "Add User"
- **Edit User** - Click user → Edit
- **Delete User** - Click user → Delete
- **Reset Password** - Click user → Reset Password

### Brand Management
- **View Brands** - Admin → Brands
- **Add Brand** - Click "Add Brand"
- **Edit Brand** - Click brand → Edit
- **Delete Brand** - Click brand → Delete
- **View Analytics** - Click brand → Analytics

### System Settings
- **Email** - Admin → Settings → Email
- **SMS** - Admin → Settings → SMS
- **Payment** - Admin → Settings → Payment
- **AI** - Admin → Settings → AI
- **Features** - Admin → Settings → Features

---

## 📱 Demo Quick Reference

### Demo Sites
- **Professional** - `/demo/professional`
- **Creative** - `/demo/creative`
- **Minimal** - `/demo/minimal`
- **Bold** - `/demo/bold`
- **Elegant** - `/demo/elegant`

### Demo Data
```bash
# Add demo data
psql -d parichay -f add-comprehensive-demo-data.sql

# Create demo branches
psql -d parichay -f create-demo-branches.sql
```

### Demo Credentials
- **Admin** - admin@parichay.io / Admin@123
- **User** - demo@example.com / Demo@123
- **Agency** - agency@parichay.io / Agency@123

---

## 🎨 Theme Customization Quick Reference

### Change Colors
1. Dashboard → Settings → Theme
2. Click color picker
3. Select color
4. Preview changes
5. Save theme

### Upload Logo
1. Dashboard → Settings → Branding
2. Click "Upload Logo"
3. Select image
4. Crop if needed
5. Save

### Custom CSS
1. Dashboard → Settings → Advanced
2. Add custom CSS
3. Preview changes
4. Save

---

## 📞 SMS Setup Quick Reference

### Configure Twilio
```env
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Send SMS
```typescript
import { sendSMS } from '@/lib/sms';

await sendSMS({
  to: '+1234567890',
  message: 'Hello from Parichay!'
});
```

---

## 🔒 Verification System Quick Reference

### Email Verification
- Automatic on registration
- Resend from profile settings
- Required for certain features

### Phone Verification
- Optional verification
- SMS code sent
- Verify in settings

### Domain Verification
- For custom domains
- DNS TXT record
- Verify in agency settings

---

## 🎉 Festival Theming Quick Reference

### Available Themes
- **Diwali** - Orange, gold, festive
- **Christmas** - Red, green, snow
- **New Year** - Gold, black, celebration
- **Holi** - Colorful, vibrant
- **Eid** - Green, gold, elegant

### Apply Theme
1. Dashboard → Settings → Theme
2. Select festival theme
3. Preview
4. Apply

---

## 🖼️ Placeholder Images Quick Reference

### Image Sizes
- **Hero** - 1920x1080
- **Logo** - 512x512
- **Profile** - 400x400
- **Gallery** - 800x600
- **Thumbnail** - 300x200

### Placeholder Services
- **Unsplash** - `https://source.unsplash.com/1920x1080/?business`
- **Placeholder.com** - `https://via.placeholder.com/1920x1080`
- **Lorem Picsum** - `https://picsum.photos/1920/1080`

---

## 🎯 Accessibility Quick Reference

### WCAG Compliance
- **Color Contrast** - 4.5:1 minimum
- **Keyboard Navigation** - Full support
- **Screen Readers** - ARIA labels
- **Focus Indicators** - Visible focus
- **Alt Text** - All images

### Test Accessibility
- Use keyboard only
- Test with screen reader
- Check color contrast
- Verify ARIA labels
- Test with zoom

---

## 📚 Additional Resources

- **Complete Documentation** - `docs/CONSOLIDATED_DOCUMENTATION.md`
- **Setup Guide** - `SETUP_DATABASE.md`
- **Auth Guide** - `AUTH_GUIDE.md`
- **Admin Guide** - `ADMIN_TOOLS_GUIDE.md`
- **White-Label Guide** - `WHITE_LABEL_PLATFORM_IMPLEMENTATION.md`
- **Testing Guide** - `TESTING_GUIDE.md`

---

**Last Updated:** December 2024
