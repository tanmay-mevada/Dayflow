import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

//homepage component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* --- Navigation  --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Dayflow
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Features</Link>
              <Link href="#roles" className="text-sm font-medium hover:text-blue-600 transition-colors">For Teams</Link>
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

      {/* --- Hero Section [cite: 2, 6] --- */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-100">
            Human Resource Management System
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Every workday, <br />
            <span className="text-blue-600">perfectly aligned.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Digitize and streamline your core HR operations. From onboarding and profile management 
            to attendance tracking and payroll visibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-all">
              Start for Free <ArrowRight className="h-4 w-4" />
            </button>
            <button className="px-8 py-3.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* --- Core Features Grid [cite: 8, 10, 11] --- */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage your team</h2>
            <p className="text-slate-600">Comprehensive tools for Admins and Employees.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Attendance [cite: 10, 66] */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Daily and weekly views with seamless check-in/check-out options. Track Present, Absent, and Half-day status easily.
              </p>
            </div>

            {/* Feature 2: Leave Management [cite: 11, 77] */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <CalendarCheck className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Leave Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Apply for Paid, Sick, or Unpaid leave. Admins can approve or reject requests with immediate reflection in records.
              </p>
            </div>

            {/* Feature 3: Profile Management [cite: 10, 53] */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Employee Profiles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Centralized hub for personal details, job roles, and documents. Securely manage address and contact information.
              </p>
            </div>

             {/* Feature 4: Payroll [cite: 6, 94] */}
             <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Payroll Visibility</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Transparent salary structure views for employees and comprehensive payroll control for Admins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Roles Section [cite: 16, 17, 18, 20] --- */}
      <section id="roles" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Admin Column [cite: 18, 22] */}
            <div className="relative p-10 bg-slate-900 rounded-3xl text-white overflow-hidden">
               <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs font-medium mb-6">
                  <ShieldCheck className="h-3 w-3" /> Admin View
                </div>
                <h3 className="text-2xl font-bold mb-4">Total Control for HR Officers</h3>
                <ul className="space-y-3">
                  {['Approve leave & attendance', 'Manage employee records', 'Update salary structures', 'View analytics & reports'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-blue-400" /> {item}
                    </li>
                  ))}
                </ul>
               </div>
            </div>

            {/* Employee Column [cite: 20, 23] */}
            <div>
               <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-6">
                  <Users className="h-3 w-3" /> Employee View
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Empower your workforce</h3>
                <p className="text-slate-600 mb-8">
                  Give your employees the autonomy to manage their work life. From checking in daily to downloading salary slips, everything is one click away.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="font-semibold text-slate-900">Easy Check-in</div>
                    <div className="text-xs text-slate-500 mt-1">Daily status tracking</div>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="font-semibold text-slate-900">Leave Requests</div>
                    <div className="text-xs text-slate-500 mt-1">Real-time status updates</div>
                  </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1 rounded-md">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Dayflow</span>
            </div>
            <p className="text-sm text-slate-500">© 2026 Dayflow HRMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;