'use client';

import { useState, useEffect } from 'react';
import { attendanceApi } from '@/lib/api';
import { useSession } from '@/hooks/useSession';
import toast from 'react-hot-toast';

export function useAttendance(employeeId?: string, startDate?: string, endDate?: string) {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceApi.getRecords({ employeeId, startDate, endDate });
      setAttendance(data.attendance);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId, startDate, endDate]);

  const checkIn = async () => {
    try {
      const data = await attendanceApi.checkIn();
      toast.success(data.message);
      await fetchAttendance(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to check in');
      throw err;
    }
  };

  const checkOut = async () => {
    try {
      const data = await attendanceApi.checkOut();
      toast.success(data.message);
      await fetchAttendance(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to check out');
      throw err;
    }
  };

  return {
    attendance,
    loading,
    error,
    checkIn,
    checkOut,
    refetch: fetchAttendance,
  };
}

