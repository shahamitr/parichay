import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/appointments/availability
 * Get available time slots for a branch on a specific date
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');
    const serviceSlotId = searchParams.get('serviceSlotId');
    const duration = parseInt(searchParams.get('duration') || '30');

    if (!branchId || !date) {
      return NextResponse.json(
        { error: 'Branch ID and date are required' },
        { status: 400 }
      );
    }

    // Get branch with business hours
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        id: true,
        businessHours: true,
        isActive: true,
      },
    });

    if (!branch || !branch.isActive) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Get service slot duration if specified
    let slotDuration = duration;
    if (serviceSlotId) {
      const serviceSlot = await prisma.serviceSlot.findUnique({
        where: { id: serviceSlotId },
      });
      if (serviceSlot) {
        slotDuration = serviceSlot.duration;
      }
    }

    // Parse date and get day of week
    const queryDate = new Date(date);
    const dayOfWeek = queryDate.toLocaleDateString('en-US', { weekday: 'lowercase' }) as string;
    const dayMap: Record<string, string> = {
      sunday: 'sunday',
      monday: 'monday',
      tuesday: 'tuesday',
      wednesday: 'wednesday',
      thursday: 'thursday',
      friday: 'friday',
      saturday: 'saturday',
    };
    const dayKey = dayMap[dayOfWeek.toLowerCase()];

    // Get business hours for this day
    const businessHours = branch.businessHours as any;
    const dayHours = businessHours?.[dayKey];

    if (!dayHours || dayHours.closed) {
      return NextResponse.json({
        success: true,
        available: false,
        message: 'Business is closed on this day',
        slots: [],
      });
    }

    // Parse open and close times
    const openTime = dayHours.open || '09:00';
    const closeTime = dayHours.close || '18:00';
    const breakStart = dayHours.breakStart;
    const breakEnd = dayHours.breakEnd;

    // Get existing appointments for this date
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        branchId,
        date: { gte: queryDate, lt: nextDay },
        status: { notIn: ['CANCELLED'] },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate available slots
    const slots = generateTimeSlots(
      openTime,
      closeTime,
      slotDuration,
      existingAppointments,
      breakStart,
      breakEnd
    );

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastDate = queryDate < today;

    // Filter out past slots if booking for today
    const isToday = queryDate.toDateString() === new Date().toDateString();
    let availableSlots = slots;
    if (isToday) {
      const currentTime = new Date();
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      availableSlots = slots.filter(slot => {
        const [hours, minutes] = slot.time.split(':').map(Number);
        return hours * 60 + minutes > currentMinutes + 30; // At least 30 mins in advance
      });
    }

    return NextResponse.json({
      success: true,
      available: !isPastDate && availableSlots.length > 0,
      date: queryDate.toISOString().split('T')[0],
      dayOfWeek: dayKey,
      businessHours: { open: openTime, close: closeTime },
      slotDuration,
      totalSlots: availableSlots.length,
      slots: isPastDate ? [] : availableSlots,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate available time slots
 */
function generateTimeSlots(
  openTime: string,
  closeTime: string,
  duration: number,
  existingAppointments: { startTime: string; endTime: string }[],
  breakStart?: string,
  breakEnd?: string
): { time: string; endTime: string; available: boolean }[] {
  const slots: { time: string; endTime: string; available: boolean }[] = [];

  // Convert times to minutes
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  // Break time in minutes
  let breakStartMinutes = 0;
  let breakEndMinutes = 0;
  if (breakStart && breakEnd) {
    const [bsH, bsM] = breakStart.split(':').map(Number);
    const [beH, beM] = breakEnd.split(':').map(Number);
    breakStartMinutes = bsH * 60 + bsM;
    breakEndMinutes = beH * 60 + beM;
  }

  // Generate slots at 30-minute intervals
  const interval = 30;
  for (let mins = openMinutes; mins + duration <= closeMinutes; mins += interval) {
    const slotEndMins = mins + duration;

    // Check if slot is during break
    if (breakStart && breakEnd) {
      if (mins < breakEndMinutes && slotEndMins > breakStartMinutes) {
        continue; // Skip slots that overlap with break
      }
    }

    const slotTime = formatTime(mins);
    const slotEndTime = formatTime(slotEndMins);

    // Check if slot conflicts with existing appointments
    const hasConflict = existingAppointments.some(apt => {
      const [aptStartH, aptStartM] = apt.startTime.split(':').map(Number);
      const [aptEndH, aptEndM] = apt.endTime.split(':').map(Number);
      const aptStartMins = aptStartH * 60 + aptStartM;
      const aptEndMins = aptEndH * 60 + aptEndM;

      // Check for overlap
      return (mins < aptEndMins && slotEndMins > aptStartMins);
    });

    slots.push({
      time: slotTime,
      endTime: slotEndTime,
      available: !hasConflict,
    });
  }

  // Only return available slots
  return slots.filter(slot => slot.available);
}

/**
 * Format minutes to HH:MM
 */
function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
