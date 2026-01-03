import { NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/utils/sendOtpEmail';

// Generate unique employee ID
function generateEmployeeId(): string {
  const prefix = 'EMP';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, firstName, lastName, role } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Email, password, first name, and last name are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Generate unique employee ID
    let employeeId = generateEmployeeId();
    let exists = await User.findOne({ employeeId });
    while (exists) {
      employeeId = generateEmployeeId();
      exists = await User.findOne({ employeeId });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      employeeId,
      role: role || 'employee',
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent to email', employeeId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
