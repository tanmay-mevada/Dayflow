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
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.isVerified) {
          throw new Error('Account not verified. Please check your email.');
        }

        const isValidPassword = await bcrypt.compare(credentials!.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
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
          await User.create({
            email: user.email,
            password: '',
            role: 'student',
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
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;

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
