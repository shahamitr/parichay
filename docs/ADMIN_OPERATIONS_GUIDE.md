# Admin Operations Guide

This guide covers day-to-day operations for administrators of the Parichay platform.

## Logging In

1. Navigate to `/login`
2. Enter your admin email and password
3. If MFA is enabled, enter the 6-digit code from your authenticator app
4. You'll be redirected to `/admin/dashboard`

## Dashboard Overview

The admin dashboard shows:
- Total profiles/brands managed
- Lead statistics (new, contacted, converted)
- Revenue overview (subscriptions, payments)
- Recent activity feed

## User Management (`/admin/users`)

### View Users
- Search by name, email, or brand
- Filter by role (Super Admin, Brand Manager, Branch Admin, Executive)
- Filter by status (active, inactive, deleted)

### Create User
1. Click "Add User"
2. Fill in: First name, Last name, Email, Password, Role
3. Optionally assign to a brand
4. Click "Create"

### Edit User
- Change role (requires request signing for security)
- Update contact info
- Toggle active/inactive status
- Reset password

### Delete User
- Soft-deletes the user (30-day recovery window)
- User can be restored from the "Deleted" filter tab

## Brand Management (`/admin/brands`)

### Create Brand
1. Navigate to Brands section
2. Click "Create Brand"
3. Enter brand name (auto-generates slug)
4. Set color theme (primary, secondary, accent)
5. Assign owner (Brand Manager user)

### Brand Settings
- Logo upload
- Color theme customization
- Custom domain configuration (Business plan+)
- Festival theming activation

## Branch/Microsite Management (`/admin/microsite`)

### Create Branch
1. Select a brand
2. Enter branch details: name, slug, address, contact, business hours
3. Configure microsite sections (drag-and-drop order)
4. Preview before publishing

### Microsite Builder
- **Sections**: Hero, About, Services, Gallery, Contact, Testimonials, FAQ, Team, etc.
- **Layout options**: Modern Business, Creative Portfolio, Minimal Elegant
- **Features per section**: Enable/disable, reorder, customize content

### QR Code Generation (`/admin/qr-codes`)
- Generate QR codes linking to any branch microsite
- Download in PNG format
- Track scan analytics

## Subscription & Billing (`/admin/subscription`)

### View Current Plan
- Plan name, price, duration
- Days remaining until renewal
- License key

### Upgrade/Change Plan
1. View available plans with feature comparison
2. Click "Subscribe Now" or "Switch Plan"
3. Complete payment via Razorpay
4. Subscription activates immediately

### Invoices
- View all past invoices in table format
- Download PDF invoices for each payment
- Invoice includes GST breakdown, license key, plan details

## Lead Management (`/admin/leads`)

### View Leads
- All leads captured from microsite contact forms
- Filter by branch, status, date range
- Search by name, email, phone

### Lead Status Flow
1. **New** — Just received
2. **Contacted** — First response sent
3. **Qualified** — Confirmed interest
4. **Converted** — Became a customer
5. **Lost** — Did not convert

### Actions
- Update status
- Add notes
- Send WhatsApp/Email follow-up
- Convert to customer (CRM)

## Analytics (`/admin/analytics`)

### Available Metrics
- Page views (daily, weekly, monthly)
- QR code scans
- Lead submissions
- Conversion rates
- Top-performing branches

### Export
- Export analytics data as CSV
- Date range selection

## System Settings (`/admin/settings`)

### General
- Platform name, support email, WhatsApp number
- Default timezone

### Security
- Enable/disable MFA requirement
- Session timeout duration
- View audit logs (`/admin/audit-logs`)

### Notifications
- Email notification preferences
- SMS notification toggle
- In-app notification settings

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open command palette |
| `Ctrl+B` | Toggle sidebar |
| `?` | Show all shortcuts |

## Troubleshooting

### Can't login
- Check if account is active (contact super admin)
- Try "Forgot Password" flow
- If locked out, wait 15 minutes (account lockout after 5 failed attempts)

### Microsite not updating
- Clear browser cache
- Check if branch is marked as "Active"
- Verify the brand has an active subscription

### Payment failed
- Ensure Razorpay credentials are configured
- Check browser console for errors
- Contact support with the order ID
