'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  X, 
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
// Import your custom hooks
import { useLeave, useLeaveBalance } from '@/hooks/useLeave';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile'; 

const EmployeeLeavePage = () => {
  // --- HOOKS INTEGRATION ---
  const { leaves, loading: leavesLoading, createLeave } = useLeave();
  const { balance, loading: balanceLoading } = useLeaveBalance();
  const { user } = useSession();
  const { profile } = useProfile();
  
  // Get employee name
  const employeeName = profile?.firstName && profile?.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.name || 'Employee';

  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    leaveType: 'paid_leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // --- HANDLER: Input Change ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- HELPER: Formatting & Calculation ---
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end.getTime() - start.getTime(); // Allow negative to check validity
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return diffDays;
  };

  // --- HANDLER: Submit Request (FIXED LOGIC) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Calculate requested duration
    const requestedDays = calculateDays();
    if (requestedDays <= 0) {
        alert("End date cannot be before start date.");
        return;
    }

    // 2. Client-Side Balance Check (PREVENTS THE ERROR)
    // We check if balance data exists, and if the leave type is NOT unpaid
    if (balance && formData.leaveType !== 'unpaid_leave') {
        const currentBalance = balance[formData.leaveType] || 0;
        
        if (requestedDays > currentBalance) {
            alert(`Insufficient Balance! You requested ${requestedDays} days, but only have ${currentBalance} days available.`);
            return; // Stop execution here, don't call API
        }
    }

    setIsSubmitting(true);

    try {
      await createLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
      
      // Success: Close modal & Reset form
      setIsModalOpen(false);
      setFormData({
        leaveType: 'paid_leave',
        startDate: '',
        endDate: '',
        reason: ''
      });
      
    } catch (error: any) {
      // Error is caught here so it doesn't crash the runtime
      // The hook handles the Toast, but we can log a friendly warning
      console.warn("Server rejected leave request:", error.message);
    } finally {
      setIsSubmitting(false);
    }
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
                 <div className="text-sm font-medium mb-2">
                    Paid time Off: <span className="font-bold">
                      {balanceLoading ? '...' : (balance?.paidLeaveRemaining || balance?.paid_leave || 0)}
                    </span> Days Available
                 </div>
              </div>
              <div className="absolute right-0 bottom-0 p-4 opacity-10">
                 <Calendar className="h-24 w-24 text-blue-400" />
              </div>
           </div>

           {/* Sick Time Off Card */}
           <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                 <div className="text-sm font-medium text-slate-900 mb-2">
                    Sick time off: <span className="font-bold">
                      {balanceLoading ? '...' : (balance?.sickLeaveRemaining || balance?.sick_leave || 0)}
                    </span> Days Available
                 </div>
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
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4">Time off Type</th>
                    <th className="px-6 py-4">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {leavesLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading records...
                      </td>
                    </tr>
                 ) : leaves && leaves.length > 0 ? (
                   leaves.map((req) => (
                    <tr key={req._id || req.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-medium text-slate-900">{employeeName}</td>
                       <td className="px-6 py-4 font-mono text-slate-600">{formatDate(req.startDate)}</td>
                       <td className="px-6 py-4 font-mono text-slate-600">{formatDate(req.endDate)}</td>
                       <td className="px-6 py-4 text-blue-600 font-medium">
                         {req.leaveType === 'paid_leave' ? 'Paid time Off' :
                          req.leaveType === 'sick_leave' ? 'Sick time off' :
                          req.leaveType === 'unpaid_leave' ? 'Unpaid Leaves' :
                          req.leaveType.replace('_', ' ')}
                       </td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(req.status)}`}>
                             {req.status}
                          </span>
                       </td>
                    </tr>
                   ))
                 ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        You haven't applied for any leave yet.
                      </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>

      </div>

      {/* --- MODAL: Time Off Request --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 text-slate-200 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Time off Type Request</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               
               {/* Employee Name (Read Only) */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Employee</label>
                  <div className="col-span-2 text-blue-400 font-medium">{employeeName}</div>
               </div>

               {/* Time Off Type */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Time off Type</label>
                  <select 
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="col-span-2 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                     <option value="paid_leave">Paid time off</option>
                     <option value="sick_leave">Sick Leave</option>
                     <option value="unpaid_leave">Unpaid Leaves</option>
                  </select>
               </div>

               {/* Validity Period */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Validity Period</label>
                  <div className="col-span-2 flex gap-2 items-center">
                     <input 
                       type="date" 
                       name="startDate"
                       value={formData.startDate}
                       onChange={handleInputChange}
                       required
                       className="bg-slate-800 border border-slate-600 text-white text-xs rounded-lg block w-full p-2" 
                     />
                     <span className="text-slate-500 text-xs">To</span>
                     <input 
                       type="date" 
                       name="endDate"
                       value={formData.endDate}
                       onChange={handleInputChange}
                       required
                       className="bg-slate-800 border border-slate-600 text-white text-xs rounded-lg block w-full p-2" 
                     />
                  </div>
               </div>

               {/* Allocation (Days Calculated) */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Allocation</label>
                  <div className="col-span-2 flex items-center gap-2">
                     <input 
                       type="number" 
                       value={calculateDays().toFixed(2)}
                       readOnly
                       className="bg-slate-800 border border-slate-600 text-blue-400 text-sm font-bold rounded-lg block w-24 p-2 text-center"
                     />
                     <span className="text-slate-500 text-sm">Days</span>
                  </div>
               </div>

               {/* Reason */}
               <div className="grid grid-cols-3 items-start gap-4">
                  <label className="text-sm font-medium text-slate-400 pt-2">Reason</label>
                  <div className="col-span-2">
                     <textarea
                       name="reason"
                       value={formData.reason}
                       onChange={handleInputChange}
                       required
                       placeholder="Please provide a reason..."
                       rows={2}
                       className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                     />
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

               {/* Modal Footer */}
               <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                     {isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
                     {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
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