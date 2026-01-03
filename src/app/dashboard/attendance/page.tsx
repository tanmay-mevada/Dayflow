'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download,
  ShieldAlert
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const AttendancePage = () => {
  // --- STATE MANAGEMENT ---
  const [role, setRole] = useState<'employee' | 'admin'>('employee'); // Toggle for Demo
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');

  // --- MOCK DATA: EMPLOYEE (Personal View) ---
  const myAttendance = [
    { date: 'Oct 24, 2025', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 0m', status: 'Present' },
    { date: 'Oct 23, 2025', checkIn: '09:15 AM', checkOut: '01:30 PM', hours: '4h 15m', status: 'Half-day' },
    { date: 'Oct 22, 2025', checkIn: '-', checkOut: '-', hours: '0h 0m', status: 'Absent' },
  ];

  // --- MOCK DATA: ADMIN (All Employees View) ---
  const allEmployeesAttendance = [
    { id: 'EMP-001', name: 'John Doe', department: 'Engineering', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present' },
    { id: 'EMP-002', name: 'Sarah Smith', department: 'HR', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'Present' },
    { id: 'EMP-003', name: 'Mike Johnson', department: 'Sales', checkIn: '-', checkOut: '-', status: 'Absent' },
    { id: 'EMP-004', name: 'Emily Davis', department: 'Marketing', checkIn: '-', checkOut: '-', status: 'Leave' },
    { id: 'EMP-005', name: 'Robert Brown', department: 'Engineering', checkIn: '10:00 AM', checkOut: '02:00 PM', status: 'Half-day' },
  ];

  // --- HELPER FUNCTIONS ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Half-day': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Leave': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- DEMO TOGGLE (Remove in Production) --- */}
        <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
             <ShieldAlert className="h-5 w-5 text-yellow-400" />
             <span className="text-sm font-medium">Demo Mode: View Page As</span>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-md">
            <button 
              onClick={() => setRole('employee')}
              className={`px-3 py-1 text-xs font-bold rounded ${role === 'employee' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Employee
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`px-3 py-1 text-xs font-bold rounded ${role === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Admin / HR
            </button>
          </div>
        </div>

        {/* =================================================================================
            VIEW 1: EMPLOYEE INTERFACE (Own Attendance Only) 
           ================================================================================= */}
        {role === 'employee' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-slate-900">My Attendance</h2>
                  <p className="text-slate-500 mt-1">Track your daily check-ins and work hours.</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" /> Shift: 09:00 AM - 06:00 PM
                  </div>
               </div>
               <div className="relative z-10">
                 <button className="h-32 w-32 rounded-full bg-emerald-600 text-white shadow-xl flex flex-col items-center justify-center hover:scale-105 transition-transform">
                    <span className="text-2xl font-bold">09:41</span>
                    <span className="text-xs font-bold uppercase mt-1">Check Out</span>
                 </button>
               </div>
            </div>

            {/* Personal Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-semibold text-slate-700">Attendance Log</h3>
                 <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                    <button onClick={() => setViewType('daily')} className={`px-3 py-1 text-xs font-medium rounded ${viewType === 'daily' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Daily</button>
                    <button onClick={() => setViewType('weekly')} className={`px-3 py-1 text-xs font-medium rounded ${viewType === 'weekly' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Weekly</button>
                 </div>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work Hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAttendance.map((record, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{record.date}</td>
                      <td className="px-6 py-4 text-slate-600">{record.checkIn}</td>
                      <td className="px-6 py-4 text-slate-600">{record.checkOut}</td>
                      <td className="px-6 py-4 text-slate-600">{record.hours}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* =================================================================================
            VIEW 2: ADMIN / HR INTERFACE (All Employees) 
           ================================================================================= */}
        {role === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Admin Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Employee Attendance</h2>
                 <p className="text-slate-500 mt-1">Overview of all employee check-ins for today.</p>
               </div>
               <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium">
                    <Download className="h-4 w-4" /> Export Report
                 </button>
                 <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2">
                    <CalendarDays className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-700">Oct 24, 2025</span>
                 </div>
               </div>
            </div>

            {/* Admin Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <div className="text-slate-500 text-xs font-medium uppercase">Total Employees</div>
                 <div className="text-2xl font-bold text-slate-900 mt-1">42</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <div className="text-emerald-600 text-xs font-medium uppercase">Present Today</div>
                 <div className="text-2xl font-bold text-slate-900 mt-1">38</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <div className="text-amber-600 text-xs font-medium uppercase">On Leave</div>
                 <div className="text-2xl font-bold text-slate-900 mt-1">2</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <div className="text-red-600 text-xs font-medium uppercase">Absent</div>
                 <div className="text-2xl font-bold text-slate-900 mt-1">2</div>
               </div>
            </div>

            {/* Master Attendance Table  */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               {/* Table Filters */}
               <div className="p-4 border-b border-slate-100 flex gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search employee by name or ID..." 
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-sm">
                    <Filter className="h-4 w-4" /> Filter Status
                  </button>
               </div>

               <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allEmployeesAttendance.map((record, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                              {record.name.charAt(0)}
                           </div>
                           <div>
                             <div className="font-medium text-slate-900">{record.name}</div>
                             <div className="text-xs text-slate-400">{record.id}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{record.department}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono">{record.checkIn}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono">{record.checkOut}</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
               </table>
               
               {/* Pagination */}
               <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                  <span>Showing 1-5 of 42 records</span>
                  <div className="flex gap-2">
                     <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-50" disabled><ChevronLeft className="h-4 w-4" /></button>
                     <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="h-4 w-4" /></button>
                  </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;