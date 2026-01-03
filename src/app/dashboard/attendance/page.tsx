'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAttendance } from '@/hooks/useAttendance';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';

const AttendancePage = () => {
  const { role } = useSession();
  const isAdmin = role === 'admin' || role === 'hr_officer';
  
  // Date filtering
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');
  
  // Calculate date range based on view type
  const dateRange = useMemo(() => {
    if (viewType === 'weekly') {
      const start = new Date(selectedDate);
      start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
      const end = new Date(start);
      end.setDate(end.getDate() + 6); // End of week (Saturday)
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      };
    } else {
      const dateStr = selectedDate.toISOString().split('T')[0];
      return { startDate: dateStr, endDate: dateStr };
    }
  }, [viewType, selectedDate]);
  const { attendance, loading, checkIn, checkOut, refetch } = useAttendance(
    undefined,
    dateRange.startDate,
    dateRange.endDate
  );

  // Get today's attendance status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = attendance.find(record => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      await checkIn();
      await refetch();
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      await checkOut();
      await refetch();
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatTime = (date: Date | string) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatHours = (hours: number) => {
    if (!hours) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'half_day': return 'Half-day';
      case 'leave': return 'Leave';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'half_day': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'leave': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewType === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const canCheckIn = !todayAttendance?.checkInTime;
  const canCheckOut = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  const isCheckedIn = !!todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;

  // For employee view
  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with Check-in/Check-out Button */}
          <div className="relative flex flex-col items-center justify-between gap-6 p-8 overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200 md:flex-row">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-900">My Attendance</h2>
              <p className="mt-1 text-slate-500">Track your daily check-ins and work hours.</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Current Time: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              {canCheckIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="flex flex-col items-center justify-center w-32 h-32 text-white transition-transform rounded-full shadow-xl bg-emerald-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="text-2xl font-bold">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                  <span className="mt-1 text-xs font-bold uppercase">
                    {isCheckingIn ? 'Checking In...' : 'Check In'}
                  </span>
                </button>
              ) : canCheckOut ? (
                <button
                  onClick={handleCheckOut}
                  disabled={isCheckingOut}
                  className="flex flex-col items-center justify-center w-32 h-32 text-white transition-transform bg-blue-600 rounded-full shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="text-2xl font-bold">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                  <span className="mt-1 text-xs font-bold uppercase">
                    {isCheckingOut ? 'Checking Out...' : 'Check Out'}
                  </span>
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full shadow-xl bg-slate-100 text-slate-600">
                  <span className="text-2xl font-bold">
                    {todayAttendance?.checkOutTime 
                      ? formatTime(todayAttendance.checkOutTime)
                      : formatTime(currentTime)}
                  </span>
                  <span className="mt-1 text-xs font-bold uppercase">
                    {todayAttendance?.checkOutTime ? 'Checked Out' : 'Checked In'}
                  </span>
                </div>
              )}
              {todayAttendance?.checkInTime && (
                <div className="text-sm text-center text-slate-600">
                  <div>Checked in at: {formatTime(todayAttendance.checkInTime)}</div>
                  {todayAttendance.checkOutTime && (
                    <div>Checked out at: {formatTime(todayAttendance.checkOutTime)}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 transition-colors rounded-lg hover:bg-slate-100"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-4">
              <div className="flex p-1 bg-white border rounded-lg border-slate-200">
                <button
                  onClick={() => setViewType('daily')}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    viewType === 'daily' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setViewType('weekly')}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    viewType === 'weekly' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Weekly
                </button>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CalendarDays className="w-4 h-4" />
                <span className="font-medium">
                  {viewType === 'weekly'
                    ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                    : formatDate(selectedDate)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigateDate('next')}
              disabled={viewType === 'daily' && selectedDate.toDateString() >= new Date().toDateString()}
              className="p-2 transition-colors rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Attendance Table */}
          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-700">Attendance Log</h3>
            </div>
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading attendance records...</div>
            ) : attendance.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No attendance records found for this period.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b bg-slate-50 text-slate-500 border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Check In</th>
                      <th className="px-6 py-4">Check Out</th>
                      <th className="px-6 py-4">Work Hours</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance.map((record, index) => {
                      const recordDate = new Date(record.date);
                      recordDate.setHours(0, 0, 0, 0);
                      const isToday = recordDate.getTime() === today.getTime();
                      return (
                        <tr
                          key={record._id || index}
                          className={`hover:bg-slate-50 ${isToday ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {formatDate(record.date)}
                            {isToday && <span className="ml-2 text-xs text-blue-600">(Today)</span>}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">
                            {formatTime(record.checkInTime)}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">
                            {formatTime(record.checkOutTime)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {formatHours(record.totalHours || 0)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {getStatusLabel(record.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Admin view - simplified for now (can be enhanced later)
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Employee Attendance</h2>
          <p className="text-slate-500">
            Admin attendance view - This view can be enhanced to show all employees' attendance.
            For now, you can view individual employee attendance by using the employee view.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;