import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Attendance } from '@/models/attendance';
import { User } from '@/models/user';

// GET - Get attendance records
export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Admin/HR can view any employee's attendance
    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // If admin is viewing someone else's attendance, verify the employee exists
    if (isAdmin && employeeId && employeeId !== user._id.toString()) {
      const targetUser = await User.findById(employeeId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    const query: any = { employeeId: targetEmployeeId };

    // Date range filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(100)
      .populate('employeeId', 'firstName lastName employeeId');

    return NextResponse.json({ attendance });
  } catch (err) {
    console.error('Get attendance error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update attendance (Admin/HR only)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { attendanceId, status, checkInTime, checkOutTime, notes } = await req.json();

    if (!attendanceId) {
      return NextResponse.json({ error: 'Attendance ID is required' }, { status: 400 });
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    if (status) attendance.status = status;
    if (checkInTime) attendance.checkInTime = new Date(checkInTime);
    if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);
    if (notes !== undefined) attendance.notes = notes;
    attendance.editedBy = user._id;

    await attendance.save();

    return NextResponse.json({ 
      message: 'Attendance updated successfully',
      attendance 
    });
  } catch (err) {
    console.error('Update attendance error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
