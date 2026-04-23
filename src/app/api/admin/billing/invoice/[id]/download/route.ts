import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id;

    // Mock invoice data - in real app, fetch from database
    const invoice = {
      id: invoiceId,
      number: `INV-2024-${invoiceId.padStart(3, '0')}`,
      amount: 2999,
      currency: 'INR',
      status: 'PAID',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date().toISOString(),
      description: 'Professional Plan - Monthly',
      customer: {
        name: 'Demo User',
        email: 'demo@onetouchbizcard.in',
        address: '123 Business Street, Mumbai, India'
      }
    };

    // Generate PDF content (simplified HTML that can be converted to PDF)
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${invoice.number}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f5f5f5; }
        .total { text-align: right; font-weight: bold; font-size: 18px; }
        .status { padding: 5px 10px; border-radius: 5px; color: white; background-color: #10b981; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
        <h2>${invoice.number}</h2>
    </div>

    <div class="invoice-details">
        <p><strong>Bill To:</strong></p>
        <p>${invoice.customer.name}</p>
        <p>${invoice.customer.email}</p>
        <p>${invoice.customer.address}</p>

        <p><strong>Invoice Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="status">${invoice.status}</span></p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${invoice.description}</td>
                <td>₹${invoice.amount.toLocaleString()}</td>
            </tr>
        </tbody>
    </table>

    <div class="total">
        <p>Total: ₹${invoice.amount.toLocaleString()}</p>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>Thank you for your business!</p>
        <p>Parichay - Your Digital Business Card Platform</p>
    </div>
</body>
</html>`;

    // Return HTML content that can be printed as PDF by the browser
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${invoice.number}.html"`,
      },
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}