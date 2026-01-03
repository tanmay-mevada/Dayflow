import { NextResponse } from 'next/server';
import { User } from '@/models/user'; // make sure this imports the Mongoose model correctly
import connectDB from '@/lib/db';

export async function GET(req: Request) {
  try {
    await connectDB(); // ensure DB connection

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    console.log("Validating token:", token);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gte: new Date() },
    });

    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    return NextResponse.json({ email: user.email });
  } catch (err) {
    console.error('Error validating token:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
