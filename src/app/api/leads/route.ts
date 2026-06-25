import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateFormSubmission } from '@/lib/bot-protection';
import { rateLimiters } from '@/lib/rate-limiter';
import { encryptPhone, encryptEmail } from '@/lib/encryption';
import { z } from 'zod';

// Mock leads data
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0123',
    message: 'Interested in your business card services. Please contact me.',
    status: 'new',
    source: 'Website Contact Form',
    tags: ['hot-lead', 'enterprise'],
    createdAt: '2024-01-18T10:30:00Z',
    branch: {
      name: 'Main Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1-555-0456',
    message: 'Looking for digital business card solutions for our team of 50 people.',
    status: 'contacted',
    source: 'Google Ads',
    tags: ['enterprise', 'bulk-order'],
    createdAt: '2024-01-17T14:15:00Z',
    branch: {
      name: 'Downtown Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    }
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@startup.io',
    phone: '+1-555-0789',
    message: 'Startup founder interested in modern networking solutions.',
    status: 'qualified',
    source: 'LinkedIn',
    tags: ['startup', 'tech'],
    createdAt: '2024-01-16T09:45:00Z',
    branch: {
      name: 'Tech Hub Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    }
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@realestate.com',
    phone: '+1-555-0321',
    message: 'Real estate agent looking for professional digital cards.',
    status: 'converted',
    source: 'Referral',
    tags: ['real-estate', 'professional'],
    createdAt: '2024-01-15T16:20:00Z',
    branch: {
      name: 'Business District Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    }
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.w@consulting.com',
    phone: '+1-555-0654',
    message: 'Consultant interested in premium features.',
    status: 'lost',
    source: 'Social Media',
    tags: ['consulting', 'premium'],
    createdAt: '2024-01-14T11:10:00Z',
    branch: {
      name: 'Premium Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    }
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@marketing.co',
    phone: '+1-555-0987',
    message: 'Marketing agency needs bulk digital business cards.',
    status: 'new',
    source: 'Website',
    tags: ['agency', 'bulk'],
    createdAt: '2024-01-18T08:30:00Z',
    branch: {
      name: 'Creative Branch',
      brand: {
        name: 'OneTouchBizCard'
      }
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from database with proper authentication
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // const user = await verifyToken(token);
    // const leads = await db.lead.findMany({
    //   include: {
    //     branch: {
    //       include: {
    //         brand: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // });

    return NextResponse.json({
      success: true,
      leads: mockLeads
    });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/leads — Public lead submission from microsite contact forms
// =============================================================================
const leadSchema = z.object({
  branchId: z.string().min(1),
  brandId: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),
  source: z.string().default('microsite_form'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limit public form submissions
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rl = await rateLimiters.formSubmission.checkLimit(`lead:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ success: true, message: 'Thank you! We will contact you soon.' });
    }

    // Bot protection — silently reject bots with fake success
    const botCheck = validateFormSubmission(request, body);
    if (!botCheck.allowed) {
      return NextResponse.json({ success: true, message: 'Thank you! We will contact you soon.' });
    }

    // Validate
    const data = leadSchema.parse(body);

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
      select: { id: true, brandId: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Invalid branch' }, { status: 400 });
    }

    // Create lead (encrypt PII at rest)
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: encryptPhone(data.phone) || null,
        message: data.message || null,
        source: data.source,
        status: 'NEW',
        branchId: data.branchId,
        brandId: branch.brandId,
      },
    });

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'LEAD_SUBMIT',
        branchId: data.branchId,
        brandId: branch.brandId,
        metadata: {
          leadId: lead.id,
          source: data.source,
        },
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Thank you! We will contact you soon.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Please fill in all required fields correctly.' },
        { status: 400 }
      );
    }
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}