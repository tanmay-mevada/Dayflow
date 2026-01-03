import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Leave } from '@/models/leave';
import { LeaveBalance } from '@/models/leaveBalance';
import { User } from '@/models/user';

// GET - Get leave records
export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    const query: any = { employeeId: targetEmployeeId };
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .populate('employeeId', 'firstName lastName employeeId')
      .populate('approvedBy', 'firstName lastName');

    return NextResponse.json({ leaves });
  } catch (err) {
    console.error('Get leaves error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create leave request
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leaveType, startDate, endDate, reason, attachment } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ 
        error: 'Leave type, start date, end date, and reason are required' 
      }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 });
    }

    // Check leave balance
    let leaveBalance = await LeaveBalance.findOne({ employeeId: user._id });
    if (!leaveBalance) {
      leaveBalance = await LeaveBalance.create({
        employeeId: user._id,
        paidLeave: 20,
        sickLeave: 10
      });
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check if enough leave balance (for paid and sick leave)
    if (leaveType === 'paid_leave' && (leaveBalance.paidLeave - leaveBalance.paidLeaveUsed) < totalDays) {
      return NextResponse.json({ 
        error: 'Insufficient paid leave balance' 
      }, { status: 400 });
    }

    if (leaveType === 'sick_leave' && (leaveBalance.sickLeave - leaveBalance.sickLeaveUsed) < totalDays) {
      return NextResponse.json({ 
        error: 'Insufficient sick leave balance' 
      }, { status: 400 });
    }

    const leave = await Leave.create({
      employeeId: user._id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      attachment,
      status: 'pending'
    });

    return NextResponse.json({ 
      message: 'Leave request created successfully',
      leave 
    });
  } catch (err) {
    console.error('Create leave error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
