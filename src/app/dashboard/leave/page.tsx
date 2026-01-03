'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  User,
  Filter,
  Check,
  X
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const LeavePage = () => {
  // --- STATE MANAGEMENT ---
  const [role, setRole] = useState<'employee' | 'admin'>('employee'); // Demo Toggle

  // --- MOCK DATA: EMPLOYEE (My History) ---
  const [myRequests, setMyRequests] = useState([
    { id: 1, type: 'Sick Leave', from: '2025-10-10', to: '2025-10-11', days: 2, status: 'Pending', remarks: 'High fever' },
    { id: 2, type: 'Paid Leave', from: '2025-09-15', to: '2025-09-20', days: 5, status: 'Approved', remarks: 'Family vacation' },
    { id: 3, type: 'Unpaid Leave', from: '2025-08-01', to: '2025-08-01', days: 1, status: 'Rejected', remarks: 'Personal work' },
  ]);

  // --- MOCK DATA: ADMIN (Incoming Requests) ---
  const [incomingRequests, setIncomingRequests] = useState([
    { id: 101, employee: 'Sarah Smith', dept: 'Design', type: 'Sick Leave', from: '2025-10-24', to: '2025-10-25', days: 2, status: 'Pending', reason: 'Viral infection' },
    { id: 102, employee: 'Mike Johnson', dept: 'Sales', type: 'Paid Leave', from: '2025-11-01', to: '2025-11-05', days: 5, status: 'Pending', reason: 'Diwali break' },
    { id: 103, employee: 'Emily Davis', dept: 'Marketing', type: 'Unpaid Leave', from: '2025-10-28', to: '2025-10-28', days: 1, status: 'Pending', reason: 'Urgent personal work' },
  ]);

  // --- HANDLERS ---
  const handleAdminAction = (id: number, action: 'Approved' | 'Rejected') => {
    // In a real app, this would make an API call. Here we update local state[cite: 93].
    setIncomingRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- DEMO TOGGLE --- */}
        <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
             <ShieldAlert className="h-5 w-5 text-yellow-400" />
             <span className="text-sm font-medium">Demo Mode: View Page As</span>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-md">
            <button onClick={() => setRole('employee')} className={`px-3 py-1 text-xs font-bold rounded ${role === 'employee' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Employee</button>
            <button onClick={() => setRole('admin')} className={`px-3 py-1 text-xs font-bold rounded ${role === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Admin / HR</button>
          </div>
        </div>

        {/* =================================================================================
            VIEW 1: EMPLOYEE (Apply & View History)
           ================================================================================= */}
        {role === 'employee' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            
            {/* LEFT: Application Form [cite: 78, 80] */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-50 rounded-lg"><Plus className="h-5 w-5 text-blue-600" /></div>
                   <h2 className="text-lg font-bold text-slate-900">New Request</h2>
                </div>
                
                <form className="space-y-4">
                  {/* Leave Type  */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                    <select className="w-full rounded-lg border-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500">
                      <option>Paid Leave</option>
                      <option>Sick Leave</option>
                      <option>Unpaid Leave</option>
                    </select>
                  </div>

                  {/* Date Range [cite: 82] */}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                        <input type="date" className="w-full rounded-lg border-slate-200 text-sm" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                        <input type="date" className="w-full rounded-lg border-slate-200 text-sm" />
                     </div>
                  </div>

                  {/* Remarks [cite: 83] */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Remarks</label>
                    <textarea rows={3} className="w-full rounded-lg border-slate-200 text-sm" placeholder="Brief reason for leave..."></textarea>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm">
                    Submit Request
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: My Leave History */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Balance Cards */}
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Paid Leave</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">12 <span className="text-sm font-normal text-slate-400">/ 20</span></div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sick Leave</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">5 <span className="text-sm font-normal text-slate-400">/ 10</span></div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Unpaid</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">0</div>
                 </div>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-semibold text-slate-900">My Leave History</div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Type</th>
                      <th className="px-6 py-3 font-medium">Date Range</th>
                      <th className="px-6 py-3 font-medium">Days</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{req.type}</td>
                        <td className="px-6 py-4 text-slate-500">{req.from} to {req.to}</td>
                        <td className="px-6 py-4 text-slate-500">{req.days}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================================
            VIEW 2: ADMIN (Approval Workflow) [cite: 88]
           ================================================================================= */}
        {role === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900">Leave Requests</h2>
                  <p className="text-slate-500 mt-1">Manage and approve employee time-off requests.</p>
               </div>
               <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                   <Filter className="h-4 w-4" /> Filter Status
                 </button>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Employee</th>
                    <th className="px-6 py-4 font-medium">Leave Details</th>
                    <th className="px-6 py-4 font-medium">Dates</th>
                    <th className="px-6 py-4 font-medium">Reason</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incomingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                              {req.employee.charAt(0)}
                           </div>
                           <div>
                             <div className="font-medium text-slate-900">{req.employee}</div>
                             <div className="text-xs text-slate-400">{req.dept}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="font-medium text-slate-900">{req.type}</span>
                         <div className="text-xs text-slate-500">{req.days} Day(s)</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        {req.from} <br/> to {req.to}
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         {/* Action Buttons [cite: 91] */}
                         {req.status === 'Pending' ? (
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handleAdminAction(req.id, 'Approved')}
                               className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors" 
                               title="Approve"
                             >
                               <Check className="h-4 w-4" />
                             </button>
                             <button 
                               onClick={() => handleAdminAction(req.id, 'Rejected')}
                               className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors" 
                               title="Reject"
                             >
                               <X className="h-4 w-4" />
                             </button>
                           </div>
                         ) : (
                           <span className="text-xs text-slate-400 font-medium italic">Action Taken</span>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {incomingRequests.length === 0 && (
                <div className="p-8 text-center text-slate-400">No pending leave requests.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default LeavePage;