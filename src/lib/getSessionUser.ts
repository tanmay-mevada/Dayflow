import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import connectDB from './db';
import { User } from '@/models/user';

export async function getSessionUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}

