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

    // Find today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employeeId: user._id,
      date: { $gte: today, $lte: todayEnd }
    });

    if (!attendance || !attendance.checkInTime) {
      return NextResponse.json({ error: 'Please check in first' }, { status: 400 });
    }

    if (attendance.checkOutTime) {
      return NextResponse.json({ error: 'Already checked out today' }, { status: 400 });
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;
    await attendance.save(); // This will trigger the pre-save hook to calculate totalHours

    // Update user status
    await User.findByIdAndUpdate(user._id, { status: 'absent' });

    return NextResponse.json({ 
      message: 'Checked out successfully',
      checkOutTime,
      totalHours: attendance.totalHours
    });
  } catch (err) {
    console.error('Check-out error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

