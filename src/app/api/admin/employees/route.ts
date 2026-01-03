import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/getSession';
import { User } from '@/models/user';

// GET - Get all employees (Admin/HR only)
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

    const employees = await User.find({})
      .select('-password -otp -otpExpires -resetToken -resetTokenExpiry')
      .sort({ createdAt: -1 });

    return NextResponse.json({ employees });
  } catch (err) {
    console.error('Get employees error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}



