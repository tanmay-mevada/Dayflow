'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateEmployeePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    designation: '',
    department: '',
    dateOfJoining: '',
    role: 'employee',
    managerId: '',
  });

  // Redirect if not admin/HR
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || (role !== 'admin' && role !== 'hr_officer'))) {
      toast.error('Access denied. Admin/HR only.');
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to create employee');
        return;
      }

      toast.success(data.message || 'Employee created successfully! Welcome email sent to the employee.');
      
      // Reset form
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        designation: '',
        department: '',
        dateOfJoining: '',
        role: 'employee',
        managerId: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || (role !== 'admin' && role !== 'hr_officer')) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Employee</h1>
            <p className="text-slate-500 mt-1">Add a new employee to the system</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Odoo India"
                />
                <p className="text-xs text-slate-500 mt-1">Used for Login ID generation</p>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Developer"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Engineering"
                />
              </div>

              {/* Date of Joining */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="hr_officer">HR Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Login ID and password will be automatically generated. 
                The credentials will be displayed after employee creation. Please save them securely.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                {loading ? 'Creating...' : 'Create Employee'}
              </button>
              <Link href="/dashboard">
                <button
                  type="button"
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

