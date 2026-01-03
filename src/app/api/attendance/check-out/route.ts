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

    const attendance = await Attendance.findOne({
      employeeId: sessionUser.id,
      date: today,
    });

    if (!attendance) {
      return NextResponse.json({ error: 'No check-in record found for today' }, { status: 400 });
    }

    if (attendance.checkOutTime) {
      return NextResponse.json({ error: 'Already checked out today' }, { status: 400 });
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;
    await attendance.save(); // This will trigger the pre-save hook to calculate totalHours

    // Update user status to "absent" (default)
    await User.findByIdAndUpdate(sessionUser.id, { status: 'absent' });

    return NextResponse.json({ 
      message: 'Checked out successfully',
      checkOutTime: checkOutTime.toISOString(),
      totalHours: attendance.totalHours
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

