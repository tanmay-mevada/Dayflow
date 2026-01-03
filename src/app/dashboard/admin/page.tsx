'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Plane,
  Mail
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/employees');
        const data = await res.json();
        if (res.ok) {
          setEmployees(data.employees || []);
        } else {
          toast.error(data.error || 'Failed to fetch employees');
        }
      } catch (error) {
        toast.error('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Get employee status based on user.status field
  const getEmployeeStatus = (employee: any) => {
    if (employee.status === 'working') return 'Present';
    if (employee.status === 'on_leave') return 'Leave';
    return 'Absent';
  };

  // Helper to render the specific indicator requested in the image details
  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case 'Present':
        // Green dot: Employee is present in the office
        return <div className="h-4 w-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" title="Present"></div>;
      case 'Leave':
        // Airplane icon: Employee is on leave
        return (
          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-blue-600" title="On Leave">
            <Plane className="h-3 w-3 fill-current" />
          </div>
        );
      case 'Absent':
        // Yellow dot: Employee is absent (No time off applied)
        return <div className="h-4 w-4 bg-amber-400 rounded-full border-2 border-white shadow-sm" title="Absent"></div>;
      default:
        return null;
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const email = (emp.email || '').toLowerCase();
    const employeeId = (emp.employeeId || '').toLowerCase();
    const designation = (emp.designation || '').toLowerCase();
    return fullName.includes(query) || email.includes(query) || employeeId.includes(query) || designation.includes(query);
  });

  // Get profile image
  const getProfileImage = (employee: any) => {
    if (employee.profilePicture) return employee.profilePicture;
    const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        
        {/* --- Top Navigation Tabs (Matching Wireframe Header) --- */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
           <Link 
             href="/dashboard/admin"
             className={`pb-4 text-sm font-semibold transition-colors relative ${
               'text-slate-900'
             }`}
           >
             Employees
             <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></span>
           </Link>
           <Link 
             href="/dashboard/attendance"
             className="pb-4 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
           >
             Attendance
           </Link>
           <Link 
             href="/dashboard/leave"
             className="pb-4 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
           >
             Time Off
           </Link>
        </div>

        {/* --- Action Bar (New Button & Search) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           
           {/* Action Buttons */}
           <div className="flex items-center gap-3">
             {/* "NEW" Button - Purple as requested */}
             <Link href="/dashboard/employees/create">
               <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-md shadow-purple-200 font-medium text-sm uppercase tracking-wide">
                  <Plus className="h-4 w-4" /> New
               </button>
             </Link>
             
             {/* Send Notification Button */}
             <Link href="/dashboard/admin/notifications">
               <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 font-medium text-sm">
                 <Mail className="h-4 w-4" /> Send Notification
               </button>
             </Link>
           </div>

           {/* Search Bar */}
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search employees..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
              />
           </div>
        </div>

        {/* --- Employee Grid Cards --- */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading employees...</div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">
              {searchQuery ? 'No employees found matching your search.' : 'No employees found.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((emp) => {
              const status = getEmployeeStatus(emp);
              const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
              return (
                <div 
                  key={emp._id || emp.id}
                  onClick={() => router.push(`/dashboard/admin/profile?employeeId=${emp._id}`)}
                  className="group bg-white rounded-xl border border-slate-200 p-6 relative hover:shadow-lg hover:border-purple-100 transition-all duration-300 cursor-pointer"
                >
                  {/* STATUS INDICATOR (Top Right Corner) */}
                  <div className="absolute top-4 right-4 z-10">
                     {renderStatusIndicator(status)}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col items-center pt-2">
                    {/* Profile Picture */}
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={getProfileImage(emp)} 
                          alt={fullName} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Employee Info */}
                    <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-4">{emp.designation || 'Employee'}</p>
                    
                    {/* View Profile Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/admin/profile?employeeId=${emp._id}`);
                      }}
                      className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-purple-600 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;