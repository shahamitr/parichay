import { NextResponse } from 'next/server';

// Simple service history tracking (in production, use database)
interface ServiceHistory {
  id: string;
  businessId: string;
  businessName: string;
  serviceType: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  rating?: number;
  notes?: string;
}

const serviceHistoryStore = new Map<string, ServiceHistory[]>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'anonymous';

    const history = serviceHistoryStore.get(sessionId) || [];

    return NextResponse.json({
      history: history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      success: true
    });
  } catch (error) {
    console.error('Service history GET error:', error);
    return NextResponse.json({
      error: 'Failed to fetch service history',
      success: false
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      businessId,
      businessName,
      serviceType,
      sessionId = 'anonymous',
      rating,
      notes
    } = await request.json();

    if (!businessId || !businessName || !serviceType) {
      return NextResponse.json({
        error: 'Business ID, name, and service type are required',
        success: false
      }, { status: 400 });
    }

    const history = serviceHistoryStore.get(sessionId) || [];

    const newEntry: ServiceHistory = {
      id: Date.now().toString(),
      businessId,
      businessName,
      serviceType,
      date: new Date().toISOString(),
      status: 'completed',
      rating,
      notes
    };

    history.push(newEntry);
    serviceHistoryStore.set(sessionId, history);

    return NextResponse.json({
      entry: newEntry,
      success: true
    });
  } catch (error) {
    console.error('Service history POST error:', error);
    return NextResponse.json({
      error: 'Failed to add service history',
      success: false
    }, { status: 500 });
  }
}