'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const EmployeeAttendancePage = () => {
  // --- STATE ---
  const [currentMonth, setCurrentMonth] = useState(new Date('2025-10-01'));

  // --- MOCK DATA: Personal Attendance Log ---
  const myAttendance = [
    { date: '28/10/2025', checkIn: '10:00', checkOut: '19:00', status: 'Present' },
    { date: '29/10/2025', checkIn: '10:00', checkOut: '19:00', status: 'Present' },
    { date: '30/10/2025', checkIn: '10:15', checkOut: '19:30', status: 'Late' },
    { date: '31/10/2025', checkIn: '09:00', checkOut: '17:00', status: 'Half-Day' },
  ];

  // --- STATS DATA (Calculated from Month) ---
  const stats = {
    presentDays: 22,
    leavesTaken: 2,
    totalWorkingDays: 24
  };

  // --- HELPER: Logic to calculate hours & overtime ---
  const calculateDailyHours = (checkIn: string, checkOut: string) => {
    // Basic parser for "HH:MM" format
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    
    // Calculate difference in minutes
    const diffMins = (outH * 60 + outM) - (inH * 60 + inM);
    
    // Deduct standard 1-hour break (60 mins)
    const breakMins = 60;
    const workMins = Math.max(0, diffMins - breakMins);
    
    // Standard shift is 8 hours (480 mins)
    const standardShiftMins = 480;
    const extraMins = Math.max(0, workMins - standardShiftMins);

    const format = (m: number) => {
       const h = Math.floor(m / 60).toString().padStart(2, '0');
       const min = (m % 60).toString().padStart(2, '0');
       return `${h}:${min}`;
    };

    return {
      work: format(workMins),
      extra: format(extraMins)
    };
  };

  // --- HANDLERS ---
  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); // e.g. "Oct 2025"
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
          <p className="mt-1 text-slate-500">View your daily logs and work hour summary.</p>
        </div>

        {/* --- 1. Top Controls & Stats Bar --- */}
        <div className="flex flex-col items-center justify-between gap-4 p-4 text-white shadow-lg bg-slate-900 rounded-xl md:flex-row">
           
           {/* Navigation Group */}
           <div className="flex items-center gap-2">
              <div className="flex items-center p-1 border rounded-lg bg-slate-800 border-slate-700">
                 <button onClick={handlePrevMonth} className="p-2 transition-colors rounded-md hover:bg-slate-700 text-slate-400 hover:text-white">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button onClick={handleNextMonth} className="p-2 transition-colors rounded-md hover:bg-slate-700 text-slate-400 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
              
              {/* Month Display Box */}
              <div className="bg-slate-800 border border-slate-700 px-6 py-2 rounded-lg font-mono font-bold flex items-center gap-2 min-w-[140px] justify-center">
                 <Calendar className="w-4 h-4 text-slate-500" />
                 {formatMonth(currentMonth)}
              </div>
           </div>

           {/* Stats Cards (Wireframe Style) */}
           <div className="flex flex-wrap w-full gap-2 md:w-auto">
              <div className="flex-1 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center min-w-[120px]">
                 <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Count of days present</div>
                 <div className="text-xl font-bold text-emerald-400">{stats.presentDays}</div>
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center min-w-[120px]">
                 <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Leaves count</div>
                 <div className="text-xl font-bold text-amber-400">{stats.leavesTaken}</div>
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center min-w-[120px]">
                 <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Total working days</div>
                 <div className="text-xl font-bold text-blue-400">{stats.totalWorkingDays}</div>
              </div>
           </div>

        </div>

        {/* --- 2. Attendance Table --- */}
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
           
           {/* Table Header Date Display */}
           <div className="flex items-center gap-2 p-4 font-medium border-b bg-slate-50 border-slate-100 text-slate-700">
              <Calendar className="w-4 h-4" /> 
              Showing logs for {formatMonth(currentMonth)}
           </div>

           <table className="w-full text-sm text-left">
              <thead className="font-medium text-white bg-slate-900">
                 <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work Hours</th>
                    <th className="px-6 py-4">Extra Hours</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 bg-slate-900/95">
                 {myAttendance.map((record, index) => {
                    const hours = calculateDailyHours(record.checkIn, record.checkOut);
                    
                    return (
                       <tr key={index} className="transition-colors border-b hover:bg-slate-800 border-slate-800">
                          <td className="px-6 py-4 font-mono text-slate-300">{record.date}</td>
                          <td className="px-6 py-4 font-mono text-slate-400">{record.checkIn}</td>
                          <td className="px-6 py-4 font-mono text-slate-400">{record.checkOut}</td>
                          <td className="px-6 py-4">
                             <span className="font-bold text-slate-200">{hours.work}</span>
                          </td>
                          <td className="px-6 py-4">
                             {/* Highlight Extra Hours if > 00:00 */}
                             <span className={`font-mono font-medium ${hours.extra !== '00:00' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {hours.extra}
                             </span>
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
           
           {/* Empty State / Footer */}
           {myAttendance.length > 0 ? (
             <div className="flex items-center gap-2 p-4 text-xs border-t bg-slate-900 border-slate-800 text-slate-500">
                <AlertCircle className="w-3 h-3" />
                <span>Work hours are calculated excluding 1 hour break. Extra hours start after 8 hours of work.</span>
             </div>
           ) : (
             <div className="p-12 text-center text-slate-500 bg-slate-900">
                No attendance records found for this month.
             </div>
           )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EmployeeAttendancePage;