'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

const EmployeeProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!employeeId) {
      toast.error('Employee ID not provided');
      router.push('/dashboard/admin');
      return;
    }

    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching employee with ID:', employeeId); // Debug log
        const res = await fetch(`/api/admin/employees/${employeeId}`);
        const data = await res.json();

        console.log('API Response:', res.status, data); // Debug log

        if (res.ok) {
          setEmployee(data.employee);
        } else {
          console.error('Error fetching employee:', data.error); // Debug log
          toast.error(data.error || 'Failed to fetch employee details');
          // Don't redirect immediately, let user see the error
          setTimeout(() => router.push('/dashboard/admin'), 2000);
        }
      } catch (error) {
        console.error('Fetch error:', error); // Debug log
        toast.error('Failed to fetch employee details');
        setTimeout(() => router.push('/dashboard/admin'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId, router]);

  const getProfileImage = (emp: any) => {
    if (emp?.profilePicture) return emp.profilePicture;
    const name = `${emp?.firstName || ''} ${emp?.lastName || ''}`.trim();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  const getEmployeeStatus = (emp: any) => {
    if (emp?.status === 'working') return 'Present';
    if (emp?.status === 'on_leave') return 'On Leave';
    return 'Absent';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteEmployee = async () => {
    if (!employeeId) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/employees/${employeeId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Employee deleted successfully');
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 1000);
      } else {
        toast.error(data.error || 'Failed to delete employee');
      }
    } catch (error) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading employee details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-slate-600">Employee not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  const status = getEmployeeStatus(employee);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/admin')}
          className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              {/* Profile Picture & Basic Info */}
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                <img
                  src={getProfileImage(employee)}
                  alt={fullName}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-slate-800">{fullName}</h1>
                  <p className="text-lg text-slate-600 mt-1">{employee.designation || 'Employee'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status === 'Present' ? 'bg-green-100 text-green-700' :
                      status === 'On Leave' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                      {employee.role || 'employee'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Full Name</label>
                <p className="text-slate-800 mt-1">{fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-800">{employee.email || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-800">{employee.phone || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-800">{employee.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Employment Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Employee ID</label>
                <p className="text-slate-800 mt-1">{employee.employeeId || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Designation</label>
                <p className="text-slate-800 mt-1">{employee.designation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Department</label>
                <p className="text-slate-800 mt-1">{employee.department || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Join Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-800">{formatDate(employee.joinDate)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Employment Type</label>
                <p className="text-slate-800 mt-1">{employee.employmentType || 'Full-time'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Balance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Leave Balance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Annual Leave</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {employee.leaveBalance?.annual || 0} days
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Sick Leave</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {employee.leaveBalance?.sick || 0} days
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Account Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Account Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Email Verified</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {employee.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Created</span>
                <span className="text-slate-800">{formatDate(employee.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Delete Employee</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-slate-700">
                Are you sure you want to delete <span className="font-semibold">{fullName}</span>?
              </p>
              <p className="text-sm text-slate-600 mt-2">
                All employee data, including attendance records and leave history, will be permanently removed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Employee
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

export default EmployeeProfile;