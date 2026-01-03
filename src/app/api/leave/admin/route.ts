import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { Leave } from '@/models/leave';

// GET - Get all employees' leave records (Admin/HR only)
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
    const status = searchParams.get('status');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .populate('employeeId', 'firstName lastName employeeId designation')
      .populate('approvedBy', 'firstName lastName');

    return NextResponse.json({ leaves });
  } catch (err) {
    console.error('Get admin leaves error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


