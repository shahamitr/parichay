import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email-service';
import { getAuthUser } from '@/lib/auth';

/**
 * GET /api/appointments
 * Get appointments for a branch
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    if (!branchId) {
      return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });
    }

    const where: any = { branchId };

    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: queryDate, lt: nextDay };
    } else if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        serviceSlot: { select: { name: true, duration: true, price: true, color: true } },
        lead: { select: { name: true, email: true, phone: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
      noShow: appointments.filter(a => a.status === 'NO_SHOW').length,
    };

    return NextResponse.json({ success: true, appointments, stats });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/appointments
 * Create a new appointment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      branchId,
      serviceSlotId,
      serviceName,
      customerName,
      customerPhone,
      customerEmail,
      date,
      startTime,
      duration,
      notes,
      // Legacy fields support
      time,
      name,
      email,
      phone,
    } = body;

    // Support both old and new field names
    const resolvedName = customerName || name;
    const resolvedPhone = customerPhone || phone;
    const resolvedEmail = customerEmail || email;
    const resolvedTime = startTime || time;

    if (!branchId || !resolvedName || !resolvedPhone || !date || !resolvedTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get branch details
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { brand: true },
    });

    if (!branch) {
      return NextResponse.json({ success: false, error: 'Branch not found' }, { status: 404 });
    }

    // Calculate end time
    const appointmentDuration = duration || 30;
    const [hours, minutes] = resolvedTime.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + appointmentDuration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    // Check for conflicts
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        branchId,
        date: new Date(date),
        status: { notIn: ['CANCELLED'] },
        OR: [
          { AND: [{ startTime: { lte: resolvedTime } }, { endTime: { gt: resolvedTime } }] },
          { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] },
          { AND: [{ startTime: { gte: resolvedTime } }, { endTime: { lte: endTime } }] },
        ],
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Get service details
    let resolvedServiceName = serviceName || 'General Appointment';
    if (serviceSlotId) {
      const serviceSlot = await prisma.serviceSlot.findUnique({ where: { id: serviceSlotId } });
      if (serviceSlot) resolvedServiceName = serviceSlot.name;
    }

    // Find or create lead
    let lead = await prisma.lead.findFirst({
      where: {
        branchId,
        OR: [{ phone: resolvedPhone }, resolvedEmail ? { email: resolvedEmail } : undefined].filter(Boolean) as any,
      },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          branchId,
          name: resolvedName,
          phone: resolvedPhone,
          email: resolvedEmail || null,
          source: 'appointment_booking',
          status: 'NEW',
        },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        branchId,
        serviceSlotId: serviceSlotId || null,
        serviceName: resolvedServiceName,
        leadId: lead.id,
        customerName: resolvedName,
        customerPhone: resolvedPhone,
        customerEmail: resolvedEmail || null,
        date: new Date(date),
        startTime: resolvedTime,
        endTime,
        duration: appointmentDuration,
        notes: notes || null,
        status: 'PENDING',
      },
      include: { serviceSlot: true },
    });

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        branchId,
        brandId: branch.brandId,
        eventType: 'APPOINTMENT_BOOKED',
        metadata: { appointmentId: appointment.id, serviceName: resolvedServiceName, customerName: resolvedName },
      },
    });

    // Send confirmation email
    const contact = branch.contact as any;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    if (resolvedEmail) {
      try {
        await sendEmail({
          to: resolvedEmail,
          subject: `Appointment Confirmation - ${branch.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Appointment Confirmation</h2>
              <p>Dear ${resolvedName},</p>
              <p>Your appointment has been booked. Here are the details:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Service:</strong> ${resolvedServiceName}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${resolvedTime}</p>
                <p><strong>Duration:</strong> ${appointmentDuration} minutes</p>
              </div>
              <p>We will contact you to confirm. If you need to reschedule, please contact us.</p>
              <p>Best regards,<br>${branch.brand.name}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      appointment,
      appointmentId: appointment.id,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create appointment' }, { status: 500 });
  }
}
