import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/utils/sendOtpEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email });

    if (existing && existing.isVerified) {
      return NextResponse.json({ error: 'User already exists and is verified' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (existing) {
      existing.password = hashedPassword;
      existing.otp = otp;
      existing.otpExpires = otpExpires;
      await existing.save();
    } else {
      await User.create({
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      });
    }

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
