'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  FileText, 
  X, 
  Upload,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const EmployeeLeavePage = () => {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Time Off');

  // --- MOCK DATA: Personal Leave History ---
  const [myRequests, setMyRequests] = useState([
    { 
      id: 1, 
      startDate: '28/10/2025', 
      endDate: '28/10/2025', 
      type: 'Paid time Off', 
      status: 'Approved',
      days: 1
    },
    { 
      id: 2, 
      startDate: '12/11/2025', 
      endDate: '14/11/2025', 
      type: 'Sick time off', 
      status: 'Pending',
      days: 3
    }
  ]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    type: 'Paid time off',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to submit form
    setIsModalOpen(false);
    alert("Request Submitted!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header & Controls --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
           <div className="space-y-4">
              <h1 className="text-2xl font-bold text-slate-900">My Time Off</h1>
              <div className="bg-slate-100 p-1 rounded-lg w-fit">
                 <button className="px-4 py-1.5 text-sm font-medium bg-white text-slate-900 shadow-sm rounded-md">Time Off</button>
              </div>
           </div>

           <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all"
              >
                 <Plus className="h-4 w-4" /> NEW
              </button>
           </div>
        </div>

        {/* --- Balance Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Paid Time Off Card */}
           <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                 <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-1">Paid Time Off</h3>
                 <div className="text-3xl font-bold mb-1">24 <span className="text-lg font-normal text-slate-400">/ Days Available</span></div>
                 <p className="text-xs text-slate-500">Plan your vacation ahead.</p>
              </div>
              <div className="absolute right-0 bottom-0 p-4 opacity-10">
                 <Calendar className="h-24 w-24 text-blue-400" />
              </div>
           </div>

           {/* Sick Time Off Card */}
           <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                 <h3 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-1">Sick Time Off</h3>
                 <div className="text-3xl font-bold text-slate-900 mb-1">07 <span className="text-lg font-normal text-slate-400">/ Days Available</span></div>
                 <p className="text-xs text-slate-500">Get well soon.</p>
              </div>
              <div className="absolute right-0 bottom-0 p-4 opacity-5">
                 <AlertCircle className="h-24 w-24 text-blue-600" />
              </div>
           </div>
        </div>

        {/* --- Requests Table --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                 <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4">Time Off Type</th>
                    <th className="px-6 py-4">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {myRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-medium text-slate-900">Sarah Jenkins</td>
                       <td className="px-6 py-4 font-mono text-slate-600">{req.startDate}</td>
                       <td className="px-6 py-4 font-mono text-slate-600">{req.endDate}</td>
                       <td className="px-6 py-4 text-blue-600 font-medium">{req.type}</td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                             {req.status}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {myRequests.length === 0 && (
              <div className="p-12 text-center text-slate-400">You haven't applied for any leave yet.</div>
           )}
        </div>

      </div>

      {/* --- MODAL: Time Off Request --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 text-slate-200 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Time off Type Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               
               {/* Employee Name (Read Only) */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Employee</label>
                  <div className="col-span-2 text-blue-400 font-medium">Sarah Jenkins</div>
               </div>

               {/* Time Off Type */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Time off Type</label>
                  <select className="col-span-2 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                     <option>Paid time off</option>
                     <option>Sick Leave</option>
                     <option>Unpaid Leaves</option>
                  </select>
               </div>

               {/* Validity Period */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Validity Period</label>
                  <div className="col-span-2 flex gap-2 items-center">
                     <input type="date" className="bg-slate-800 border border-slate-600 text-white text-xs rounded-lg block w-full p-2" />
                     <span className="text-slate-500 text-xs">To</span>
                     <input type="date" className="bg-slate-800 border border-slate-600 text-white text-xs rounded-lg block w-full p-2" />
                  </div>
               </div>

               {/* Allocation (Days) */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Allocation</label>
                  <div className="col-span-2 flex items-center gap-2">
                     <input type="number" defaultValue="1.00" className="bg-slate-800 border border-slate-600 text-blue-400 text-sm font-bold rounded-lg block w-24 p-2 text-center" />
                     <span className="text-slate-500 text-sm">Days</span>
                  </div>
               </div>

               {/* Attachment */}
               <div className="grid grid-cols-3 items-start gap-4">
                  <label className="text-sm font-medium text-slate-400 pt-2">Attachment:</label>
                  <div className="col-span-2">
                     <label className="flex items-center justify-center w-full p-2 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Upload className="h-4 w-4" />
                           <span className="text-xs">(For sick leave certificate)</span>
                        </div>
                        <input type="file" className="hidden" />
                     </label>
                  </div>
               </div>

               {/* Modal Footer (Buttons) */}
               <div className="flex gap-3 pt-2">
                  <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-purple-900/20">
                     Submit
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                     Discard
                  </button>
               </div>

            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default EmployeeLeavePage;