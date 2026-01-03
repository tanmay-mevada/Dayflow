'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  ShieldAlert, 
  TrendingUp, 
  Pencil, 
  Save, 
  X,
  CheckCircle2,
  FileText
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const PayrollPage = () => {
  // --- STATE ---
  const [role, setRole] = useState<'employee' | 'admin'>('employee'); // Demo Toggle
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- MOCK DATA: EMPLOYEE (Read-Only) ---
  const myPayroll = {
    month: 'October 2025',
    basic: 45000,
    hra: 22500,
    allowances: 12000,
    deductions: 4500, // PF, Tax, etc.
    netSalary: 75000,
    status: 'Processed'
  };

  // --- MOCK DATA: ADMIN (Manage All) ---
  // Using state here so we can demonstrate the "Update" functionality
  const [employeesPayroll, setEmployeesPayroll] = useState([
    { id: 101, name: 'John Doe', role: 'Developer', basic: 45000, hra: 22500, allowances: 12000, status: 'Processed' },
    { id: 102, name: 'Sarah Smith', role: 'Designer', basic: 40000, hra: 20000, allowances: 10000, status: 'Pending' },
    { id: 103, name: 'Mike Johnson', role: 'Manager', basic: 65000, hra: 32500, allowances: 18000, status: 'Processed' },
  ]);

  // --- HANDLERS ---
  const handleEditClick = (id: number) => {
    setEditingId(id);
  };

  const handleSaveClick = () => {
    setEditingId(null);
    // In a real app, API call to update structure would go here [Source: 100]
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEmployeesPayroll(prev => prev.map(emp => 
      emp.id === id ? { ...emp, [field]: numValue } : emp
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- DEMO TOGGLE --- */}
       

        {/* =================================================================================
            VIEW 1: EMPLOYEE (Read-Only Salary Slip) [Source: 96]
           ================================================================================= */}
        {role === 'employee' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">My Payroll</h2>
                   <p className="text-slate-500 mt-1">View your monthly salary details and tax breakdown.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm">
                   <Download className="h-4 w-4" /> Download Slip
                </button>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                
                {/* 1. Salary Overview Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                   
                   <div className="flex items-center gap-3 mb-8 opacity-90">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><CreditCard className="h-6 w-6" /></div>
                      <span className="font-medium tracking-wide">Net Pay • {myPayroll.month}</span>
                   </div>

                   <div className="mb-2 text-blue-100 text-sm font-medium uppercase tracking-wider">Total Disbursed Amount</div>
                   <div className="text-5xl font-bold mb-8">{formatCurrency(myPayroll.netSalary)}</div>

                   <div className="flex items-center gap-2 text-sm bg-blue-500/30 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-blue-400/30">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Status: {myPayroll.status}
                   </div>
                </div>

                {/* 2. Detailed Breakdown [Source: 96] */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                   <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-slate-400" /> Salary Structure
                   </h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                         <span className="text-slate-600">Basic Salary</span>
                         <span className="font-mono font-medium text-slate-900">{formatCurrency(myPayroll.basic)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                         <span className="text-slate-600">HRA</span>
                         <span className="font-mono font-medium text-slate-900">{formatCurrency(myPayroll.hra)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                         <span className="text-slate-600">Special Allowances</span>
                         <span className="font-mono font-medium text-slate-900">{formatCurrency(myPayroll.allowances)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                         <span className="text-red-500 font-medium">Deductions (Tax/PF)</span>
                         <span className="font-mono font-medium text-red-600">- {formatCurrency(myPayroll.deductions)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100">
                         <span className="text-slate-900 font-bold text-lg">Gross Earnings</span>
                         <span className="font-mono font-bold text-slate-900 text-lg">{formatCurrency(myPayroll.basic + myPayroll.hra + myPayroll.allowances)}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* =================================================================================
            VIEW 2: ADMIN (Payroll Control & Updates) [Source: 98, 100]
           ================================================================================= */}
        {role === 'admin' && (
          <div className="animate-in fade-in duration-500 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Payroll Management</h2>
                   <p className="text-slate-500 mt-1">Manage employee salaries and update structures.</p>
                </div>
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm shadow-emerald-200">
                      <DollarSign className="h-4 w-4" /> Process Payroll
                   </button>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4 font-medium">Employee</th>
                         <th className="px-6 py-4 font-medium">Basic Salary</th>
                         <th className="px-6 py-4 font-medium">HRA</th>
                         <th className="px-6 py-4 font-medium">Allowances</th>
                         <th className="px-6 py-4 font-medium">Total Gross</th>
                         <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {employeesPayroll.map((emp) => {
                         const isRowEditing = editingId === emp.id;
                         const totalGross = emp.basic + emp.hra + emp.allowances;

                         return (
                            <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${isRowEditing ? 'bg-blue-50/50' : ''}`}>
                               <td className="px-6 py-4 font-medium text-slate-900">
                                  <div>{emp.name}</div>
                                  <div className="text-xs text-slate-500 font-normal">{emp.role}</div>
                               </td>
                               
                               {/* Editable Fields [Source: 100] */}
                               <td className="px-6 py-4">
                                  {isRowEditing ? (
                                     <input 
                                       type="number" 
                                       value={emp.basic} 
                                       onChange={(e) => handleInputChange(emp.id, 'basic', e.target.value)}
                                       className="w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                     />
                                  ) : (
                                     <span className="font-mono text-slate-600">{formatCurrency(emp.basic)}</span>
                                  )}
                               </td>
                               <td className="px-6 py-4">
                                  {isRowEditing ? (
                                     <input 
                                       type="number" 
                                       value={emp.hra} 
                                       onChange={(e) => handleInputChange(emp.id, 'hra', e.target.value)}
                                       className="w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                     />
                                  ) : (
                                     <span className="font-mono text-slate-600">{formatCurrency(emp.hra)}</span>
                                  )}
                               </td>
                               <td className="px-6 py-4">
                                  {isRowEditing ? (
                                     <input 
                                       type="number" 
                                       value={emp.allowances} 
                                       onChange={(e) => handleInputChange(emp.id, 'allowances', e.target.value)}
                                       className="w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                     />
                                  ) : (
                                     <span className="font-mono text-slate-600">{formatCurrency(emp.allowances)}</span>
                                  )}
                               </td>

                               {/* Calculated Total */}
                               <td className="px-6 py-4 font-bold text-slate-900 font-mono">
                                  {formatCurrency(totalGross)}
                               </td>

                               <td className="px-6 py-4 text-right">
                                  {isRowEditing ? (
                                     <div className="flex justify-end gap-2">
                                        <button onClick={handleSaveClick} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">
                                           <Save className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200">
                                           <X className="h-4 w-4" />
                                        </button>
                                     </div>
                                  ) : (
                                     <button onClick={() => handleEditClick(emp.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 justify-end ml-auto">
                                        <Pencil className="h-3 w-3" /> Edit
                                     </button>
                                  )}
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;