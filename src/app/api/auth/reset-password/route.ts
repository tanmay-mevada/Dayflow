import { User } from '@/models/user';
import connectDB from '@/lib/db';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gte: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    user.password = await hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
