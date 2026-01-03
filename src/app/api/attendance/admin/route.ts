import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Attendance } from '@/models/attendance';
import { User } from '@/models/user';

// GET - Get all employees' attendance for a specific date (Admin/HR only)
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    // Parse the date and set to start and end of day
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all employees
    const employees = await User.find({})
      .select('_id firstName lastName employeeId designation profilePicture status');

    // Get attendance records for the specified date
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('employeeId', 'firstName lastName employeeId designation profilePicture status');

    // Create a map of employee ID to attendance record
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      const empId = typeof record.employeeId === 'object' && record.employeeId !== null
        ? record.employeeId._id?.toString() || record.employeeId.toString()
        : record.employeeId.toString();
      attendanceMap.set(empId, record);
    });

    // Combine employees with their attendance records
    const result = employees.map(employee => {
      const empId = employee._id.toString();
      const attendance = attendanceMap.get(empId);
      
      return {
        employee: {
          _id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          employeeId: employee.employeeId,
          designation: employee.designation,
          profilePicture: employee.profilePicture,
          status: employee.status
        },
        attendance: attendance ? {
          _id: attendance._id,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
          status: attendance.status,
          totalHours: attendance.totalHours
        } : null
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('Get admin attendance error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

