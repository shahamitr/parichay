import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branchId, date, time, name, email, phone, notes } = body;

    // Validate required fields
    if (!branchId || !date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get branch details
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        brand: true,
      },
    });

    if (!branch) {
      return NextResponse.json(
        { success: false, error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Create appointment record (you can create a new Appointment model in Prisma)
    // For now, we'll store it as a lead with appointment metadata
    const appointment = await prisma.lead.create({
      data: {
        branchId,
        // brandId: branch.brandId, // TODO: Add brandId to Lead model
        name,
        email,
        phone,
        message: notes || '',
        source: 'appointment_booking',
        metadata: {
          appointmentDate: date,
          appointmentTime: time,
          type: 'appointment',
          brandId: branch.brandId, // Store in metadata for now
        },
      },
    });

    // Send confirmation email to customer
    const contact = branch.contact as any;
    const appointmentDateTime = new Date(`${date}T${time}`);
    const formattedDate = appointmentDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      await sendEmail({
        to: email,
        subject: `Appointment Confirmation - ${branch.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Appointment Confirmation</h2>
            <p>Dear ${name},</p>
            <p>Your appointment request has been received. Here are the details:</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Branch:</strong> ${branch.name}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>
            <p>We will contact you shortly to confirm your appointment.</p>
            <p>If you have any questions, please contact us at:</p>
            <p>
              ${contact.phone ? `Phone: ${contact.phone}<br>` : ''}
              ${contact.email ? `Email: ${contact.email}` : ''}
            </p>
            <p>Best regards,<br>${branch.brand.name}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // Send notification to branch
    if (contact.email) {
      try {
        await sendEmail({
          to: contact.email,
          subject: `New Appointment Request - ${branch.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Appointment Request</h2>
              <p>You have received a new appointment request:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              <p>Please contact the customer to confirm the appointment.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      message: 'Appointment request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
