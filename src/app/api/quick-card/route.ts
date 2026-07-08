/**
 * Quick Card API — Create a digital business card in one request
 * POST /api/quick-card
 *
 * Creates brand + branch + basic microsite in a single transaction.
 * Used by the "Create in 60 seconds" onboarding wizard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const quickCardSchema = z.object({
  businessName: z.string().min(2).max(100),
  yourName: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  city: z.string().min(2).max(50),
  category: z.string().optional(),
  tagline: z.string().max(200).optional(),
  services: z.array(z.string()).max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const data = quickCardSchema.parse(body);

    // Generate slug from business name
    const baseSlug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.brand.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Build microsite config
    const services = (data.services || []).map((s, i) => ({
      id: `s${i + 1}`,
      name: s,
      description: '',
      price: 0,
      category: 'general',
    }));

    const micrositeConfig = {
      templateId: 'modern-business',
      seoSettings: {
        title: `${data.businessName} — ${data.tagline || data.city}`,
        description: `${data.businessName} in ${data.city}. Contact us for ${data.services?.join(', ') || 'our services'}.`,
        keywords: [data.businessName.toLowerCase(), data.city.toLowerCase()],
      },
      sections: {
        hero: { enabled: true, title: data.businessName, subtitle: data.tagline || `Professional services in ${data.city}` },
        about: { enabled: true, content: `Welcome to ${data.businessName}. We provide professional services in ${data.city}. Contact us today.` },
        services: { enabled: services.length > 0, items: services },
        gallery: { enabled: false, images: [] },
        contact: { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'phone', 'message'] } },
      },
    };

    // Create everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const brand = await tx.brand.create({
        data: {
          name: data.businessName,
          slug,
          tagline: data.tagline || null,
          colorTheme: { primary: '#4F46E5', secondary: '#7C3AED', accent: '#06B6D4' },
          ownerId: user.id,
        },
      });

      const branch = await tx.branch.create({
        data: {
          name: 'Main',
          slug: 'main',
          brandId: brand.id,
          isActive: true,
          address: { street: '', city: data.city, state: '', zipCode: '', country: 'India' },
          contact: { phone: data.phone, whatsapp: data.whatsapp || data.phone, email: data.email || '' },
          businessHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '10:00', close: '14:00', closed: false },
            sunday: { open: '00:00', close: '00:00', closed: true },
          },
          micrositeConfig,
        },
      });

      // Link user to brand
      await tx.user.update({
        where: { id: user.id },
        data: { brandId: brand.id, role: 'BRAND_MANAGER' },
      });

      return { brand, branch };
    });

    const profileUrl = `/${result.brand.slug}/main`;

    return NextResponse.json({
      success: true,
      profileUrl,
      brand: { id: result.brand.id, name: result.brand.name, slug: result.brand.slug },
      branch: { id: result.branch.id },
      message: `Your digital card is live at ${profileUrl}`,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please fill all required fields correctly', details: error.errors }, { status: 400 });
    }
    console.error('Quick card error:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
