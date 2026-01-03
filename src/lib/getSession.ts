import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import connectDB from './db';
import { User } from '@/models/user';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

