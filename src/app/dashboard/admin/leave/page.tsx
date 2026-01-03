'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  Upload,
  Check,
  XCircle,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { leaveApi } from '@/lib/api';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';

const AdminLeavePage = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('Time Off');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'paid_leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Fetch all leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const data = await leaveApi.getAllRecords();
        setLeaves(data.leaves || []);
      } catch (error) {
        toast.error('Failed to fetch leave records');
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  // Fetch employees for modal
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/admin/employees');
        const data = await res.json();
        if (res.ok) {
          setEmployees(data.employees || []);
        }
      } catch (error) {
        console.error('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  // Filter leaves based on search
  const filteredLeaves = useMemo(() => {
    if (!searchQuery) return leaves;
    const query = searchQuery.toLowerCase();
    return leaves.filter(leave => {
      const employee = leave.employeeId;
      const name = `${employee?.firstName || ''} ${employee?.lastName || ''}`.toLowerCase();
      const employeeId = (employee?.employeeId || '').toLowerCase();
      return name.includes(query) || employeeId.includes(query);
    });
  }, [leaves, searchQuery]);

  // Handle approve/reject
  const handleApproveReject = async (leaveId: string, status: 'approved' | 'rejected') => {
    try {
      await leaveApi.approveReject(leaveId, status);
      // Refresh leaves
      const data = await leaveApi.getAllRecords();
      setLeaves(data.leaves || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update leave request');
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '-';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-GB');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await leaveApi.createRequest({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
      toast.success('Leave request created successfully');
      setIsModalOpen(false);
      setFormData({
        employeeId: '',
        leaveType: 'paid_leave',
        startDate: '',
        endDate: '',
        reason: '',
      });
      // Refresh leaves
      const data = await leaveApi.getAllRecords();
      setLeaves(data.leaves || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create leave request');
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
              <h1 className="text-2xl font-bold text-slate-900">Time Off</h1>
              
              {/* Tabs */}
              <div className="bg-slate-100 p-1 rounded-lg w-fit">
                 <button
                   onClick={() => setActiveTab('Time Off')}
                   className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                     activeTab === 'Time Off' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Time Off
                 </button>
                 <button
                   onClick={() => setActiveTab('Allocation')}
                   className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                     activeTab === 'Allocation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Allocation
                 </button>
              </div>
           </div>

           <div className="flex gap-3">
              {/* Search Bar */}
              <div className="relative">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                 />
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all"
              >
                 <Plus className="h-4 w-4" /> NEW
              </button>
           </div>
        </div>

        {activeTab === 'Time Off' && (
          <>
            {/* --- Balance Cards (Summary) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
                  <div className="relative z-10">
                     <div className="text-sm font-medium mb-2">
                        Paid time Off: <span className="font-bold">24</span> Days Available
                     </div>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                  <div className="relative z-10">
                     <div className="text-sm font-medium text-slate-900 mb-2">
                        Sick time off: <span className="font-bold">07</span> Days Available
                     </div>
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
                     {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            Loading records...
                          </td>
                        </tr>
                     ) : filteredLeaves.length > 0 ? (
                       filteredLeaves.map((leave) => {
                         const employee = leave.employeeId;
                         const employeeName = employee?.firstName && employee?.lastName
                           ? `${employee.firstName} ${employee.lastName}`
                           : 'Unknown';
                         const leaveTypeDisplay = leave.leaveType === 'paid_leave' ? 'Paid time Off' :
                                                  leave.leaveType === 'sick_leave' ? 'Sick time off' :
                                                  leave.leaveType === 'unpaid_leave' ? 'Unpaid Leaves' :
                                                  leave.leaveType;
                         
                         return (
                           <tr key={leave._id || leave.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900">{employeeName}</td>
                              <td className="px-6 py-4 font-mono text-slate-600">{formatDate(leave.startDate)}</td>
                              <td className="px-6 py-4 font-mono text-slate-600">{formatDate(leave.endDate)}</td>
                              <td className="px-6 py-4 text-blue-600 font-medium">{leaveTypeDisplay}</td>
                              <td className="px-6 py-4">
                                 {leave.status === 'pending' ? (
                                    <div className="flex items-center gap-2">
                                       <button
                                         onClick={() => handleApproveReject(leave._id, 'rejected')}
                                         className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                         title="Reject"
                                       >
                                          <XCircle className="h-4 w-4" />
                                       </button>
                                       <button
                                         onClick={() => handleApproveReject(leave._id, 'approved')}
                                         className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
                                         title="Approve"
                                       >
                                          <Check className="h-4 w-4" />
                                       </button>
                                    </div>
                                 ) : (
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(leave.status)}`}>
                                       {leave.status}
                                    </span>
                                 )}
                              </td>
                           </tr>
                         );
                       })
                     ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            No leave records found.
                          </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
          </>
        )}

        {activeTab === 'Allocation' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
            Allocation view coming soon...
          </div>
        )}

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
               
               {/* Employee (Selectable for Admin) */}
               <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-sm font-medium text-slate-400">Employee</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="col-span-2 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
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

               {/* Allocation (Days) */}
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
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    placeholder="Please provide a reason..."
                    rows={2}
                    className="col-span-2 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
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

export default AdminLeavePage;
