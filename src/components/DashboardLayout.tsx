"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  User, 
  LogOut, 
  Users, 
  BarChart3 // <--- 1. Import BarChart3 icon
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const isAdmin = role === 'admin' || role === 'hr_officer';

  // --- NAVIGATION ITEMS ---
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { name: 'Leave Requests', href: '/dashboard/leave', icon: Calendar },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Payroll', href: '/dashboard/payroll', icon: User },

    
    // --- 2. NEW ANALYTICS OPTION ADDED HERE ---
    ...(isAdmin ? [
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ] : []),
    // ------------------------------------------

    // Admin only items
    ...(isAdmin ? [
      { name: 'Create Employee', href: '/dashboard/employees/create', icon: Users },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Dayflow</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger could go here */}
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;