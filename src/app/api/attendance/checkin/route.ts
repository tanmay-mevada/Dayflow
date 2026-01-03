import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Attendance } from '@/models/attendance';
import { User } from '@/models/user';

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      employeeId: user._id,
      date: { $gte: today, $lte: todayEnd }
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
        employeeId: user._id,
        date: today,
        checkInTime,
        status: 'present'
      });
    }

    // Update user status
    await User.findByIdAndUpdate(user._id, { status: 'working' });

    return NextResponse.json({ 
      message: 'Checked in successfully',
      checkInTime 
    });
  } catch (err) {
    console.error('Check-in error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

