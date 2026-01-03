import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';

export async function POST(req: Request) {
  await connectDB();

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.isVerified) {
    return NextResponse.json({ error: 'User already verified' }, { status: 400 });
  }

  if (user.otp !== otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  if (user.otpExpires < new Date()) {
    return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return NextResponse.json({ message: 'User verified successfully' });
}
