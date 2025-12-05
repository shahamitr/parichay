/**
 * Invoice PDF generation utility
 */

import PDFDocument from 'pdfkit';
import { formatCurrency, formatDate } from './utils';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  paidAt?: Date;

  // Company details
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyGST?: string;

  // Customer details
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerGST?: string;

  // Invoice items
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;

  // Amounts
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;

  // Payment details
  paymentMethod: string;
  paymentId?: string;

  // Notes
  notes?: string;
}

/**
 * Generate invoice PDF and return as buffer
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .text('INVOICE', 50, 50, { align: 'right' })
        .fontSize(10)
        .text(`Invoice #: ${data.invoiceNumber}`, 50, 80, { align: 'right' })
        .text(`Date: ${formatDate(data.invoiceDate)}`, 50, 95, { align: 'right' })
        .text(`Due Date: ${formatDate(data.dueDate)}`, 50, 110, { align: 'right' });

      if (data.paidAt) {
        doc
          .fillColor('green')
          .text(`Paid: ${formatDate(data.paidAt)}`, 50, 125, { align: 'right' })
          .fillColor('black');
      }

      // Company details
      doc
        .fontSize(12)
        .text(data.companyName, 50, 50)
        .fontSize(10)
        .text(data.companyAddress, 50, 70)
        .text(data.companyEmail, 50, 85)
        .text(data.companyPhone, 50, 100);

      if (data.companyGST) {
        doc.text(`GST: ${data.companyGST}`, 50, 115);
      }

      // Customer details
      doc
        .fontSize(12)
        .text('Bill To:', 50, 180)
        .fontSize(10)
        .text(data.customerName, 50, 200)
        .text(data.customerEmail, 50, 215);

      if (data.customerAddress) {
        doc.text(data.customerAddress, 50, 230);
      }

      if (data.customerGST) {
        doc.text(`GST: ${data.customerGST}`, 50, 245);
      }

      // Table header
      const tableTop = 300;
      doc
        .fontSize(10)
        .text('Description', 50, tableTop)
        .text('Qty', 300, tableTop)
        .text('Unit Price', 350, tableTop)
        .text('Amount', 450, tableTop, { align: 'right' });

      // Draw line
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Table items
      let yPosition = tableTop + 25;
      data.items.forEach((item) => {
        doc
          .fontSize(10)
          .text(item.description, 50, yPosition)
          .text(item.quantity.toString(), 300, yPosition)
          .text(formatCurrency(item.unitPrice, data.currency), 350, yPosition)
          .text(formatCurrency(item.amount, data.currency), 450, yPosition, { align: 'right' });

        yPosition += 20;
      });

      // Draw line
      doc
        .moveTo(50, yPosition)
        .lineTo(550, yPosition)
        .stroke();

      // Totals
      yPosition += 15;
      doc
        .fontSize(10)
        .text('Subtotal:', 350, yPosition)
        .text(formatCurrency(data.subtotal, data.currency), 450, yPosition, { align: 'right' });

      yPosition += 20;
      doc
        .text(`Tax (${(data.taxRate * 100).toFixed(0)}%):`, 350, yPosition)
        .text(formatCurrency(data.taxAmount, data.currency), 450, yPosition, { align: 'right' });

      yPosition += 20;
      doc
        .fontSize(12)
        .text('Total:', 350, yPosition)
        .text(formatCurrency(data.total, data.currency), 450, yPosition, { align: 'right' });

      // Payment details
      yPosition += 40;
      doc
        .fontSize(10)
        .text('Payment Method:', 50, yPosition)
        .text(data.paymentMethod, 150, yPosition);

      if (data.paymentId) {
        yPosition += 15;
        doc
          .text('Payment ID:', 50, yPosition)
          .text(data.paymentId, 150, yPosition);
      }

      // Notes
      if (data.notes) {
        yPosition += 40;
        doc
          .fontSize(10)
          .text('Notes:', 50, yPosition)
          .text(data.notes, 50, yPosition + 15, { width: 500 });
      }

      // Footer
      doc
        .fontSize(8)
        .text(
          'Thank you for your business!',
          50,
          750,
          { align: 'center', width: 500 }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Create invoice data from subscription and payment
 */
export function createInvoiceData(
  invoice: any,
  subscription: any,
  payment: any,
  brand: any
): InvoiceData {
  const plan = subscription.plan;
  const taxRate = 0.18; // 18% GST
  const subtotal = payment.amount / (1 + taxRate);
  const taxAmount = payment.amount - subtotal;

  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.createdAt,
    dueDate: invoice.dueDate,
    paidAt: invoice.paidAt,

    companyName: 'OneTouch BizCard',
    companyAddress: 'India',
    companyEmail: 'billing@onetouchbizcard.in',
    companyPhone: '+91-XXXXXXXXXX',
    companyGST: 'XXXXXXXXXXXX',

    customerName: brand.name,
    customerEmail: brand.users?.[0]?.email || 'N/A',
    customerAddress: undefined,
    customerGST: undefined,

    items: [
      {
        description: `${plan.name} Subscription (${plan.duration})`,
        quantity: 1,
        unitPrice: subtotal,
        amount: subtotal,
      },
    ],

    subtotal,
    taxRate,
    taxAmount,
    total: payment.amount,
    currency: payment.currency,

    paymentMethod: payment.paymentGateway === 'STRIPE' ? 'Stripe' : 'Razorpay',
    paymentId: payment.externalPaymentId,

    notes: `License Key: ${subscription.licenseKey}\nValid from ${formatDate(subscription.startDate)} to ${formatDate(subscription.endDate)}`,
  };
}
