import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Leave } from '@/models/leave';
import { LeaveBalance } from '@/models/leaveBalance';

// PUT - Approve/Reject leave (Admin/HR only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const { status, rejectionReason } = await req.json();

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid status (approved/rejected) is required' }, { status: 400 });
    }

    const leave = await Leave.findById(params.id);
    if (!leave) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    if (leave.status !== 'pending') {
      return NextResponse.json({ error: 'Leave request already processed' }, { status: 400 });
    }

    leave.status = status;
    leave.approvedBy = user._id;
    leave.approvedAt = new Date();
    if (status === 'rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    // Update leave balance if approved
    if (status === 'approved') {
      const leaveBalance = await LeaveBalance.findOne({ employeeId: leave.employeeId });
      if (leaveBalance) {
        if (leave.leaveType === 'paid_leave') {
          leaveBalance.paidLeaveUsed += leave.totalDays;
        } else if (leave.leaveType === 'sick_leave') {
          leaveBalance.sickLeaveUsed += leave.totalDays;
        }
        await leaveBalance.save();
      }
    }

    return NextResponse.json({ 
      message: `Leave request ${status} successfully`,
      leave 
    });
  } catch (err) {
    console.error('Update leave error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Cancel leave request (Employee only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leave = await Leave.findById(params.id);
    if (!leave) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    // Only employee can cancel their own pending leave
    if (leave.employeeId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (leave.status !== 'pending') {
      return NextResponse.json({ error: 'Only pending leave requests can be cancelled' }, { status: 400 });
    }

    await Leave.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Leave request cancelled successfully' });
  } catch (err) {
    console.error('Delete leave error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
