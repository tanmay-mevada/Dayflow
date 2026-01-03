'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';
import { Send, Mail, ArrowLeft, Users, User } from 'lucide-react';
import Link from 'next/link';

export default function SendNotificationPage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useSession();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipientIds: [] as string[],
    sendToAll: false,
  });

  // Redirect if not admin/HR
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || (role !== 'admin' && role !== 'hr_officer'))) {
      toast.error('Access denied. Admin/HR only.');
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, role, router]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const res = await fetch('/api/admin/employees');
        const data = await res.json();
        if (res.ok) {
          // Filter to only show verified employees
          setEmployees((data.employees || []).filter((emp: any) => emp.isVerified));
        } else {
          toast.error(data.error || 'Failed to fetch employees');
        }
      } catch (error) {
        toast.error('Failed to fetch employees');
      } finally {
        setFetchingEmployees(false);
      }
    };

    if (isAuthenticated && (role === 'admin' || role === 'hr_officer')) {
      fetchEmployees();
    }
  }, [isAuthenticated, role]);

  const handleCheckboxChange = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      recipientIds: prev.recipientIds.includes(employeeId)
        ? prev.recipientIds.filter((id) => id !== employeeId)
        : [...prev.recipientIds, employeeId],
    }));
  };

  const handleSendToAllChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sendToAll: checked,
      recipientIds: checked ? [] : prev.recipientIds,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to send notification');
        return;
      }

      toast.success(data.message || 'Notification sent successfully!');
      
      if (data.results?.failed > 0) {
        toast.error(`Failed to send to ${data.results.failed} recipient(s)`, {
          duration: 5000,
        });
      }

      // Reset form
      setFormData({
        subject: '',
        message: '',
        recipientIds: [],
        sendToAll: false,
      });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || fetchingEmployees) {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Employees</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Send Notification</h1>
          <p className="text-slate-600">Compose and send notifications to employees via email</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
          {/* Subject */}
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter notification subject"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={8}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Enter your notification message..."
              required
            />
          </div>

          {/* Send to All Option */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendToAll}
                onChange={(e) => handleSendToAllChange(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Send to all employees
                </span>
              </div>
            </label>
            <p className="text-xs text-slate-600 mt-2 ml-8">
              This will send the notification to all verified employees in the system
            </p>
          </div>

          {/* Recipient Selection */}
          {!formData.sendToAll && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Recipients <span className="text-red-500">*</span>
              </label>
              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-4 space-y-2">
                {employees.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No employees available</p>
                ) : (
                  employees.map((emp) => (
                    <label
                      key={emp._id || emp.id}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.recipientIds.includes(emp._id || emp.id)}
                        onChange={() => handleCheckboxChange(emp._id || emp.id)}
                        className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                      />
                      <User className="h-4 w-4 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-xs text-slate-500">{emp.email}</div>
                      </div>
                      {emp.designation && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {emp.designation}
                        </span>
                      )}
                    </label>
                  ))
                )}
              </div>
              {formData.recipientIds.length > 0 && (
                <p className="text-xs text-slate-600 mt-2">
                  {formData.recipientIds.length} employee(s) selected
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!formData.sendToAll && formData.recipientIds.length === 0)}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

