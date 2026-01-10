"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  Users, 
  ChevronDown, 
  Banknote, 
  BarChart3,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleMyProfile = () => {
    setShowDropdown(false);
    router.push('/dashboard/profile');
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const isAdmin = role === 'admin' || role === 'hr_officer';

  // --- NAVIGATION ITEMS BASED ON ROLE ---
  const employeeNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { name: 'Leave Requests', href: '/dashboard/leave', icon: Calendar },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Payroll', href: '/dashboard/payroll', icon: Banknote },
  ];

  const adminNavItems = [
    { name: 'Employees', href: '/dashboard/admin', icon: Users },
    { name: 'Attendance', href: '/dashboard/admin/attendance', icon: Clock },
    { name: 'Leave Requests', href: '/dashboard/admin/leave', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Create Employee', href: '/dashboard/employees/create', icon: UserPlus },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
  ];

  // Select navigation based on role
  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard/admin') return 'Employee Management';
    if (pathname === '/dashboard/admin/attendance') return 'Attendance Management';
    if (pathname === '/dashboard/admin/timeoff') return 'Time Off Management';
    if (pathname === '/dashboard/admin/profile') return 'Employee Profile';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    if (pathname === '/dashboard/employees/create') return 'Create Employee';
    if (pathname === '/dashboard/profile') return 'My Profile';
    if (pathname === '/dashboard/attendance') return 'My Attendance';
    if (pathname === '/dashboard/leave') return 'My Leave Requests';
    if (pathname === '/dashboard/payroll') return 'Payroll';
    if (pathname === '/dashboard') return isAdmin ? 'Admin Dashboard' : 'Dashboard';
    
    // Fallback: capitalize last segment
    return pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed z-10 flex-col hidden w-64 h-full text-white bg-slate-900 md:flex">
        <div className="flex items-center gap-2 p-6 border-b border-slate-800">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">Dayflow</span>
            {isAdmin && (
              <span className="text-xs text-slate-400">Admin Panel</span>
            )}
          </div>
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
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 transition-colors text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen md:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              {getPageTitle()}
            </h1>
            {isAdmin && pathname === '/dashboard/admin' && (
              <p className="text-sm text-slate-500">Manage your team members</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* User Info Badge */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <span className="text-xs font-medium text-blue-700">
                  {role === 'admin' ? 'Admin' : 'HR Officer'}
                </span>
              </div>
            )}
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border rounded-lg shadow-lg border-slate-200">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleMyProfile}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-slate-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
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