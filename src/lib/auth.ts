import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
            async authorize(credentials) {
        await connectDB();
        
        // Try to find user by email or loginId
        const loginIdentifier = credentials?.email;
        const user = await User.findOne({
          $or: [
            { email: loginIdentifier },
            { loginId: loginIdentifier }
          ]
        });

        if (!user) {
          throw new Error('Invalid login ID/email or password');
        }

        if (!user.isVerified) {
          throw new Error('Account not verified. Please contact your administrator.');
        }

        const isValidPassword = await bcrypt.compare(credentials!.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid login ID/email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          loginId: user.loginId,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account?.provider === 'google') {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Generate employee ID for Google sign-in
          function generateEmployeeId(): string {
            const prefix = 'EMP';
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            return `${prefix}-${randomNum}`;
          }
          let employeeId = generateEmployeeId();
          let exists = await User.findOne({ employeeId });
          while (exists) {
            employeeId = generateEmployeeId();
            exists = await User.findOne({ employeeId });
          }
          
          await User.create({
            email: user.email,
            password: '',
            firstName: user.name?.split(' ')[0] || 'User',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            employeeId,
            role: 'employee',
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.employeeId = dbUser.employeeId;
          token.loginId = dbUser.loginId;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string;
        session.user.loginId = token.loginId as string;

        // Update lastSeen
        await connectDB();
        await User.findOneAndUpdate(
          { email: session.user.email },
          { $set: { lastSeen: new Date() } }
        );
      }

      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
