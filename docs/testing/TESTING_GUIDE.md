# Testing Guide - Quick Feature Tests

## 🧪 Feature Testing Checklist

### 1. Executive Login & Dashboard ✅

**Steps:**
1. Go to http://localhost:3000/login
2. Login with: `john.smith@demo.executive` / `Demo@123`
3. Should redirect to `/executive`
4. Check dashboard shows:
   - Total Onboarded count
   - Active Branches count
   - This Month count
   - Last Month count
   - Success rate progress bar
   - Monthly progress bar

**Expected Result:** Dashboard loads with statistics

---

### 2. My Branches - Preview Feature ✅

**Steps:**
1. Click "My Branches" tab
2. You should see 2-3 branch cards
3. Click "Preview" button on any branch
4. Preview modal opens
5. Try switching device modes:
   - Click Desktop icon (🖥️)
   - Click Tablet icon (📱)
   - Click Mobile icon (📱)
6. Click "Open Live" to see actual microsite

**Expected Result:** Preview works in all device modes

---

### 3. Onboard New - Manual Entry ✅

**Steps:**
1. Click "Onboard New" tab
2. Ensure "Manual Entry" is selected
3. Fill in the form:
   - Select Brand: TechVision Solutions
   - Branch Name: Test Branch
   - Address: 123 Test Street
   - City: Mumbai
   - State: Maharashtra
   - ZIP: 400001
   - Phone: +91 98765 43210
   - Email: test@example.com
4. Click "Preview Microsite" button
5. Preview modal opens with temporary data
6. Switch device modes to test
7. Close preview
8. Click "Create Branch"

**Expected Result:** Branch created successfully

---

### 4. Onboard New - Google Import ✅

**Steps:**
1. Click "Onboard New" tab
2. Click "Import from Google" button
3. Enter any text in Business ID field
4. Click "Fetch" button
5. Mock data appears
6. Review the imported data
7. Click "Preview Microsite"
8. See how imported data looks
9. Close preview
10. Click "Import & Create"

**Expected Result:** Branch created from imported data

---

### 5. Device Mode Preview ✅

**Steps:**
1. Go to "My Branches"
2. Click "Preview" on any branch
3. Test each device mode:
   - **Desktop**: Should show full width
   - **Tablet**: Should show 768px width
   - **Mobile**: Should show 375px width (iPhone size)
4. Click "Refresh" button
5. Click "Open in New Tab"

**Expected Result:** All device modes work correctly

---

### 6. Performance Statistics ✅

**Steps:**
1. Go to "Dashboard" tab
2. Check statistics:
   - Total Onboarded: Should show 2-3
   - Active Branches: Should show 2-3
   - This Month: Should show count
   - Success Rate: Should show percentage
3. Check trend indicators (↑ or ↓)
4. Click "Refresh Stats" button

**Expected Result:** Stats update correctly

---

### 7. Logout ✅

**Steps:**
1. Click logout button (top right)
2. Should redirect to login page
3. Try accessing `/executive` directly
4. Should redirect back to login

**Expected Result:** Logout works, routes protected

---

## 🔍 What to Look For

### Visual Elements
- ✅ Colors match brand themes
- ✅ Icons display correctly
- ✅ Buttons have hover effects
- ✅ Cards have shadows
- ✅ Status badges show (Active/Inactive)
- ✅ Trend arrows display (↑/↓)

### Functionality
- ✅ Forms validate input
- ✅ Preview modal opens/closes
- ✅ Device modes switch smoothly
- ✅ Data loads correctly
- ✅ Navigation works
- ✅ Buttons are clickable

### Responsiveness
- ✅ Works on desktop
- ✅ Works on tablet
- ✅ Works on mobile
- ✅ Preview shows different sizes

---

## 🐛 Common Issues & Fixes

### Issue: Preview not loading
**Fix:** Refresh the page, check console for errors

### Issue: Stats showing 0
**Fix:** Make sure demo data was seeded

### Issue: Can't login
**Fix:** Check email/password, ensure database is running

### Issue: Device modes not switching
**Fix:** Close and reopen preview modal

---

## ✅ Quick Test (5 minutes)

1. **Login** ✓
2. **View Dashboard** ✓
3. **Preview a Branch** ✓
4. **Switch Device Modes** ✓
5. **Try Onboarding** ✓
6. **Check Stats** ✓
7. **Logout** ✓

---

**All features working?** 🎉 You're ready to demo!
