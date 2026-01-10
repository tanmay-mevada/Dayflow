'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState({ email: false, password: false });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      toast.error('Invalid email or password');
    } else {
      toast.success('Login successful!');
      window.location.href = '/dashboard';
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Dayflow
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Features</Link>
              <Link href="/#roles" className="text-sm font-medium hover:text-blue-600 transition-colors">For Teams</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <button className="text-sm  font-medium text-slate-600 hover:text-slate-900">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10 pt-24">
        <div className="w-full max-w-sm sm:max-w-md p-8 sm:p-10 border rounded-2xl shadow-xl bg-white border-slate-200">
          <h1 className="mb-6 text-3xl font-bold text-center text-slate-900">
            Log In to Dayflow
          </h1>

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            {/* Login ID/Email */}
            <div className="relative">
            <input
              type="text"
              id="email"
              className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
              placeholder="Login ID/Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused({ ...focused, email: true })}
              onBlur={() => setFocused({ ...focused, email: false })}
              required
            />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-200 pointer-events-none
                  ${focused.email || form.email
                    ? '-top-2 text-xs bg-white px-2 text-blue-600'
                    : 'top-3 text-sm text-slate-500'
                  }`}
              >
                Login ID/Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocused({ ...focused, password: true })}
              onBlur={() => setFocused({ ...focused, password: false })}
              required
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-200 pointer-events-none
                ${focused.password || form.password
                  ? '-top-2 text-xs bg-white px-2 text-blue-600'
                  : 'top-3 text-sm text-slate-500'
                }`}
            >
              Password
            </label>
          </div>

          <div className="flex justify-end items-center">
            <Link href="/auth/request-reset" className="w-full flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors ">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Log In <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="relative flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors duration-200"
        >
          <span className="flex items-center justify-center w-5 h-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </span>
          <span className="text-sm font-medium text-slate-700">
            Continue with Google
          </span>
        </button>

        <p className="mt-6 text-sm text-center text-slate-600">
          Not a user yet?{' '}
          <Link
            href="/auth/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
