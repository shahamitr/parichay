import { NextRequest, NextResponse } from 'next/server';

/**
 * DYNAMIC MOCK AI SERVICE
 * This simulates a real AI model like Gemini. It generates dynamic, plausible data
 * based on the input URL, rather than returning a static object.
 */
const dynamicAiScraperService = {
  generateProfile: async (url: string) => {
    console.log(`AI Service: Dynamically generating profile for ${url}`);
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API latency

    // Extract a "name" from the URL to make the response dynamic
    const cid = new URLSearchParams(url.split('?')[1]).get('cid');
    const businessName = `Dynamic Business ${cid?.substring(0, 4) || 'Inc'}`;
    const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 2000) + 50;

    // Simulate a case where the AI might fail to find some data
    const shouldIncludeVideos = Math.random() > 0.2; // 80% chance of including videos

    return {
      theme: {
        primaryColor: '#FF6B35',
        secondaryColor: '#FFFFFF',
        backgroundColor: '#1A1A1A',
        textColor: '#FFFFFF',
      },
      header: {
        logoUrl: `https://via.placeholder.com/100/FFFFFF/FF6B35?text=${businessName.charAt(0)}`,
        title: businessName,
        rating: parseFloat(rating),
        reviews: reviews,
        address: `${reviews} Dynamic Way, Innovation City`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-1234`,
        website: `${businessName.toLowerCase().replace(/\s/g, '-')}.com`,
      },
      helpCenter: {
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-5678`,
        whatsapp: `+1555${Math.floor(Math.random() * 9000000) + 1000000}`,
      },
      aboutUs: {
        title: `About ${businessName}`,
        content: `We are a leading provider in our industry, known for quality and customer satisfaction. Our rating of ${rating} from ${reviews} reviews speaks for itself.`,
      },
      modelsAndServices: [
        { id: 1, name: 'Dynamic Service A', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=Service+A' },
        { id: 2, name: 'Dynamic Product B', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=Product+B' },
        { id: 3, name: 'Consulting C', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=Consulting' },
      ],
      payment: {
        upiId: `${businessName.toLowerCase().replace(/\s/g, '')}@upi`,
        qrCodeUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=UPI+QR',
      },
      gallery: [
        `https://via.placeholder.com/408x306/FF6B35/FFFFFF?text=${businessName}+1`,
        'https://via.placeholder.com/408x306/1A1A1A/FFFFFF?text=Gallery+2',
        'https://via.placeholder.com/408x306/FF6B35/FFFFFF?text=Gallery+3',
      ],
      // Conditionally include videos to test frontend resilience
      videos: shouldIncludeVideos ? [
        { id: 1, title: 'Dynamic Promotional Video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ] : [],
    };
  }
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('cid=')) {
      return NextResponse.json({ error: 'A valid Google Maps URL with a CID is required.' }, { status: 400 });
    }

    // This is where the advanced prompt engineering happens.
    // We instruct the AI to act as a web scraper and data formatter.
    const prompt = `
      Given the Google Maps URL: ${url}

      1.  Scrape all available business information: name, address, phone, website, rating, number of reviews, photos, services, and any other relevant details.
      2.  Structure this information into a JSON object with the following keys: "theme", "header", "helpCenter", "aboutUs", "modelsAndServices", "payment", "gallery", "videos".
      3.  For the "theme", generate a professional color scheme with primaryColor: '#FF6B35' and backgroundColor: '#1A1A1A'.
      4.  For "modelsAndServices", if not available, generate a plausible list of 4-5 items relevant to the business category. Provide a placeholder image URL for each.
      5.  For "aboutUs", write a compelling 2-3 sentence summary of the business.
      6.  For "payment", generate a plausible UPI ID and a placeholder QR code URL.
      7.  For "videos", if none are found, generate one placeholder entry with a generic title and a sample YouTube embed URL.
      8.  Ensure all fields in the JSON structure are populated, using generated but realistic placeholders for any missing information.
    `;

    // In a real implementation, you would send this prompt to the Gemini API.
    // For this demo, we use our mock service.
    console.log("Generated AI Prompt:", prompt);
    const profileData = await dynamicAiScraperService.generateProfile(url);

    return NextResponse.json(profileData);

  } catch (error) {
    console.error('AI profile generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate profile from URL.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "This endpoint requires a POST request with a Google Maps URL." });
}
