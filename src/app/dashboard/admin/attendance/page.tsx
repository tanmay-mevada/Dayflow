'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock,
  Download,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const AdminAttendancePage = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'Daily Log' | 'Requests'>('Daily Log');
  const [currentDate, setCurrentDate] = useState(new Date('2025-10-22'));
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATA: Daily Logs (Existing) ---
  const attendanceData = [
    { 
      id: 'EMP-001', 
      name: 'Sarah Jenkins', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      checkIn: '09:00', 
      checkOut: '18:00', 
      status: 'Present'
    },
    { 
      id: 'EMP-002', 
      name: 'Michael Ross', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      checkIn: '09:15', 
      checkOut: '18:45', 
      status: 'Late'
    },
    { 
      id: 'EMP-004', 
      name: 'Donna Paulsen', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donna',
      checkIn: '--:--', 
      checkOut: '--:--', 
      status: 'Absent'
    },
  ];

  // --- MOCK DATA: Attendance Requests (New Feature) ---
  const [requests, setRequests] = useState([
    {
      id: 101,
      name: 'Donna Paulsen',
      role: 'Operations',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donna',
      date: '22 Oct, 2025',
      type: 'Check-In Correction',
      originalTime: '--:--',
      requestedTime: '09:05',
      reason: 'Forgot ID card, marked manual attendance.',
      status: 'Pending'
    },
    {
      id: 102,
      name: 'Harvey Specter',
      role: 'Legal',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey',
      date: '21 Oct, 2025',
      type: 'Check-Out Correction',
      originalTime: '17:30',
      requestedTime: '19:30',
      reason: 'System error during logout.',
      status: 'Pending'
    }
  ]);

  // --- HELPER: Hours Calculation ---
  const calculateHours = (checkIn: string, checkOut: string) => {
    if (checkIn === '--:--' || checkOut === '--:--') return { work: '00:00', extra: '00:00' };
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    let diffMins = (outH * 60 + outM) - (inH * 60 + inM);
    const workMins = Math.max(0, diffMins - 60); // -60min break
    const extraMins = Math.max(0, workMins - 480); // -8hrs shift
    
    const format = (m: number) => `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
    return { work: format(workMins), extra: format(extraMins) };
  };

  // --- HANDLER: Approve/Reject Request ---
  const handleRequestAction = (id: number, action: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header & Tabs --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
           <div className="space-y-4">
              <h1 className="text-2xl font-bold text-slate-900">Attendance Management</h1>
              
              {/* Tabs: Daily Log vs Requests */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                 <button
                   onClick={() => setActiveTab('Daily Log')}
                   className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                     activeTab === 'Daily Log' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Daily Log
                 </button>
                 <button
                   onClick={() => setActiveTab('Requests')}
                   className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                     activeTab === 'Requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Requests
                   {/* Badge for pending requests */}
                   {requests.filter(r => r.status === 'Pending').length > 0 && (
                     <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                       {requests.filter(r => r.status === 'Pending').length}
                     </span>
                   )}
                 </button>
              </div>
           </div>

           <div className="flex gap-3">
              <div className="relative">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                 />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm">
                 <Download className="h-4 w-4" /> Export
              </button>
           </div>
        </div>

        {/* =================================================================================
            VIEW 1: DAILY LOG (Existing Tracking View)
           ================================================================================= */}
        {activeTab === 'Daily Log' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             
             {/* Date Controls */}
             <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                   <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
                   <div className="px-6 py-1 font-mono font-medium min-w-[160px] text-center flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" /> {formatDate(currentDate)}
                   </div>
                   <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronRight className="h-5 w-5" /></button>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present: 24</div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Late: 3</div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent: 2</div>
                </div>
             </div>

             {/* Table */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Employee</th>
                         <th className="px-6 py-4">Check In</th>
                         <th className="px-6 py-4">Check Out</th>
                         <th className="px-6 py-4">Work Hours</th>
                         <th className="px-6 py-4">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {attendanceData.map((record) => {
                         const hours = calculateHours(record.checkIn, record.checkOut);
                         return (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <img src={record.image} alt={record.name} className="h-9 w-9 rounded-full bg-slate-100" />
                                     <div>
                                        <div className="font-semibold text-slate-900">{record.name}</div>
                                        <div className="text-xs text-slate-400">{record.id}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-4 font-mono text-slate-600">{record.checkIn}</td>
                               <td className="px-6 py-4 font-mono text-slate-600">{record.checkOut}</td>
                               <td className="px-6 py-4"><span className="font-bold text-slate-700">{hours.work}</span></td>
                               <td className="px-6 py-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                    record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 
                                    record.status === 'Late' ? 'bg-amber-100 text-amber-700' : 
                                    'bg-red-100 text-red-700'
                                  }`}>{record.status}</span>
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* =================================================================================
            VIEW 2: REQUESTS (Approval Workflow)
           ================================================================================= */}
        {activeTab === 'Requests' && (
           <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                 <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                 <div>
                    <h3 className="text-sm font-bold text-blue-900">Attendance Regularization</h3>
                    <p className="text-xs text-blue-700 mt-1">
                       Employees can request regularization for missed punches or technical errors. 
                       Approving these will automatically update their daily log and payroll hours.
                    </p>
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                       <tr>
                          <th className="px-6 py-4">Employee</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Time Change</th>
                          <th className="px-6 py-4">Reason</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {requests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <img src={req.image} alt={req.name} className="h-9 w-9 rounded-full bg-slate-100" />
                                   <div>
                                      <div className="font-semibold text-slate-900">{req.name}</div>
                                      <div className="text-xs text-slate-400">{req.role}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4 font-mono text-slate-600">{req.date}</td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <Clock className="h-3 w-3 text-slate-400" />
                                   <span className="font-medium text-slate-700">{req.type}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs">
                                   <span className="line-through text-slate-400">{req.originalTime}</span>
                                   <span className="text-slate-300">→</span>
                                   <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{req.requestedTime}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={req.reason}>
                                {req.reason}
                             </td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                   req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                   req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                   'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                   {req.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                {req.status === 'Pending' ? (
                                   <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => handleRequestAction(req.id, 'Rejected')}
                                        className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded hover:text-red-600 hover:border-red-200 transition-colors"
                                        title="Reject"
                                      >
                                         <X className="h-4 w-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleRequestAction(req.id, 'Approved')}
                                        className="p-1.5 bg-emerald-600 text-white border border-emerald-600 rounded hover:bg-emerald-700 transition-colors shadow-sm"
                                        title="Approve"
                                      >
                                         <Check className="h-4 w-4" />
                                      </button>
                                   </div>
                                ) : (
                                   <span className="text-xs text-slate-400 italic">Completed</span>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {requests.length === 0 && (
                    <div className="p-12 text-center text-slate-400">No pending requests found.</div>
                 )}
              </div>
           </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminAttendancePage;