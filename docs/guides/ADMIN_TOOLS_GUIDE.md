# Admin Tools Guide

## 🎯 Overview

The Admin Tools page provides powerful features to help administrators quickly create and manage content:

1. **Google Business Import** - Quickly create brand pages from Google Business Profile
2. **AI Content Generator** - Generate professional content using AI

## 🔐 Access

**URL**: http://localhost:3000/dashboard/tools

**Required Role**:
- SUPER_ADMIN
- BRAND_MANAGER

**Location in Dashboard**:
- Sidebar → Tools (Admin section)

## 🚀 Features

### 1. Google Business Import

#### What It Does
Automatically imports business information from Google Business Profile to quickly create a complete brand page with microsite.

#### How to Use

1. **Navigate to Tools**
   - Login as admin
   - Click "Tools" in the sidebar
   - Select "Google Business Import" tab

2. **Enter Business ID**
   - Enter Google Business Profile ID or URL
   - Example formats:
     - Business ID: `ChIJN1t_tDeuEmsRUsoyG83frY4`
     - Google Maps URL: `https://maps.google.com/?cid=...`
     - Googess URL: `https://www.google.com/maps/place/...`

3. **Fetch Business Data**
   - Click "Fetch" button
   - Wait for data to load (1-2 seconds)
   - Review imported information

4. **Preview Microsite**
   - Click "Preview Microsite" to see how it will look
   - Review all sections and content
   - Close preview when satisfied

5. **Import & Create**
   - Click "Import & Create" button
   - System creates:
     - New brand (if needed)
     - New branch with imported data
     - Complete microsite configuration
   - Success message appears

#### What Gets Imported

✅ **Business Information**
- Business name and category
- Complete address and location
- Phone number and website
- Business description

✅ **Operating Hours**
- Full week schedule
- Open/close times
- Closed days

✅ **Media**
- Business photos
- Logo (if available)
- Gallery images

✅ **Services**
- Service listings
- Descriptions
- Pricing (if available)

✅ **Social Media**
- Facebook
- Instagram
- Twitter
- LinkedIn

✅ **Reviews & Ratings**
- Average rating
- Review count
- (Reviews themselves not imported)

#### Benefits

- ⚡ **Fast Setup**: Create complete brand page in seconds
- 📸 **Auto Import**: No manual data entry needed
- 👁️ **Preview First**: See before you create
- ✅ **Complete Data**: All business info imported
- 🎯 **Accurate**: Data directly from Google

### 2. AI Content Generator

#### What It Does
Generates professional, customized content for various microsite sections using AI.

#### How to Use

1. **Navigate to AI Content**
   - Go to Tools page
   - Select "AI Content Generator" tab

2. **Choose Content Type**
   - Click on the type of content you need:
     - 📢 Headline
     - 📝 About Section
     - ⚙️ Service Description
     - 🛍️ Product Description
     - ✨ Tagline
     - 🎯 Call to Action

3. **Enter Details**
   - **Keywords**: Describe your business
     - Example: "luxury car detailing in Mumbai"
     - Example: "organic restaurant healthy food"
   - **Tone**: Select the writing style
     - Professional
     - Friendly
     - Witty
     - Persuasive
     - Casual

4. **Generate Content**
   - Click "Generate" button
   - Wait for AI to create suggestions (1-2 seconds)
   - Review 3 different variations

5. **Use Content**
   - Click "Use" on your favorite suggestion
   - Content is added to history
   - Copy to clipboard for use in microsites

#### Content Types Explained

**Headline**
- Main title for your business
- Catchy and memorable
- First thing visitors see

**About Section**
- Detailed business description
- Company story and values
- What makes you unique

**Service Description**
- Individual service details
- Benefits and features
- Why customers should choose it

**Product Description**
- Product details and specs
- Key selling points
- Customer benefits

**Tagline**
- Short, memorable phrase
- Captures brand essence
- Used across marketing

**Call to Action**
- Prompts user to take action
- Contact, book, buy, etc.
- Conversion-focused

#### Tone Guide

**Professional**
- Formal and polished
- Industry expertise
- Trust and credibility
- Best for: B2B, corporate, professional services

**Friendly**
- Warm and approachable
- Personal connection
- Helpful and caring
- Best for: Local businesses, services, hospitality

**Witty**
- Clever and entertaining
- Memorable and fun
- Personality-driven
- Best for: Creative businesses, young brands, lifestyle

**Persuasive**
- Action-oriented
- Results-focused
- Compelling and urgent
- Best for: Sales, conversions, promotions

