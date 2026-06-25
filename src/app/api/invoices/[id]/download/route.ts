/**
 * Invoice PDF Download
 * GET /api/invoices/[id]/download
 *
 * Generates and serves a PDF invoice for download.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { generateInvoicePDF, createInvoiceData } from '@/lib/invoice-generator';
import logger from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch invoice with related data
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
            brand: {
              include: {
                users: {
                  where: { role: 'BRAND_MANAGER' },
                  take: 1,
                  select: { email: true, firstName: true, lastName: true },
                },
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Access control
    const brand = invoice.subscription?.brand;
    if (!brand) {
      return NextResponse.json({ error: 'Invoice data incomplete' }, { status: 400 });
    }

    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build invoice data for PDF generation
    const invoiceData = createInvoiceData(
      invoice,
      invoice.subscription,
      invoice.payment,
      brand
    );

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    // Return PDF as downloadable response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    logger.error({ error }, 'Invoice PDF generation error');
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
