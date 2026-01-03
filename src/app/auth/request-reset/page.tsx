'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success('Reset link sent! Check your email.');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
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
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
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

      {/* Reset Password Form Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10 pt-24">
        <div className="w-full max-w-sm sm:max-w-md p-8 sm:p-10 border rounded-2xl shadow-xl bg-white border-slate-200">
          <h1 className="mb-2 text-3xl font-bold text-center text-slate-900">
            Forgot your password?
          </h1>
          <p className="text-sm text-center text-slate-600 mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused || email
                    ? '-top-2 text-xs bg-white px-2 text-blue-600'
                    : 'top-3 text-sm text-slate-500'
                }`}
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-600">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
