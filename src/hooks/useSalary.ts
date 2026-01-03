'use client';

import { useState, useEffect } from 'react';
import { salaryApi, payrollApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useSalary(employeeId?: string) {
  const [salary, setSalary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salaryApi.getSalary(employeeId);
      setSalary(data.salary);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch salary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [employeeId]);

  const updateSalary = async (salaryData: any) => {
    try {
      const data = await salaryApi.updateSalary(salaryData);
      toast.success(data.message);
      await fetchSalary(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update salary');
      throw err;
    }
  };

  return {
    salary,
    loading,
    error,
    updateSalary,
    refetch: fetchSalary,
  };
}

export function usePayroll(employeeId?: string, month?: number, year?: number) {
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollApi.getRecords({ employeeId, month, year });
      setPayrollRecords(data.payrollRecords);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch payroll records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [employeeId, month, year]);

  const processPayroll = async (payrollData: { employeeId: string; month: number; year: number; deductions?: number }) => {
    try {
      const data = await payrollApi.processPayroll(payrollData);
      toast.success(data.message);
      await fetchPayroll(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to process payroll');
      throw err;
    }
  };

  return {
    payrollRecords,
    loading,
    error,
    processPayroll,
    refetch: fetchPayroll,
  };
}

