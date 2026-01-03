'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAttendance } from '@/hooks/useAttendance';
import { leaveApi } from '@/lib/api';

const EmployeeAttendancePage = () => {
  // --- STATE ---
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  // Calculate month date range
  const monthRange = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }, [currentMonth]);

  const { attendance, loading } = useAttendance(
    undefined,
    monthRange.startDate,
    monthRange.endDate
  );

  // Fetch leaves for the month
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoadingLeaves(true);
        const data = await leaveApi.getRecords({ status: 'approved' });
        setLeaves(data.leaves || []);
      } catch (error) {
        console.error('Failed to fetch leaves:', error);
        setLeaves([]);
      } finally {
        setLoadingLeaves(false);
      }
    };
    fetchLeaves();
  }, [currentMonth]);

  // --- HELPER: Calculate hours & overtime from Date objects ---
  const calculateDailyHours = (checkInTime: Date | string | null, checkOutTime: Date | string | null) => {
    if (!checkInTime || !checkOutTime) {
      return { work: '00:00', extra: '00:00' };
    }

    const checkIn = typeof checkInTime === 'string' ? new Date(checkInTime) : checkInTime;
    const checkOut = typeof checkOutTime === 'string' ? new Date(checkOutTime) : checkOutTime;
    
    // Calculate difference in minutes
    const diffMins = Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60));
    
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

  // Format date to DD/MM/YYYY
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time to HH:MM
  const formatTime = (date: Date | string | null) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Count present days (days with check-in and check-out)
    const presentDays = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return record.checkInTime && record.checkOutTime && 
             recordDate >= monthStart && recordDate <= monthEnd &&
             record.status === 'present';
    }).length;

    // Count leaves in this month
    const monthLeaves = leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return (leaveStart >= monthStart && leaveStart <= monthEnd) ||
             (leaveEnd >= monthStart && leaveEnd <= monthEnd) ||
             (leaveStart <= monthStart && leaveEnd >= monthEnd);
    });
    
    let leavesTaken = 0;
    monthLeaves.forEach(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      const overlapStart = leaveStart < monthStart ? monthStart : leaveStart;
      const overlapEnd = leaveEnd > monthEnd ? monthEnd : leaveEnd;
      const days = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      leavesTaken += days;
    });

    // Calculate total working days (excluding weekends for simplicity, can be enhanced)
    let totalWorkingDays = 0;
    const current = new Date(monthStart);
    while (current <= monthEnd) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
        totalWorkingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return {
      presentDays,
      leavesTaken,
      totalWorkingDays
    };
  }, [attendance, leaves, currentMonth]);

  // Format attendance records for display
  const formattedAttendance = useMemo(() => {
    return attendance
      .filter(record => {
        const recordDate = new Date(record.date);
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        return recordDate >= monthStart && recordDate <= monthEnd;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Sort descending (newest first)
      })
      .map(record => ({
        ...record,
        formattedDate: formatDate(record.date),
        formattedCheckIn: formatTime(record.checkInTime),
        formattedCheckOut: formatTime(record.checkOutTime),
        hours: calculateDailyHours(record.checkInTime, record.checkOutTime)
      }));
  }, [attendance, currentMonth]);

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
                 <button 
                   onClick={handlePrevMonth} 
                   className="p-2 transition-colors rounded-md hover:bg-slate-700 text-slate-400 hover:text-white"
                 >
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleNextMonth} 
                   disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                   className="p-2 transition-colors rounded-md hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                 >
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
                 <div className="text-xl font-bold text-emerald-400">
                   {loading ? '...' : stats.presentDays}
                 </div>
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center min-w-[120px]">
                 <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Leaves count</div>
                 <div className="text-xl font-bold text-amber-400">
                   {loadingLeaves ? '...' : stats.leavesTaken}
                 </div>
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

           {loading ? (
             <div className="p-12 text-center text-slate-500 bg-slate-900">
               Loading attendance records...
             </div>
           ) : formattedAttendance.length === 0 ? (
             <div className="p-12 text-center text-slate-500 bg-slate-900">
               No attendance records found for this month.
             </div>
           ) : (
             <>
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
                     {formattedAttendance.map((record, index) => (
                        <tr key={record._id || index} className="transition-colors border-b hover:bg-slate-800 border-slate-800">
                           <td className="px-6 py-4 font-mono text-slate-300">{record.formattedDate}</td>
                           <td className="px-6 py-4 font-mono text-slate-400">{record.formattedCheckIn}</td>
                           <td className="px-6 py-4 font-mono text-slate-400">{record.formattedCheckOut}</td>
                           <td className="px-6 py-4">
                              <span className="font-bold text-slate-200">{record.hours.work}</span>
                           </td>
                           <td className="px-6 py-4">
                              {/* Highlight Extra Hours if > 00:00 */}
                              <span className={`font-mono font-medium ${record.hours.extra !== '00:00' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                 {record.hours.extra}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               
               {/* Footer */}
               <div className="flex items-center gap-2 p-4 text-xs border-t bg-slate-900 border-slate-800 text-slate-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>Work hours are calculated excluding 1 hour break. Extra hours start after 8 hours of work.</span>
               </div>
             </>
           )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EmployeeAttendancePage;
