# Quick Test Guide - New Features

## ✅ What's Been Implemented

1. **QR Codes on Microsites** ✅
2. **URL Shortener API** ✅
3. **Private Mode API** ✅

---

## 🧪 Test 1: QR Code Display

### Steps:
1. Visit: **http://localhost:3001/demo-techvision/mumbai-hq**
2. Scroll down to the **Contact Section**
3. Look for **"Scan to Connect"** box
4. Click **"Show QR"** button
5. QR code should appear
6. Click **"Download QR"** - PNG file downloads
7. Click **"Share Link"** - Copies URL or opens share sheet

### Expected Result:
- ✅ QR code displays
- ✅ Download works
- ✅ Share works

---

## 🧪 Test 2: URL Shortener (API Test)

### Using Browser Console:
```javascript
// 1. Login first and get token
// 2. Create short link
fetch('/api/short-links', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    targetUrl: 'http://localhost:3001/demo-techvision/mumbai-hq'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Short URL:', data.shortUrl);
  console.log('Code:', data.code);
});

// 3. Visit the short URL
// http://localhost:3001/s/[code]
// Should redirect to target URL
```

### Expected Result:
- ✅ Returns short URL like: `http://localhost:3001/s/abc123`
- ✅ Visiting `/s/abc123` redirects to full URL
- ✅ Click counter increments

---

## 🧪 Test 3: Private Mode (API Test)

### Using Browser Console:
```javascript
// 1. Set branch to private
fetch('/api/branches/BRANCH_ID/privacy', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    visibility: 'private',
    accessPassword: 'Test123',
    generateToken: true
  })
})
.then(r => r.json())
.then(data => {
  console.log('Access Token:', data.accessToken);
});

// 2. Verify password
fetch('/api/branches/BRANCH_ID/privacy/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password: 'Test123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Access:', data.access); // Should be "granted"
});
```

### Expected Result:
- ✅ Privacy settings updated
- ✅ Token generated
- ✅ Password verification works

---

## 📊 Check Database

### Verify Short Links Table:
```sql
SELECT * FROM short_links;
```

### Verify Privacy Fields:
```sql
SELECT id, name, visibility, accessToken
FROM branches
WHERE visibility IS NOT NULL;
```

---

## 🎯 Quick Demo URLs

### Working Microsites:
1. http://localhost:3001/demo-techvision/mumbai-hq
2. http://localhost:3001/demo-primeproperties/mumbai
3. http://localhost:3001/demo-healthcareplus/andheri

### All should show:
- ✅ QR Code in Contact section
- ✅ "Show QR" button
- ✅ Download & Share buttons

---

## 🔧 Troubleshooting

### QR Code Not Showing:
1. Check browser console for errors
2. Verify `/api/qrcodes` endpoint is working
3. Check if branch ID is valid

### Short Links Not Working:
1. Check database table exists: `SHOW TABLES LIKE 'short_links';`
2. Verify migration ran successfully
3. Check API endpoint: `/api/short-links`

### Private Mode Not Working:
1. Check branches table has new columns:
   ```sql
   DESCRIBE branches;
   ```
2. Look for: visibility, accessPassword, accessToken
3. Verify migration ran

---

## 📝 Notes

### Current Status:
- ✅ **Backend APIs**: 100% Complete
- ✅ **QR Display**: Working on microsites
- ⚠️ **Dashboard UI**: Not yet implemented
- ⚠️ **Password Form**: Not yet implemented

### What You Can Do Now:
1. ✅ See QR codes on all microsites
2. ✅ Download QR codes
3. ✅ Create short links via API
4. ✅ Set privacy settings via API
5. ❌ Manage short links in dashboard (UI needed)
6. ❌ Set privacy in dashboard (UI needed)
7. ❌ Enter password on private microsites (UI needed)

### Time to Complete UI:
- Short Links Manager: 2-3 hours
- Privacy Settings: 2-3 hours
- Password Form: 1-2 hours
**Total: 5-8 hours**

---

## ✅ Success Criteria

### Feature is Working If:
1. **QR Codes**:
   - ✅ Visible on Contact section
   - ✅ Can download PNG
   - ✅ Can share link

2. **Short Links**:
   - ✅ API creates short link
   - ✅ `/s/[code]` redirects
   - ✅ Clicks are tracked

3. **Private Mode**:
   - ✅ API sets visibility
   - ✅ Password is hashed
   - ✅ Token is generated
   - ✅ Verification works

---

**Server Running**: http://localhost:3001

**Test Now!** Visit any demo microsite and scroll to Contact section to see QR codes!

---

**Last Updated:** November 26, 2025
