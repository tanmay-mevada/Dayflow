'use client';

import Link from 'next/link';
import { Clock, ShieldAlert } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10 bg-gray-50">
      <div className="w-full max-w-md p-8 border rounded-xl shadow-lg bg-white border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Employee Registration
          </h1>
        </div>

        {/* Warning Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Admin/HR Only
              </h3>
              <p className="text-sm text-amber-800">
                Employee registration is restricted to administrators and HR officers only.
                If you need to create an employee account, please contact your system administrator
                or log in as an admin/HR officer.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Developers Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
          <p className="font-semibold mb-1">
            Need Admin Credentials?
          </p>
          <p>
            Please contact the development team at{' '}
            <a
              href="mailto:turbo.cpp.nu@gmail.com"
              className="font-medium underline hover:text-blue-900"
            >
              turbo.cpp.nu@gmail.com
            </a>{' '}
            to obtain admin or HR login credentials.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600 mb-4">
            Already have an account?
          </p>
          <Link
            href="/auth/login"
            className="block w-full py-3 text-center font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
