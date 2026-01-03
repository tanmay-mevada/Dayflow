'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

const AdminAttendancePage = () => {
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch attendance data for the selected date
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const dateStr = currentDate.toISOString().split('T')[0];
        const res = await fetch(`/api/attendance/admin?date=${dateStr}`);
        const data = await res.json();
        if (res.ok) {
          setAttendanceData(data.data || []);
        } else {
          toast.error(data.error || 'Failed to fetch attendance');
          setAttendanceData([]);
        }
      } catch (error) {
        toast.error('Failed to fetch attendance');
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [currentDate]);

  // --- HELPER: Hours Calculation (matching wireframe: 1hr break, 8hr standard shift) ---
  const calculateHours = (checkInTime: Date | string | null, checkOutTime: Date | string | null) => {
    if (!checkInTime || !checkOutTime) return { work: '00:00', extra: '00:00' };
    
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
    
    return { work: format(workMins), extra: format(extraMins) };
  };

  // Format time to HH:MM
  const formatTime = (date: Date | string | null) => {
    if (!date) return '--:--';
    const d = typeof date === 'string' ? new Date(date) : date;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Get profile image
  const getProfileImage = (employee: any) => {
    if (employee.profilePicture) return employee.profilePicture;
    const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Date navigation handlers
  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return attendanceData;
    const query = searchQuery.toLowerCase();
    return attendanceData.filter(item => {
      const name = `${item.employee.firstName || ''} ${item.employee.lastName || ''}`.toLowerCase();
      const employeeId = (item.employee.employeeId || '').toLowerCase();
      const designation = (item.employee.designation || '').toLowerCase();
      return name.includes(query) || employeeId.includes(query) || designation.includes(query);
    });
  }, [attendanceData, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    filteredData.forEach(item => {
      if (item.attendance && item.attendance.checkInTime && item.attendance.checkOutTime) {
        present++;
      } else {
        absent++;
      }
    });
    return { present, absent };
  }, [filteredData]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header --- */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        </div>

        {/* --- Controls: Search & Date Navigation --- */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 text-white rounded-lg p-1 border border-slate-700">
              <button 
                onClick={handlePrevDate}
                className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="px-4 py-2 font-mono font-medium min-w-[200px] text-center flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                {formatDate(currentDate)}
              </div>
              <button 
                onClick={handleNextDate}
                className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- Attendance Table --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Loading attendance data...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No attendance records found for this date.
            </div>
          ) : (
            <>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Emp</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work Hours</th>
                    <th className="px-6 py-4">Extra hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item, index) => {
                    const employee = item.employee;
                    const attendance = item.attendance;
                    const hours = calculateHours(
                      attendance?.checkInTime || null,
                      attendance?.checkOutTime || null
                    );
                    const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
                    
                    return (
                      <tr key={employee._id || index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={getProfileImage(employee)} 
                              alt={fullName} 
                              className="h-9 w-9 rounded-full bg-slate-100 object-cover" 
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{fullName}</div>
                              <div className="text-xs text-slate-400">{employee.employeeId || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {formatTime(attendance?.checkInTime || null)}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {formatTime(attendance?.checkOutTime || null)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-700">{hours.work}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-mono font-medium ${
                            hours.extra !== '00:00' ? 'text-emerald-600' : 'text-slate-500'
                          }`}>
                            {hours.extra}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminAttendancePage;
