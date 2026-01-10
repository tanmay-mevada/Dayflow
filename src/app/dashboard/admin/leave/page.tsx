'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Eye,
  Check,
  X,
  FileText
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

const AdminTimeOff = () => {
  const router = useRouter();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all' 
        ? '/api/leave/admin' 
        : `/api/leave?status=${filterStatus}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setLeaves(data.leaves || []);
      } else {
        toast.error(data.error || 'Failed to fetch leave requests');
      }
    } catch (error) {
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      setProcessing(true);
      console.log('Approving leave:', selectedLeave._id); // Debug log
      
      const res = await fetch(`/api/admin/leaves/${selectedLeave._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      const data = await res.json();
      console.log('Approve response:', res.status, data); // Debug log

      if (res.ok) {
        toast.success('Leave request approved successfully');
        setShowApproveModal(false);
        setShowDetailsModal(false);
        setSelectedLeave(null);
        fetchLeaves();
      } else {
        console.error('Approve error:', data); // Debug log
        toast.error(data.error || 'Failed to approve leave');
      }
    } catch (error) {
      console.error('Approve catch error:', error); // Debug log
      toast.error('Failed to approve leave');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLeave) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      console.log('Rejecting leave:', selectedLeave._id, 'Reason:', rejectionReason); // Debug log
      
      const res = await fetch(`/api/admin/leaves/${selectedLeave._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason: rejectionReason.trim()
        })
      });

      const data = await res.json();
      console.log('Reject response:', res.status, data); // Debug log

      if (res.ok) {
        toast.success('Leave request rejected');
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setSelectedLeave(null);
        setRejectionReason('');
        fetchLeaves();
      } else {
        console.error('Reject error:', data); // Debug log
        toast.error(data.error || 'Failed to reject leave');
      }
    } catch (error) {
      console.error('Reject catch error:', error); // Debug log
      toast.error('Failed to reject leave');
    } finally {
      setProcessing(false);
    }
  };

  const openDetailsModal = (leave: any) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };

  const getProfileImage = (employee: any) => {
    if (employee?.profilePicture) return employee.profilePicture;
    const name = `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      ),
      approved: (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      ),
      rejected: (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      )
    };
    return badges[status as keyof typeof badges] || null;
  };

  const getLeaveTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      paid_leave: 'Paid Leave',
      sick_leave: 'Sick Leave',
      casual_leave: 'Casual Leave',
      unpaid_leave: 'Unpaid Leave',
      maternity_leave: 'Maternity Leave',
      paternity_leave: 'Paternity Leave'
    };
    return types[type] || type;
  };

  const filteredLeaves = leaves.filter(leave => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const employeeName = `${leave.employeeId?.firstName || ''} ${leave.employeeId?.lastName || ''}`.toLowerCase();
    const employeeId = (leave.employeeId?.employeeId || '').toLowerCase();
    const leaveType = getLeaveTypeLabel(leave.leaveType).toLowerCase();
    
    return employeeName.includes(query) || employeeId.includes(query) || leaveType.includes(query);
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Time Off Requests</h1>
            <p className="text-slate-600 mt-1">Manage employee leave requests</p>
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
            className="pb-3 text-slate-600 hover:text-purple-600 transition-colors"
          >
            Attendance
          </Link>
          <Link 
            href="/dashboard/admin/leave" 
            className="pb-3 text-purple-600 border-b-2 border-purple-600 font-medium"
          >
            Leaves
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-yellow-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-green-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-red-600 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee name, ID, or leave type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading leave requests...</p>
              </div>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No leave requests found matching your filters.' 
                  : 'No leave requests found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Leave Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Days</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLeaves.map((leave) => {
                    const employee = leave.employeeId;
                    const fullName = `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim();

                    return (
                      <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProfileImage(employee)}
                              alt={fullName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-slate-800">{fullName}</p>
                              <p className="text-sm text-slate-500">{employee?.employeeId || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {getLeaveTypeLabel(leave.leaveType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(leave.startDate)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(leave.endDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-800">{leave.totalDays}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(leave.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDetailsModal(leave)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                            {leave.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setShowApproveModal(true);
                                  }}
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setShowRejectModal(true);
                                  }}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
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
        {!loading && filteredLeaves.length > 0 && (
          <div className="text-center text-sm text-slate-600">
            Showing {filteredLeaves.length} of {leaves.length} leave requests
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Leave Request Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 mb-3">Employee Information</h4>
                <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-4">
                  <img
                    src={getProfileImage(selectedLeave.employeeId)}
                    alt="Employee"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 text-lg">
                      {`${selectedLeave.employeeId?.firstName || ''} ${selectedLeave.employeeId?.lastName || ''}`.trim()}
                    </p>
                    <p className="text-slate-600">{selectedLeave.employeeId?.designation || '-'}</p>
                    <p className="text-sm text-slate-500">ID: {selectedLeave.employeeId?.employeeId || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Leave Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 mb-3">Leave Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Leave Type</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {getLeaveTypeLabel(selectedLeave.leaveType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Days</p>
                    <p className="font-medium text-slate-800 mt-1">{selectedLeave.totalDays} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Start Date</p>
                    <p className="font-medium text-slate-800 mt-1">{formatDate(selectedLeave.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">End Date</p>
                    <p className="font-medium text-slate-800 mt-1">{formatDate(selectedLeave.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedLeave.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Applied On</p>
                    <p className="font-medium text-slate-800 mt-1">{formatDate(selectedLeave.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              {selectedLeave.reason && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-2">Reason</h4>
                  <p className="text-slate-700 bg-slate-50 rounded-lg p-4">{selectedLeave.reason}</p>
                </div>
              )}

              {/* Approval Info */}
              {selectedLeave.status !== 'pending' && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-3">
                    {selectedLeave.status === 'approved' ? 'Approval' : 'Rejection'} Information
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    {selectedLeave.approvedBy && (
                      <div>
                        <p className="text-sm text-slate-500">Processed By</p>
                        <p className="font-medium text-slate-800">
                          {`${selectedLeave.approvedBy?.firstName || ''} ${selectedLeave.approvedBy?.lastName || ''}`.trim()}
                        </p>
                      </div>
                    )}
                    {selectedLeave.approvedAt && (
                      <div>
                        <p className="text-sm text-slate-500">Processed On</p>
                        <p className="font-medium text-slate-800">{formatDate(selectedLeave.approvedAt)}</p>
                      </div>
                    )}
                    {selectedLeave.rejectionReason && (
                      <div>
                        <p className="text-sm text-slate-500">Rejection Reason</p>
                        <p className="font-medium text-slate-800">{selectedLeave.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedLeave.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowApproveModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Approve Leave
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Reject Leave
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Approve Leave Request</h3>
                <p className="text-sm text-slate-500">Confirm approval</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-slate-700">
                Are you sure you want to approve this leave request for{' '}
                <span className="font-semibold">
                  {`${selectedLeave.employeeId?.firstName || ''} ${selectedLeave.employeeId?.lastName || ''}`.trim()}
                </span>?
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Duration: {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)} ({selectedLeave.totalDays} days)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Approve
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Reject Leave Request</h3>
                <p className="text-sm text-slate-500">Provide a reason</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-slate-700">
                Rejecting leave request for{' '}
                <span className="font-semibold">
                  {`${selectedLeave.employeeId?.firstName || ''} ${selectedLeave.employeeId?.lastName || ''}`.trim()}
                </span>
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminTimeOff;