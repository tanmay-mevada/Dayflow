'use client';

import { useState, useEffect } from 'react';
import { leaveApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useLeave(employeeId?: string, status?: string) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaveApi.getRecords({ employeeId, status });
      setLeaves(data.leaves);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch leave records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [employeeId, status]);

  const createLeave = async (leaveData: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    attachment?: string;
  }) => {
    try {
      const data = await leaveApi.createRequest(leaveData);
      toast.success(data.message);
      await fetchLeaves(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create leave request');
      throw err;
    }
  };

  const approveReject = async (leaveId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const data = await leaveApi.approveReject(leaveId, status, rejectionReason);
      toast.success(data.message);
      await fetchLeaves(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update leave request');
      throw err;
    }
  };

  const cancelLeave = async (leaveId: string) => {
    try {
      const data = await leaveApi.cancelRequest(leaveId);
      toast.success(data.message);
      await fetchLeaves(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel leave request');
      throw err;
    }
  };

  return {
    leaves,
    loading,
    error,
    createLeave,
    approveReject,
    cancelLeave,
    refetch: fetchLeaves,
  };
}

export function useLeaveBalance(employeeId?: string) {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaveApi.getBalance(employeeId);
      setBalance(data.leaveBalance);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch leave balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [employeeId]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  };
}

