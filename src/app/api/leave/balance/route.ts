import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { LeaveBalance } from '@/models/leaveBalance';
import { User } from '@/models/user';

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    const targetEmployeeId = isAdmin && employeeId ? employeeId : user._id.toString();

    // If admin is viewing someone else's balance, verify the employee exists
    if (isAdmin && employeeId && employeeId !== user._id.toString()) {
      const targetUser = await User.findById(employeeId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    let leaveBalance = await LeaveBalance.findOne({ employeeId: targetEmployeeId });

    if (!leaveBalance) {
      // Create default balance if doesn't exist
      leaveBalance = await LeaveBalance.create({
        employeeId: targetEmployeeId,
        paidLeave: 20,
        sickLeave: 10,
        paidLeaveUsed: 0,
        sickLeaveUsed: 0
      });
    }

    return NextResponse.json({ 
      leaveBalance: {
        paidLeave: leaveBalance.paidLeave,
        paidLeaveUsed: leaveBalance.paidLeaveUsed,
        paidLeaveRemaining: leaveBalance.paidLeave - leaveBalance.paidLeaveUsed,
        sickLeave: leaveBalance.sickLeave,
        sickLeaveUsed: leaveBalance.sickLeaveUsed,
        sickLeaveRemaining: leaveBalance.sickLeave - leaveBalance.sickLeaveUsed,
        unpaidLeave: leaveBalance.unpaidLeave
      }
    });
  } catch (err) {
    console.error('Get leave balance error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
