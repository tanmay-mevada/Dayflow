'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, CalendarCheck, ArrowUpRight, UserPlus, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/hooks/useSession';
import { useAttendance } from '@/hooks/useAttendance';
import { useLeave, useLeaveBalance } from '@/hooks/useLeave';

const Dashboard = () => {
  const router = useRouter();
  const { user, role, isLoading } = useSession();
  const isAdmin = role === 'admin' || role === 'hr_officer';
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  // Redirect admin to Employees dashboard (as per wireframe: "After login the user must land on this page")
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.replace('/dashboard/admin');
    }
  }, [isLoading, isAdmin, router]);

  // For employees: Show check-in/out functionality
  const today = new Date().toISOString().split('T')[0];
  const { attendance, checkIn, checkOut, refetch, loading: attendanceLoading } = useAttendance(undefined, today, today);
  const { balance, loading: balanceLoading } = useLeaveBalance();
  const { leaves, loading: leavesLoading } = useLeave();

  const todayAttendance = attendance.find(record => {
    const recordDate = new Date(record.date).toISOString().split('T')[0];
    return recordDate === today;
  });

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      await checkIn();
      await refetch();
    } catch (error) {
      // Error handled in hook
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
      // Error handled in hook
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Calculate time since check-in (formatted as "Since HH:MM AM/PM")
  const calculateTimeSince = (checkInTime: Date | string | null) => {
    if (!checkInTime) return null;
    return formatTime(checkInTime);
  };

  const canCheckIn = !todayAttendance?.checkInTime;
  const canCheckOut = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  const checkInTime = todayAttendance?.checkInTime ? formatTime(todayAttendance.checkInTime) : null;
  const checkOutTime = todayAttendance?.checkOutTime ? formatTime(todayAttendance.checkOutTime) : null;
  const timeSince = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime 
    ? calculateTimeSince(todayAttendance.checkInTime) 
    : null;

  // Calculate recent activities
  const recentActivities = useMemo(() => {
    const activities: any[] = [];
    
    // Add today's attendance
    if (todayAttendance) {
      activities.push({
        type: 'attendance',
        date: new Date(todayAttendance.date),
        data: todayAttendance,
        checkInTime: todayAttendance.checkInTime
      });
    }
    
    // Add recent attendance (excluding today)
    if (attendance && Array.isArray(attendance)) {
      attendance
        .filter((record: any) => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          return recordDate !== today;
        })
        .forEach((record: any) => {
          activities.push({
            type: 'attendance',
            date: new Date(record.date),
            data: record,
            checkInTime: record.checkInTime
          });
        });
    }
    
    // Add recent leaves
    if (leaves && Array.isArray(leaves)) {
      leaves.forEach((leave: any) => {
        activities.push({
          type: 'leave',
          date: new Date(leave.startDate),
          data: leave
        });
      });
    }
    
    // Sort by date (most recent first) and take top 5
    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    return activities.slice(0, 5);
  }, [todayAttendance, attendance, leaves, today]);

  // Calculate next upcoming holiday
  const getNextHoliday = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const holidays = [
      { date: new Date(currentYear, 0, 26), name: 'Republic Day' }, // Jan 26
      { date: new Date(currentYear, 2, 29), name: 'Holi' }, // Mar 29 (approximate)
      { date: new Date(currentYear, 7, 15), name: 'Independence Day' }, // Aug 15
      { date: new Date(currentYear, 9, 2), name: 'Gandhi Jayanti' }, // Oct 2
      { date: new Date(currentYear, 10, 14), name: 'Diwali' }, // Nov 14 (approximate)
      { date: new Date(currentYear, 11, 25), name: 'Christmas' }, // Dec 25
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find next holiday
    const nextHoliday = holidays
      .map(h => ({ ...h, date: new Date(h.date) }))
      .find(h => {
        h.date.setHours(0, 0, 0, 0);
        return h.date >= today;
      });

    if (nextHoliday) {
      const day = nextHoliday.date.getDate();
      const month = nextHoliday.date.toLocaleDateString('en-GB', { month: 'short' });
      return {
        date: `${day} ${month}`,
        name: nextHoliday.name
      };
    }

    // If no holiday found this year, check next year
    const firstHolidayNextYear = holidays[0];
    return {
      date: `${firstHolidayNextYear.date.getDate()} ${firstHolidayNextYear.date.toLocaleDateString('en-GB', { month: 'short' })}`,
      name: firstHolidayNextYear.name
    };
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  // If admin, this will redirect, but show loading while redirecting
  if (isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Redirecting...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good Morning, {userName}! 👋</h2>
          <p className="text-slate-500 mt-1">Here is what is happening with you today.</p>
        </div>

        {/* Admin Quick Actions */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Admin Actions</h3>
                <p className="text-sm text-slate-600">Manage employees and system settings</p>
              </div>
              <Link href="/dashboard/employees/create">
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  <UserPlus className="h-5 w-5" />
                  Create Employee
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Check IN/Check Out Section (Employee Only) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance</h3>
              <p className="text-sm text-slate-500">Mark your daily attendance</p>
              {timeSince && (
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  Since {timeSince}
                </p>
              )}
              {checkOutTime && (
                <p className="text-sm text-slate-500 mt-1">
                  Checked out at {checkOutTime}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              {canCheckIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || attendanceLoading}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCheckingIn ? 'Checking In...' : 'Check IN →'}
                </button>
              ) : canCheckOut ? (
                <button
                  onClick={handleCheckOut}
                  disabled={isCheckingOut || attendanceLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCheckingOut ? 'Checking Out...' : 'Check Out →'}
                </button>
              ) : (
                <div className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium">
                  {checkInTime ? `Checked Out at ${checkOutTime}` : 'Not Checked In'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats / Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Attendance Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                todayAttendance?.status === 'present' 
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {todayAttendance?.status === 'present' ? 'Present' : 'Not Present'}
              </span>
            </div>
            <div className="text-slate-500 text-sm mb-1">Check-in Time</div>
            <div className="text-2xl font-bold text-slate-900">
              {checkInTime || 'Not checked in'}
            </div>
            <Link href="/dashboard/attendance" className="block mt-4">
              <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-600">
                View History
              </button>
            </Link>
          </div>

          {/* Card 2: Leave Balance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <CalendarCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-slate-500 text-sm mb-1">Available Paid Leave</div>
            <div className="text-2xl font-bold text-slate-900">
              {balanceLoading ? '...' : (balance?.paidLeaveRemaining || balance?.paid_leave || 0)} Days
            </div>
            <Link href="/dashboard/leave" className="block mt-4">
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Apply Leave
              </button>
            </Link>
          </div>

          {/* Card 3: Next Holiday */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-purple-50 rounded-xl">
                <CalendarCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-slate-500 text-sm mb-1">Upcoming Holiday</div>
            <div className="text-2xl font-bold text-slate-900">{getNextHoliday.date}</div>
            <div className="text-sm text-slate-500 mt-1">{getNextHoliday.name}</div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <Link href="/dashboard/attendance">
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
                View All <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Activity</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceLoading || leavesLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Loading activity...
                  </td>
                </tr>
              ) : recentActivities.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                    No recent activity
                  </td>
                </tr>
              ) : (
                recentActivities.map((activity, index) => {
                  const activityDate = activity.date;
                  const isToday = activityDate.toDateString() === new Date().toDateString();
                  const isYesterday = activityDate.toDateString() === new Date(Date.now() - 86400000).toDateString();
                  const dateLabel = isToday ? 'Today' : isYesterday ? 'Yesterday' : activityDate.toLocaleDateString('en-GB');
                  
                  if (activity.type === 'attendance') {
                    const record = activity.data;
                    return (
                      <tr key={`attendance-${record._id || record.id || index}`} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-900">
                          {dateLabel}{activity.checkInTime ? `, ${formatTime(activity.checkInTime)}` : ''}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {record.checkOutTime ? 'Daily Check-out' : 'Daily Check-in'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            record.status === 'present' 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
                          }`}>
                            {record.status === 'present' ? 'Present' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  } else {
                    const leave = activity.data;
                    const leaveTypeDisplay = leave.leaveType === 'paid_leave' ? 'Paid Leave' :
                                            leave.leaveType === 'sick_leave' ? 'Sick Leave' :
                                            leave.leaveType === 'unpaid_leave' ? 'Unpaid Leave' :
                                            leave.leaveType || 'Leave';
                    
                    return (
                      <tr key={`leave-${leave._id || leave.id || index}`} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-900">{dateLabel}</td>
                        <td className="px-6 py-4 text-slate-600">Leave Request ({leaveTypeDisplay})</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            leave.status === 'approved' 
                              ? 'text-emerald-600' 
                              : leave.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}>
                            {leave.status === 'approved' ? 'Approved' : 
                             leave.status === 'rejected' ? 'Rejected' : 
                             'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;