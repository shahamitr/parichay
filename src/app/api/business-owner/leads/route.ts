import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    // Mock data for demo - in production, fetch from database with filters
    let leads = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        message: 'Interested in hair styling services for a wedding event',
        source: 'website',
        status: 'new',
        priority: 'high',
        tags: ['wedding', 'bridal', 'consultation'],
        value: 1200,
        createdAt: '2024-01-24T10:30:00Z',
        updatedAt: '2024-01-24T10:30:00Z'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 987-6543',
        message: 'Looking for business consultation services',
        source: 'qr_code',
        status: 'contacted',
        priority: 'medium',
        tags: ['business', 'consultation'],
        assignedTo: 'John Doe',
        lastContactedAt: '2024-01-24T14:00:00Z',
        nextFollowUpAt: '2024-01-26T10:00:00Z',
        value: 2500,
        createdAt: '2024-01-24T09:15:00Z',
        updatedAt: '2024-01-24T14:00:00Z'
      },
      {
        id: '3',
        name: 'Emma Davis',
        phone: '+1 (555) 456-7890',
        message: 'Need plumbing repair services urgently',
        source: 'social_share',
        status: 'qualified',
        priority: 'urgent',
        tags: ['plumbing', 'urgent', 'repair'],
        assignedTo: 'Jane Smith',
        lastContactedAt: '2024-01-23T18:00:00Z',
        nextFollowUpAt: '2024-01-24T08:00:00Z',
        value: 350,
        createdAt: '2024-01-23T16:20:00Z',
        updatedAt: '2024-01-23T18:00:00Z'
      }
    ];

    // Apply filters
    if (status && status !== 'all') {
      leads = leads.filter(lead => lead.status === status);
    }

    if (priority && priority !== 'all') {
      leads = leads.filter(lead => lead.priority === priority);
    }

    if (source && source !== 'all') {
      leads = leads.filter(lead => lead.source === source);
    }

    if (search) {
      leads = leads.filter(lead =>
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.includes(search) ||
        lead.message?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      leads,
      total: leads.length,
      success: true
    });

  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch leads',
      success: false
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const leadData = await request.json();

    // In production, save to database
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      lead: newLead,
      success: true
    });

  } catch (error) {
    console.error('Create lead API error:', error);
    return NextResponse.json({
      error: 'Failed to create lead',
      success: false
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();

    // In production, update in database
    const updatedLead = {
      id,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      lead: updatedLead,
      success: true
    });

  } catch (error) {
    console.error('Update lead API error:', error);
    return NextResponse.json({
      error: 'Failed to update lead',
      success: false
    }, { status: 500 });
  }
}