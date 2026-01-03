import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getSessionUser } from '@/lib/getSessionUser';
import { Attendance } from '@/models/attendance';
import { User } from '@/models/user';

export async function POST(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId: sessionUser.id,
      date: today,
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
    }

    const checkInTime = new Date();

    if (existingAttendance) {
      // Update existing record
      existingAttendance.checkInTime = checkInTime;
      existingAttendance.status = 'present';
      await existingAttendance.save();
    } else {
      // Create new record
      await Attendance.create({
        employeeId: sessionUser.id,
        date: today,
        checkInTime: checkInTime,
        status: 'present',
      });
    }

    // Update user status to "working"
    await User.findByIdAndUpdate(sessionUser.id, { status: 'working' });

    return NextResponse.json({ 
      message: 'Checked in successfully',
      checkInTime: checkInTime.toISOString()
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

