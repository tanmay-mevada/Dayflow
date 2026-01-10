'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
   Search,
   Calendar,
   Clock,
   CheckCircle,
   XCircle,
   Clock3,
   Download,
   Filter,
   ChevronLeft,
   ChevronRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

const AdminAttendance = () => {
   const router = useRouter();
   const [attendanceData, setAttendanceData] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [filterStatus, setFilterStatus] = useState<string>('all');

   // Fetch attendance data
   useEffect(() => {
      fetchAttendance();
   }, [selectedDate]);

   const fetchAttendance = async () => {
      try {
         setLoading(true);
         const res = await fetch(`/api/attendance/admin?date=${selectedDate}`);
         const data = await res.json();

         if (res.ok) {
            setAttendanceData(data.data || []);
         } else {
            toast.error(data.error || 'Failed to fetch attendance');
         }
      } catch (error) {
         toast.error('Failed to fetch attendance');
      } finally {
         setLoading(false);
      }
   };

   // Get profile image
   const getProfileImage = (employee: any) => {
      if (employee?.profilePicture) return employee.profilePicture;
      const name = `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim();
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
   };

   // Format time
   const formatTime = (dateString: string) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleTimeString('en-US', {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true
      });
   };

   // Calculate total hours
   const calculateHours = (checkIn: string, checkOut: string) => {
      if (!checkIn || !checkOut) return '-';
      const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
   };

   // Get status badge
   const getStatusBadge = (attendance: any) => {
      if (!attendance) {
         return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
               <XCircle className="w-3 h-3" />
               Absent
            </span>
         );
      }

      if (attendance.status === 'present') {
         return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
               <CheckCircle className="w-3 h-3" />
               Present
            </span>
         );
      }

      if (attendance.status === 'late') {
         return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
               <Clock3 className="w-3 h-3" />
               Late
            </span>
         );
      }

      if (attendance.status === 'half_day') {
         return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center gap-1 w-fit">
               <Clock className="w-3 h-3" />
               Half Day
            </span>
         );
      }

      return (
         <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {attendance.status}
         </span>
      );
   };

   // Change date
   const changeDate = (days: number) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + days);
      setSelectedDate(newDate.toISOString().split('T')[0]);
   };

   // Filter and search
   const filteredData = attendanceData.filter(item => {
      const employee = item.employee;
      const attendance = item.attendance;

      // Search filter
      if (searchQuery) {
         const query = searchQuery.toLowerCase();
         const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
         const employeeId = (employee.employeeId || '').toLowerCase();
         const designation = (employee.designation || '').toLowerCase();

         if (!fullName.includes(query) && !employeeId.includes(query) && !designation.includes(query)) {
            return false;
         }
      }

      // Status filter
      if (filterStatus !== 'all') {
         if (filterStatus === 'absent' && attendance) return false;
         if (filterStatus === 'present' && (!attendance || attendance.status !== 'present')) return false;
         if (filterStatus === 'late' && (!attendance || attendance.status !== 'late')) return false;
         if (filterStatus === 'half_day' && (!attendance || attendance.status !== 'half_day')) return false;
      }

      return true;
   });

   // Statistics
   const stats = {
      total: attendanceData.length,
      present: attendanceData.filter(item => item.attendance?.status === 'present').length,
      late: attendanceData.filter(item => item.attendance?.status === 'late').length,
      halfDay: attendanceData.filter(item => item.attendance?.status === 'half_day').length,
      absent: attendanceData.filter(item => !item.attendance).length,
   };

   return (
      <DashboardLayout>
         <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
                  <p className="text-slate-600 mt-1">Monitor employee attendance records</p>
               </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex gap-6 border-b border-slate-200">
               <Link
                  href="/dashboard/admin"
                  className="pb-3 text-slate-600 hover:text-purple-600 transition-colors"
               >
                  Employees
               </Link>
               <Link
                  href="/dashboard/admin/attendance"
                  className="pb-3 text-purple-600 border-b-2 border-purple-600 font-medium"
               >
                  Attendance
               </Link>
               <Link
                  href="/dashboard/admin/leave"
                  className="pb-3 text-slate-600 hover:text-purple-600 transition-colors"
               >
                  Leaves
               </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
               </div>
               <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-green-600 mb-1">Present</p>
                  <p className="text-2xl font-bold text-green-700">{stats.present}</p>
               </div>
               <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-yellow-600 mb-1">Late</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
               </div>
               <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-orange-600 mb-1">Half Day</p>
                  <p className="text-2xl font-bold text-orange-700">{stats.halfDay}</p>
               </div>
               <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-red-600 mb-1">Absent</p>
                  <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
               </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
               <div className="flex flex-col md:flex-row gap-4">
                  {/* Date Picker */}
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => changeDate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                     >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                     </button>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                           type="date"
                           value={selectedDate}
                           onChange={(e) => setSelectedDate(e.target.value)}
                           className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                     </div>
                     <button
                        onClick={() => changeDate(1)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                     >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                     </button>
                     <button
                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        className="px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                     >
                        Today
                     </button>
                  </div>

                  {/* Status Filter */}
                  <div className="relative flex-1">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="half_day">Half Day</option>
                        <option value="absent">Absent</option>
                     </select>
                  </div>

                  {/* Search */}
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                     />
                  </div>

                  {/* Export Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                     <Download className="w-4 h-4" />
                     Export
                  </button>
               </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
               {loading ? (
                  <div className="flex items-center justify-center py-12">
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading attendance...</p>
                     </div>
                  </div>
               ) : filteredData.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-slate-600">
                        {searchQuery || filterStatus !== 'all'
                           ? 'No attendance records found matching your filters.'
                           : 'No attendance records found for this date.'}
                     </p>
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                           <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Employee</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Employee ID</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Designation</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check In</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check Out</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total Hours</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                           {filteredData.map((item) => {
                              const employee = item.employee;
                              const attendance = item.attendance;
                              const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();

                              return (
                                 <tr
                                    key={employee._id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/dashboard/admin/profile?employeeId=${employee._id}`)}
                                 >
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <img
                                             src={getProfileImage(employee)}
                                             alt={fullName}
                                             className="w-10 h-10 rounded-full"
                                          />
                                          <div>
                                             <p className="font-medium text-slate-800">{fullName}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                       {employee.employeeId || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                       {employee.designation || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2 text-slate-800">
                                          <Clock className="w-4 h-4 text-slate-400" />
                                          {formatTime(attendance?.checkInTime)}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2 text-slate-800">
                                          <Clock className="w-4 h-4 text-slate-400" />
                                          {formatTime(attendance?.checkOutTime)}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className="font-medium text-slate-800">
                                          {attendance?.totalHours || calculateHours(attendance?.checkInTime, attendance?.checkOutTime)}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">
                                       {getStatusBadge(attendance)}
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>

            {/* Results Summary */}
            {!loading && filteredData.length > 0 && (
               <div className="text-center text-sm text-slate-600">
                  Showing {filteredData.length} of {attendanceData.length} employees
               </div>
            )}
         </div>
      </DashboardLayout>
   );
};

export default AdminAttendance;