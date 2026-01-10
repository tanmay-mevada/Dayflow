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

  // Common class for inputs to ensure consistent styling
  const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 transition-colors rounded-lg hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Employee</h1>
            <p className="mt-1 text-slate-500">Add a new employee to the system</p>
          </div>
        </div>

        <div className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Odoo India"
                />
                <p className="mt-1 text-xs text-slate-500">Used for Login ID generation</p>
              </div>

              {/* First Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Senior Developer"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Engineering"
                />
              </div>

              {/* Date of Joining */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={inputClass}
                >
                  <option value="employee">Employee</option>
                  <option value="hr_officer">HR Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Login ID and password will be automatically generated. 
                The credentials will be displayed after employee creation. Please save them securely.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5" />
                {loading ? 'Creating...' : 'Create Employee'}
              </button>
              <Link href="/dashboard">
                <button
                  type="button"
                  className="px-6 py-3 font-medium transition-colors border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
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