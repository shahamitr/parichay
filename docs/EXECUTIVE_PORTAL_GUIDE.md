# Executive Portal - User Guide

## Overview

The Executive Portal is a dedicated interface for executives to onboard new microsites and track their performance. It provides a streamlined, focused experience separate from the admin dashboard.

## Table of Contents

1. [Accessing the Portal](#accessing-the-portal)
2. [Portal Features](#portal-features)
3. [Onboarding a New Branch](#onboarding-a-new-branch)
4. [Managing Your Branches](#managing-your-branches)
5. [Tracking Performance](#tracking-performance)
6. [Troubleshooting](#troubleshooting)

---

## Accessing the Portal

### Login

1. Navigate to the login page
2. Enter your executive credentials
3. You'll be automatically redirected to `/executive`

**Note:** Executives cannot access the admin dashboard (`/dashboard`). They are automatically redirected to their portal.

### URL

```
https://yourdomain.com/executive
```

---

## Portal Features

### 1. Dashboard Tab

**What You'll See:**
- Welcome message
- Performance statistics cards:
  - Total Onboarded (all time)
  - Active Branches (with success rate)
  - This Month (with trend)
  - Last Month
- Performance insights with progress bars
- Quick tips for successful onboarding

**Key Metrics:**
- **Success Rate**: Percentage of active branches
- **Monthly Progress**: Current month vs last month
- **Trend Indicators**: Up/down arrows showing performance changes

### 2. Onboard New Tab

**Purpose:** Create new branch microsites

**Form Sections:**
1. **Brand Selection** - Choose which brand the branch belongs to
2. **Branch Details** - Name and URL slug
3. **Address** - Complete physical address
4. **Contact Information** - Phone, WhatsApp, email
5. **Social Media** - Optional social links

**Features:**
- Auto-generates URL slug from branch name
- Form validation
- Success confirmation
- Automatic executive assignment

### 3. My Branches Tab

**What You'll See:**
- Grid of all branches you've onboarded
- Branch cards showing:
  - Branch name and brand
  - Active/Inactive status
  - Complete address
  - Contact information
  - Onboarding date
  - Link to view microsite

**Actions:**
- View microsite (opens in new tab)
- Refresh list

---

## Onboarding a New Branch

### Step-by-Step Guide

#### 1. Select Brand
```
Click "Onboard New" tab
→ Choose brand from dropdown
```

#### 2. Enter Branch Details
```
Branch Name: Downtown Location
URL Slug: downtown-location (auto-generated)
```

**Tips:**
- Use descriptive names
- URL slug should be lowercase with hyphens
- Slug is used in the microsite URL

#### 3. Complete Address
```
Street: 123 Main Street
City: Mumbai
State: Maharashtra
ZIP Code: 400001
Country: India
```

**Required Fields:**
- All address fields are mandatory
- Ensure accuracy for Google Maps integration

#### 4. Add Contact Information
```
Phone: +91 98765 43210
WhatsApp: (optional, uses phone if empty)
Email: contact@example.com
```

**Tips:**
- Use format: +[country code] [number]
- WhatsApp defaults to phone number if not provided
- Email must be valid format

#### 5. Social Media (Optional)
```
Facebook: https://facebook.com/yourpage
Instagram: https://instagram.com/yourprofile
LinkedIn: https://linkedin.com/company/yourcompany
Twitter: https://twitter.com/yourhandle
```

**Tips:**
- Use complete URLs
- These are optional but recommended
- Links appear on the microsite

#### 6. Submit
```
Click "Create Branch"
→ Wait for confirmation
→ Automatically redirected to "My Branches"
```

### What Happens After Submission?

1. **Branch Created** - New branch record in database
2. **Executive Assigned** - You're automatically assigned as the onboarding executive
3. **Microsite Generated** - Basic microsite created with default template
4. **Notification Sent** - You receive a notification
5. **Stats Updated** - Your performance stats are updated

### Default Microsite Configuration

New branches get:
- Modern Business template
- Hero section with branch name
- Contact section enabled
- Lead form enabled
- Google Maps integration
- Empty services section (to be configured later)

---

## Managing Your Branches

### Viewing Your Branches

1. Click "My Branches" tab
2. See all branches you've onboarded
3. Each card shows:
   - Branch name and brand
   - Status (Active/Inactive)
   - Address
   - Contact info
   - Onboarding date

### Branch Status

**Active (Green Badge):**
- Branch is live and operational
- Microsite is accessible
- Appears in search results

**Inactive (Red Badge):**
- Branch is disabled
- Microsite may not be accessible
- Needs attention

### Viewing Microsites

1. Find the branch card
2. Click "View Microsite" button
3. Opens in new tab
4. See the live microsite

**URL Format:**
```
https://yourdomain.com/microsites/[brand-id]/[branch-slug]
```

### Refreshing Data

Click the "Refresh" button to:
- Update branch list
- Reload latest status
- Sync with database

---

## Tracking Performance

### Dashboard Statistics

#### Total Onboarded
- All branches you've ever onboarded
- Lifetime metric
- Includes active and inactive

#### Active Branches
- Currently operational branches
- Shows success rate percentage
- Quality indicator

#### This Month
- Branches onboarded in current month
- Shows trend vs last month
- Performance indicator

#### Last Month
- Previous month's onboarding count
- Comparison baseline

### Performance Insights

#### Success Rate Bar
```
[████████░░] 80%
8 of 10 branches are active
```

**What It Means:**
- Higher is better
- Target: 80%+ success rate
- Indicates onboarding quality

#### Monthly Progress Bar
```
[██████████] 100%
10 branches this month
```

**What It Means:**
- Compares to last month
- Shows growth trend
- Motivational indicator

### Trend Indicators

**Positive Trend (↑):**
- This month > Last month
- Green color
- Shows percentage increase

**Negative Trend (↓):**
- This month < Last month
- Red color
- Shows percentage decrease

**Example:**
```
↑ +25.0% vs last month
```

---

## Best Practices

### Onboarding Quality

1. **Complete All Fields**
   - Don't skip optional fields
   - More information = better microsite
   - Helps clients get found

2. **Verify Information**
   - Double-check phone numbers
   - Confirm email addresses
   - Validate addresses

3. **Test Before Delivery**
   - View the microsite
   - Test all contact methods
   - Check Google Maps location

4. **Follow Up**
   - Contact client after onboarding
   - Ensure they're satisfied
   - Address any issues

### Performance Tips

1. **Set Monthly Goals**
   - Track your progress
   - Aim for consistent growth
   - Celebrate milestones

2. **Maintain Quality**
   - Focus on active branches
   - High success rate > high volume
   - Quality leads to referrals

3. **Stay Organized**
   - Review "My Branches" regularly
   - Keep contact info updated
   - Monitor branch status

4. **Learn and Improve**
   - Analyze your stats
   - Identify patterns
   - Optimize your process

---

## Troubleshooting

### Common Issues

#### Can't Access Portal

**Problem:** Redirected to login or dashboard

**Solutions:**
1. Verify you have EXECUTIVE role
2. Check if you're logged in
3. Clear browser cache
4. Contact administrator

#### Brand Not in Dropdown

**Problem:** Can't find brand to select

**Solutions:**
1. Verify brand exists
2. Check if you're assigned to brand
3. Contact brand manager
4. Refresh the page

#### Form Validation Errors

**Problem:** Can't submit form

**Solutions:**
1. Check all required fields (marked with *)
2. Verify email format
3. Ensure phone number format
4. Check URL format for social media

#### Branch Not Appearing

**Problem:** Created branch doesn't show in "My Branches"

**Solutions:**
1. Click "Refresh" button
2. Check if creation was successful
3. Verify you're logged in as same user
4. Contact support if persists

#### Stats Not Updating

**Problem:** Dashboard shows old numbers

**Solutions:**
1. Click "Refresh Stats" button
2. Log out and log back in
3. Clear browser cache
4. Wait a few minutes for sync

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Please select a brand" | No brand selected | Choose brand from dropdown |
| "Branch name is required" | Empty branch name | Enter branch name |
| "Phone and email are required" | Missing contact info | Fill in phone and email |
| "Complete address is required" | Missing address fields | Fill all address fields |
| "Failed to create branch" | Server error | Try again or contact support |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Navigate between fields |
| Enter | Submit form (when focused on button) |
| Esc | Close modals/dialogs |

---

## Mobile Access

The Executive Portal is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

**Mobile Tips:**
- Use portrait mode for forms
- Landscape mode for dashboard
- Tap to focus fields
- Swipe to scroll

---

## Support

### Getting Help

1. **Check This Guide** - Most questions answered here
2. **Contact Administrator** - For account issues
3. **Brand Manager** - For brand-specific questions
4. **Technical Support** - For system issues

### Reporting Issues

When reporting issues, include:
- Your email address
- What you were trying to do
- Error message (if any)
- Screenshot (if possible)
- Browser and device info

---

## Frequently Asked Questions

### Q: Can I edit a branch after creating it?

**A:** Currently, branch editing is done through the admin dashboard. Contact your administrator for changes.

### Q: How do I delete a branch?

**A:** Only administrators can delete branches. Contact your administrator if needed.

### Q: Can I see other executives' branches?

**A:** No, you can only see branches you've onboarded. Administrators can see all branches.

### Q: What happens if I enter wrong information?

**A:** Contact your administrator to update branch information. It's important to verify before submitting.

### Q: How often are stats updated?

**A:** Stats update in real-time. Click "Refresh" to see latest numbers.

### Q: Can I onboard branches for multiple brands?

**A:** Yes, if you're assigned to multiple brands, you'll see all of them in the dropdown.

### Q: What's a good success rate?

**A:** Aim for 80% or higher. This means 8 out of 10 branches remain active.

### Q: How do I improve my ranking?

**A:** Focus on quality onboarding, maintain high success rate, and consistently onboard new branches.

---

## Updates and Changes

This portal is regularly updated with new features. Check back for:
- New onboarding fields
- Enhanced statistics
- Additional tools
- Performance improvements

---

**Version:** 1.0.0
**Last Updated:** November 3, 2025
**For:** Executive Users
