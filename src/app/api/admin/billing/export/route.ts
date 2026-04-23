import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock invoice data - in real app, fetch from database
    const invoices = [
      {
        id: '1',
        number: 'INV-2024-001',
        amount: 2999,
        currency: 'INR',
        status: 'PAID',
        createdAt: '2024-01-15T10:00:00Z',
        dueDate: '2024-01-30T10:00:00Z',
        paidAt: '2024-01-20T14:30:00Z',
        description: 'Professional Plan - Monthly',
      },
      {
        id: '2',
        number: 'INV-2024-002',
        amount: 2999,
        currency: 'INR',
        status: 'PAID',
        createdAt: '2024-02-15T10:00:00Z',
        dueDate: '2024-02-28T10:00:00Z',
        paidAt: '2024-02-18T11:00:00Z',
        description: 'Professional Plan - Monthly',
      },
      {
        id: '3',
        number: 'INV-2024-003',
        amount: 2999,
        currency: 'INR',
        status: 'PENDING',
        createdAt: '2024-03-15T10:00:00Z',
        dueDate: '2024-03-30T10:00:00Z',
        description: 'Professional Plan - Monthly',
      },
    ];

    // Generate CSV content
    const csvHeaders = ['Invoice Number', 'Description', 'Amount', 'Currency', 'Status', 'Created Date', 'Due Date', 'Paid Date'];
    const csvRows = invoices.map(invoice => [
      invoice.number,
      invoice.description,
      invoice.amount.toString(),
      invoice.currency,
      invoice.status,
      new Date(invoice.createdAt).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="invoices-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error exporting invoices:', error);
    return NextResponse.json(
      { error: 'Failed to export invoices' },
      { status: 500 }
    );
  }
}