**Casual**
- Relaxed and easy-going
- Conversational tone
- Down-to-earth
- Best for: Startups, casual brands, modern businesses

#### Benefits

- ✨ **Multiple Variations**: Get 3 options instantly
- 🎨 **Customizable**: Choose tone and style
- 💡 **Professional**: High-quality content
- ⚡ **Fast**: Generate in seconds
- 📋 **History**: Track generated content
- 📋 **Copy Ready**: Easy clipboard copy

## 📊 Use Cases

### Quick Demo Creation
**Scenario**: Need to demo the platform to a potential client

**Solution**:
1. Get their Google Business URL
2. Use Google Business Import
3. Preview the microsite
4. Show them their business in 2 minutes

### Content Writing Help
**Scenario**: Client needs help writing their About section

**Solution**:
1. Use AI Content Generator
2. Enter their business keywords
3. Generate multiple options
4. Let them choose and customize

### Bulk Onboarding
**Scenario**: Onboarding multiple businesses quickly

**Solution**:
1. Collect Google Business URLs
2. Import each business
3. Use AI to enhance descriptions
4. Assign to executives

### Template Testing
**Scenario**: Testing how different content looks

**Solution**:
1. Generate various headlines
2. Generate different taglines
3. Test in different templates
4. Find best combination

## 🔧 Technical Details

### API Endpoints

#### Google Business Import
```
POST /api/import/google-business
Body: { businessId: string }
Response: { success: boolean, data: BusinessData }
```

#### AI Content Generation
```
POST /api/ai/generate
Body: { keywords: string, tone: string, fieldType: string }
Response: { success: boolean, suggestions: string[] }
```

### Components

- `GoogleBusinessImport.tsx` - Import interface
- `AiContentGenerator.tsx` - AI generation modal
- `tools/page.tsx` - Main tools page

### Data Flow

**Google Import**:
1. User enters business ID
2. API fetches Google data
3. Data formatted for system
4. Preview generated
5. Branch created on import

**AI Generation**:
1. User selects content type
2. Enters keywords and tone
3. API generates suggestions
4. User selects favorite
5. Content saved to history

## 🎓 Best Practices

### Google Business Import

✅ **Do**:
- Verify business ID is correct
- Preview before importing
- Review imported data
- Edit after import if needed

❌ **Don't**:
- Import duplicate businesses
- Skip preview step
- Assume all data is perfect
- Forget to assign executives

### AI Content Generator

✅ **Do**:
- Be specific with keywords
- Try different tones
- Generate multiple times
- Customize generated content
- Save good examples

❌ **Don't**:
- Use generic keywords
- Accept first result blindly
- Copy without reviewing
- Forget to match brand voice
- Ignore context

## 🐛 Troubleshooting

### Google Import Issues

**Problem**: "Failed to fetch business data"
- **Solution**: Check business ID format
- **Solution**: Verify business exists on Google
- **Solution**: Try different ID format

**Problem**: "Some data is missing"
- **Solution**: Normal - not all businesses have complete data
- **Solution**: Edit branch after import to add missing info

**Problem**: "Import button disabled"
- **Solution**: Fetch business data first
- **Solution**: Check for error messages

### AI Generation Issues

**Problem**: "Please enter keywords"
- **Solution**: Add business description in keywords field

**Problem**: "Suggestions are generic"
- **Solution**: Use more specific keywords
- **Solution**: Include location, specialty, unique features

**Problem**: "Wrong tone"
- **Solution**: Try different tone option
- **Solution**: Generate multiple times

## 📝 Notes

### Current Implementation

- **Google Import**: Uses mock data for demo
  - In production: Integrate Google Places API
  - Requires: Google API key and setup

- **AI Generation**: Uses template-based generation
  - In production: Integrate OpenAI, Claude, or similar
  - Requires: AI service API key

### Future Enhancements

1. **Google Import**
   - Real Google API integration
   - Bulk import from CSV
   - Import from other sources (Yelp, Facebook)
   - Auto-update from Google

2. **AI Generation**
   - Real AI model integration
   - More content types
   - Multi-language support
   - Brand voice learning
   - Image generation

## 🔗 Related Documentation

- [Dashboard Guide](./docs/ADMIN_GUIDE.md)
- [Microsite Builder](./MICROSITE_BUILDER_IMPLEMENTATION.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)

---

**Last Updated**: November 4, 2024
**Version**: 1.0.0
**Access Level**: Admin Only
