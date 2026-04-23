# Google Maps Integration Setup

This guide explains how to set up Google Maps integration for your microsite generator app.

## Overview

The app includes enhanced Google Maps functionality that provides:
- Interactive maps with custom markers
- Directions integration
- Address copying
- Fallback to iframe embed when API key is not configured

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for enhanced features)

4. Create credentials:
   - Go to "Credentials" in the sidebar
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### 2. Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. In the Google Cloud Console, click on your API key
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain(s):
     - `localhost:3000/*` (for development)
     - `yourdomain.com/*` (for production)
     - `*.yourdomain.com/*` (for subdomains)

3. Under "API restrictions":
   - Select "Restrict key"
   - Choose the APIs you enabled above

### 3. Add API Key to Environment

Add your API key to your environment variables:

```bash
# In your .env.local file
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Important**: The variable must start with `NEXT_PUBLIC_` to be accessible in the browser.

### 4. Restart Your Application

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

### Enhanced Google Maps Component

The `GoogleMap` component provides:

- **Interactive Map**: Full Google Maps with zoom, pan, and street view
- **Custom Markers**: Branded markers using your primary color
- **Info Windows**: Click markers to see business information
- **Directions Button**: Direct integration with Google Maps for navigation
- **Copy Address**: One-click address copying to clipboard
- **Responsive Design**: Works on all device sizes
- **Fallback Support**: Automatically falls back to iframe embed if API key is missing

### Location Section

The `LocationSection` component includes:

- **Full-width Interactive Map**: 500px height with all controls
- **Address Card**: Formatted address with directions button
- **Contact Information**: Phone and WhatsApp integration
- **Business Hours**: Operating hours display
- **Quick Actions**: Copy address and open in Google Maps

## Usage

### In Contact Section

The enhanced map is automatically used in the ContactSection when `showMap` is enabled:

```typescript
// In branch micrositeConfig
{
  sections: {
    contact: {
      enabled: true,
      showMap: true, // This enables the enhanced map
      // ... other config
    }
  }
}
```

### As Standalone Location Section

Add the location section to your microsite:

```typescript
// In branch micrositeConfig sectionOrder
{
  sectionOrder: [
    { id: 'hero', enabled: true },
    { id: 'about', enabled: true },
    { id: 'services', enabled: true },
    { id: 'location', enabled: true }, // Add this
    { id: 'contact', enabled: true },
    // ... other sections
  ]
}
```

## Troubleshooting

### Map Not Loading

1. **Check API Key**: Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
2. **Check Console**: Look for JavaScript errors in browser console
3. **Verify APIs**: Ensure Maps JavaScript API and Geocoding API are enabled
4. **Check Restrictions**: Verify your domain is allowed in API key restrictions
5. **Check Billing**: Ensure billing is enabled for your Google Cloud project

### Geocoding Errors

If addresses aren't found:
1. Ensure address format is complete: `street, city, state zipcode, country`
2. Check Geocoding API is enabled and has quota
3. Verify address exists in Google Maps

### Fallback Behavior

If the API key is missing or invalid, the component automatically falls back to:
- iframe embed for basic map display
- Direct links to Google Maps for directions
- All functionality remains available

## Cost Considerations

Google Maps API usage is billed based on:
- **Map loads**: Each time a map is displayed
- **Geocoding requests**: Each time an address is converted to coordinates

For typical microsite usage:
- Small sites: Usually within free tier ($200/month credit)
- Medium sites: ~$1-10/month
- Large sites: Monitor usage in Google Cloud Console

## Security Best Practices

1. **Restrict API Key**: Always set domain restrictions
2. **Monitor Usage**: Set up billing alerts
3. **Use Environment Variables**: Never commit API keys to code
4. **Regular Rotation**: Consider rotating API keys periodically

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Google Cloud Console settings
3. Test with a simple address first
4. Ensure your billing account is active

The enhanced Google Maps integration provides a professional, interactive experience for your microsite visitors while maintaining fallback compatibility for all scenarios.