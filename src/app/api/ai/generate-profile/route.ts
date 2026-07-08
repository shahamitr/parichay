/**
 * AI Profile Generator
 * POST /api/ai/generate-profile
 *
 * Given business name + category + city, generates complete microsite content:
 * - About section
 * - Services (3-5 with pricing suggestions)
 * - FAQ (3-5 questions)
 * - Tagline
 * - SEO description
 *
 * Uses OpenAI GPT-4o-mini for cost efficiency.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { rateLimiters } from '@/lib/rate-limiter';
import { z } from 'zod';
import logger from '@/lib/logger';

const generateSchema = z.object({
  businessName: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  phone: z.string().optional(),
  additionalInfo: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Rate limit: 5 generations per hour
    const rl = await rateLimiters.api.checkLimit(`ai-generate:${user.id}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Please wait before generating again.' }, { status: 429 });
    }

    const body = await request.json();
    const data = generateSchema.parse(body);

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback: generate template-based content (no AI needed)
      return NextResponse.json({
        success: true,
        generated: generateFallbackContent(data),
        source: 'template',
      });
    }

    // Use OpenAI
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are a business profile writer for Indian small businesses. Generate professional content for:

Business: ${data.businessName}
Category: ${data.category}
City: ${data.city}
${data.additionalInfo ? `Additional info: ${data.additionalInfo}` : ''}

Return a JSON object with EXACTLY this structure (no markdown, just JSON):
{
  "tagline": "A short catchy tagline (max 60 chars)",
  "about": "A professional 2-3 sentence about section (max 200 chars)",
  "services": [
    { "name": "Service Name", "description": "One line description", "price": 500 },
    { "name": "Service Name", "description": "One line description", "price": 1000 },
    { "name": "Service Name", "description": "One line description", "price": 1500 }
  ],
  "faq": [
    { "question": "Common question?", "answer": "Helpful answer" },
    { "question": "Common question?", "answer": "Helpful answer" },
    { "question": "Common question?", "answer": "Helpful answer" }
  ],
  "seoDescription": "A 150-char SEO meta description for Google",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- Prices in Indian Rupees (₹)
- Use natural Indian English
- Services relevant to the specific business category
- FAQ should answer what real customers would ask
- Keep everything concise and professional`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No AI response received');
    }

    const generated = JSON.parse(content);

    logger.info({ userId: user.id, business: data.businessName }, 'AI profile generated');

    return NextResponse.json({
      success: true,
      generated,
      source: 'ai',
      tokensUsed: completion.usage?.total_tokens || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please provide business name, category, and city.' }, { status: 400 });
    }
    logger.error({ error }, 'AI profile generation error');

    // Fallback to template if AI fails
    try {
      const body = await request.clone().json();
      return NextResponse.json({
        success: true,
        generated: generateFallbackContent(body),
        source: 'template-fallback',
      });
    } catch {
      return NextResponse.json({ error: 'Profile generation failed' }, { status: 500 });
    }
  }
}

/** Template-based fallback when OpenAI is not configured */
function generateFallbackContent(data: { businessName: string; category: string; city: string }) {
  const { businessName, category, city } = data;
  const cat = category.toLowerCase();

  // Industry-specific service templates
  const serviceTemplates: Record<string, Array<{ name: string; description: string; price: number }>> = {
    'doctor': [
      { name: 'General Consultation', description: 'Comprehensive health checkup and consultation', price: 500 },
      { name: 'Follow-up Visit', description: 'Post-treatment follow-up appointment', price: 300 },
      { name: 'Health Screening', description: 'Preventive health screening package', price: 2000 },
    ],
    'dentist': [
      { name: 'Dental Cleaning', description: 'Professional teeth cleaning and polishing', price: 800 },
      { name: 'Root Canal Treatment', description: 'Advanced root canal therapy', price: 5000 },
      { name: 'Teeth Whitening', description: 'Professional whitening treatment', price: 3000 },
    ],
    'salon': [
      { name: 'Haircut & Styling', description: 'Professional haircut with wash and style', price: 500 },
      { name: 'Facial Treatment', description: 'Rejuvenating facial for glowing skin', price: 1200 },
      { name: 'Bridal Package', description: 'Complete bridal makeup and hair', price: 15000 },
    ],
    'restaurant': [
      { name: 'Lunch Thali', description: 'Complete Indian thali with rice, dal, sabzi', price: 250 },
      { name: 'Family Dinner Package', description: 'Dinner for 4 with starters and dessert', price: 2000 },
      { name: 'Party Catering', description: 'Catering for events (per plate)', price: 500 },
    ],
    'gym': [
      { name: 'Monthly Membership', description: 'Full gym access with basic training', price: 1500 },
      { name: 'Personal Training', description: '1-on-1 sessions with certified trainer', price: 3000 },
      { name: 'Group Classes', description: 'Yoga, Zumba, and aerobics classes', price: 800 },
    ],
    'default': [
      { name: 'Basic Service', description: 'Our standard service offering', price: 1000 },
      { name: 'Premium Service', description: 'Enhanced service with priority support', price: 2500 },
      { name: 'Consultation', description: 'Expert consultation and guidance', price: 500 },
    ],
  };

  const matchedKey = Object.keys(serviceTemplates).find((k) => cat.includes(k)) || 'default';
  const services = serviceTemplates[matchedKey];

  return {
    tagline: `Professional ${category} services in ${city}`,
    about: `Welcome to ${businessName}. We provide high-quality ${category.toLowerCase()} services in ${city}. With a focus on customer satisfaction and professional excellence, we are committed to delivering the best experience for every client.`,
    services: services.map((s, i) => ({ ...s, id: `s${i + 1}` })),
    faq: [
      { question: `What are your working hours?`, answer: `We are open Monday to Saturday, 9 AM to 6 PM. Closed on Sundays.` },
      { question: `Do you accept online bookings?`, answer: `Yes! You can book an appointment directly through our profile or contact us on WhatsApp.` },
      { question: `What payment methods do you accept?`, answer: `We accept cash, UPI (GPay, PhonePe), and card payments.` },
    ],
    seoDescription: `${businessName} — Professional ${category.toLowerCase()} services in ${city}. Book appointments, view services, and contact us online.`,
    keywords: [businessName.toLowerCase(), category.toLowerCase(), city.toLowerCase(), `${category.toLowerCase()} in ${city.toLowerCase()}`],
  };
}
