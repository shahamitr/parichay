import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email-service';

/**
 * GET /api/appointments/[id]
 * Get a single appointment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        serviceSlot: true,
        lead: { select: { id: true, name: true, email: true, phone: true } },
        branch: {
          select: {
            id: true,
            name: true,
            brand: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/appointments/[id]
 * Update appointment status or details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, internalNotes, date, startTime, duration } = body;

    // Get existing appointment
    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: {
        branch: {
          include: { brand: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};

    if (status) {
      updateData.status = status;
      if (status === 'CONFIRMED' && !existing.confirmedAt) {
        updateData.confirmedAt = new Date();
      }
    }

    if (notes !== undefined) updateData.notes = notes;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

    // Handle rescheduling
    if (date || startTime) {
      const newDate = date ? new Date(date) : existing.date;
      const newStartTime = startTime || existing.startTime;
      const newDuration = duration || existing.duration;

      // Calculate new end time
      const [hours, minutes] = newStartTime.split(':').map(Number);
      const endMinutes = hours * 60 + minutes + newDuration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      // Check for conflicts (excluding current appointment)
      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          branchId: existing.branchId,
          date: newDate,
          status: { notIn: ['CANCELLED'] },
          OR: [
            { AND: [{ startTime: { lte: newStartTime } }, { endTime: { gt: newStartTime } }] },
            { AND: [{ startTime: { lt: newEndTime } }, { endTime: { gte: newEndTime } }] },
            { AND: [{ startTime: { gte: newStartTime } }, { endTime: { lte: newEndTime } }] },
          ],
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'Time slot conflict with another appointment' },
          { status: 409 }
        );
      }

      updateData.date = newDate;
      updateData.startTime = newStartTime;
      updateData.endTime = newEndTime;
      updateData.duration = newDuration;
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { serviceSlot: true },
    });

    // Send notification emails based on status change
    if (status && status !== existing.status && existing.customerEmail) {
      const formattedDate = appointment.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      let emailSubject = '';
      let emailMessage = '';

      switch (status) {
        case 'CONFIRMED':
          emailSubject = `Appointment Confirmed - ${existing.branch.name}`;
          emailMessage = `Your appointment for ${appointment.serviceName} on ${formattedDate} at ${appointment.startTime} has been confirmed.`;
          break;
        case 'CANCELLED':
          emailSubject = `Appointment Cancelled - ${existing.branch.name}`;
          emailMessage = `Your appointment for ${appointment.serviceName} on ${formattedDate} has been cancelled. Please contact us to reschedule.`;
          break;
        case 'COMPLETED':
          emailSubject = `Thank you for visiting - ${existing.branch.name}`;
          emailMessage = `Thank you for your visit! We hope you enjoyed your ${appointment.serviceName}. We'd love to see you again!`;
          break;
      }

      if (emailSubject) {
        try {
          await sendEmail({
            to: existing.customerEmail,
            subject: emailSubject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">${emailSubject}</h2>
                <p>Dear ${existing.customerName},</p>
                <p>${emailMessage}</p>
                <p>Best regards,<br>${existing.branch.brand.name}</p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Error sending status update email:', emailError);
        }
      }
    }

    // Track analytics for status changes
    if (status && status !== existing.status) {
      await prisma.analyticsEvent.create({
        data: {
          branchId: existing.branchId,
          brandId: existing.branch.brandId,
          eventType: 'APPOINTMENT_BOOKED', // Using existing event type
          metadata: {
            appointmentId: id,
            previousStatus: existing.status,
            newStatus: status,
            action: 'status_update',
          },
        },
      });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/appointments/[id]
 * Cancel/delete an appointment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        branch: { include: { brand: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Soft delete by setting status to CANCELLED
    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Send cancellation email
    if (appointment.customerEmail) {
      const formattedDate = appointment.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      try {
        await sendEmail({
          to: appointment.customerEmail,
          subject: `Appointment Cancelled - ${appointment.branch.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Appointment Cancelled</h2>
              <p>Dear ${appointment.customerName},</p>
              <p>Your appointment for ${appointment.serviceName} on ${formattedDate} at ${appointment.startTime} has been cancelled.</p>
              <p>If you would like to reschedule, please contact us or book a new appointment online.</p>
              <p>Best regards,<br>${appointment.branch.brand.name}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
