/**
 * Invoice Download API
 * GET /api/invoices/[id]/download - Download invoice as PDF
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { verifyToken } from '@/lib/auth-utils';
import { generateInvoicePDF } from '@/lib/invoice-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get invoice with related data
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
            brand: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this invoice
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== invoice.subscription.brand?.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access to invoice' },
        { status: 403 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
