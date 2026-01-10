import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Leave } from '@/models/leave';
import { LeaveBalance } from '@/models/leaveBalance';

// PUT - Approve/Reject leave (Admin/HR only)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    // Await params for Next.js 15+
    const { id } = await context.params;

    console.log('PUT request for leave ID:', id); // Debug log
    console.log('Current user:', user?.email, user?.role); // Debug log

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'hr_officer';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin/HR access required' }, { status: 403 });
    }

    const body = await req.json();
    const { status, rejectionReason } = body;

    console.log('Request body:', { status, rejectionReason }); // Debug log

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid status (approved/rejected) is required' }, { status: 400 });
    }

    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('Invalid leave ID format:', id);
      return NextResponse.json({ error: 'Invalid leave ID format' }, { status: 400 });
    }

    const leave = await Leave.findById(id);
    console.log('Leave found:', leave ? 'Yes' : 'No'); // Debug log
    console.log('Leave status:', leave?.status); // Debug log

    if (!leave) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    if (leave.status !== 'pending') {
      return NextResponse.json({ error: `Leave request already processed (current status: ${leave.status})` }, { status: 400 });
    }

    leave.status = status;
    leave.approvedBy = user._id;
    leave.approvedAt = new Date();
    if (status === 'rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();
    console.log('Leave updated successfully'); // Debug log

    // Update leave balance if approved
    if (status === 'approved') {
      const leaveBalance = await LeaveBalance.findOne({ employeeId: leave.employeeId });
      console.log('Leave balance found:', leaveBalance ? 'Yes' : 'No'); // Debug log
      
      if (leaveBalance) {
        if (leave.leaveType === 'paid_leave') {
          leaveBalance.paidLeaveUsed += leave.totalDays;
        } else if (leave.leaveType === 'sick_leave') {
          leaveBalance.sickLeaveUsed += leave.totalDays;
        }
        await leaveBalance.save();
        console.log('Leave balance updated'); // Debug log
      }
    }

    return NextResponse.json({ 
      message: `Leave request ${status} successfully`,
      leave 
    });
  } catch (err) {
    console.error('Update leave error:', err);
    return NextResponse.json({ 
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Cancel leave request (Employee only)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    // Await params for Next.js 15+
    const { id } = await context.params;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leave = await Leave.findById(id);
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

    await Leave.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Leave request cancelled successfully' });
  } catch (err) {
    console.error('Delete leave error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}