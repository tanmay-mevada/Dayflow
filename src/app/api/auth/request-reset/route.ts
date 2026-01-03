import { User } from '@/models/user';
import connectDB from '@/lib/db';
import crypto from 'crypto';
import { sendResetEmail } from '@/utils/sendResetEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    await sendResetEmail(email, token);

    return Response.json({ message: 'Reset link sent successfully.' });
  } catch (err) {
    console.error('Error in request-reset:', err);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
