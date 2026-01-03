import { NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/utils/sendOtpEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: 'student',
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
