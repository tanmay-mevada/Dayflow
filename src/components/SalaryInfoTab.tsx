'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Lock, 
  Save, 
  RotateCcw,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface SalaryInfoTabProps {
  role: 'admin' | 'employee';
}

const SalaryInfoTab = ({ role }: SalaryInfoTabProps) => {
  // --- STATE: Configuration ---
  const [wage, setWage] = useState(50000); // Monthly Wage
  const [workingDays, setWorkingDays] = useState('5');
  const [breakHours, setBreakHours] = useState('1');

  // --- STATE: Component Percentages (Configurable) ---
  // Defaults based on the "Important" note logic
  const [percentages, setPercentages] = useState({
    basic: 50,      // 50% of Wage
    hra: 50,        // 50% of Basic
    standard: 16.67,// % of Basic (Fixed amt in example ~4167)
    bonus: 8.33,    // % of Basic (Performance Bonus)
    lta: 8.33,      // % of Basic (Leave Travel Allowance)
    pf: 12,         // % of Basic (PF Contribution)
  });

  const [profTax, setProfTax] = useState(200); // Fixed Amount

  // --- CALCULATED VALUES ---
  const [breakdown, setBreakdown] = useState({
    basic: 0,
    hra: 0,
    standard: 0,
    bonus: 0,
    lta: 0,
    fixedAllowance: 0,
    pfEmployee: 0,
    pfEmployer: 0,
    grossEarnings: 0,
    totalDeductions: 0,
    netPay: 0
  });

  // --- LOGIC: Auto-Calculation Engine ---
  useEffect(() => {
    // 1. Basic = % of Wage
    const basic = Math.round(wage * (percentages.basic / 100));

    // 2. Allowances calculated as % of Basic
    const hra = Math.round(basic * (percentages.hra / 100));
    const standard = Math.round(basic * (percentages.standard / 100));
    const bonus = Math.round(basic * (percentages.bonus / 100));
    const lta = Math.round(basic * (percentages.lta / 100));

    // 3. Fixed Allowance = Balancing Figure
    // "Fixed allowance is = wage - total of all the component"
    const currentTotal = basic + hra + standard + bonus + lta;
    const fixedAllowance = Math.max(0, wage - currentTotal);

    // 4. Deductions
    // PF is calculated based on the basic salary
    const pfValue = Math.round(basic * (percentages.pf / 100)); 
    
    // 5. Totals
    const grossEarnings = basic + hra + standard + bonus + lta + fixedAllowance; // Should exactly equal Wage
    const totalDeductions = pfValue + profTax; // Employee PF + PT
    const netPay = grossEarnings - totalDeductions;

    setBreakdown({
      basic,
      hra,
      standard,
      bonus,
      lta,
      fixedAllowance,
      pfEmployee: pfValue,
      pfEmployer: pfValue, // Usually matches employee share
      grossEarnings,
      totalDeductions,
      netPay
    });
  }, [wage, percentages, profTax]);

  // --- HANDLERS ---
  const handlePercentChange = (key: keyof typeof percentages, value: string) => {
    const val = parseFloat(value) || 0;
    setPercentages(prev => ({ ...prev, [key]: val }));
  };

  const formatCurrency = (amt: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amt);

  // RESTRICTED VIEW: If not Admin, hide content
  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-400">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
           <Lock className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Access Restricted</h3>
        <p className="max-w-md text-center text-sm mt-2">
          Salary configuration is visible only to Administrators.
        </p>
      </div>
    );
  }

  // ADMIN VIEW
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-slate-200 bg-[#0f172a] p-8 rounded-2xl border border-slate-700">
      
      {/* Header Label */}
      
      {/* --- 1. Top Section: Wage & Schedule --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-slate-700 pb-8">
        
        {/* Left: Wage Inputs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-medium w-1/3">Month Wage</label>
            <div className="relative w-2/3 flex items-center gap-2">
              <input 
                type="number" 
                value={wage} 
                onChange={(e) => setWage(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-right"
              />
              <span className="text-slate-500 text-sm w-12">/ Month</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-medium w-1/3">Yearly wage</label>
            <div className="relative w-2/3 flex items-center gap-2">
              <div className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-400 text-right">
                {formatCurrency(wage * 12).replace('₹', '')}
              </div>
              <span className="text-slate-500 text-sm w-12">/ Yearly</span>
            </div>
          </div>
        </div>

        {/* Right: Schedule Inputs */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm">No of working days in a week:</label>
            <input 
              type="text" 
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              className="w-full bg-transparent border-b border-slate-600 py-1 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
             <div className="flex-1 flex flex-col gap-2">
                <label className="text-slate-400 text-xs uppercase tracking-wider">Break Time:</label>
                <input 
                  type="text" 
                  value={breakHours}
                  onChange={(e) => setBreakHours(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-600 py-1 text-right text-white focus:outline-none focus:border-blue-500"
                />
             </div>
             <span className="text-slate-400 text-lg pb-1">/hrs</span>
          </div>
        </div>
      </div>

      {/* --- 2. Main Grid: Components & Deductions --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Salary Components */}
        <div>
          <h3 className="text-slate-300 font-medium mb-6">Salary Components</h3>
          <div className="space-y-6">
            
            {/* Component Row Helper */}
            {/* We render each component with: Label, Amount (Auto), Percentage Input */}
            
            {/* Basic Salary */}
            <div className="group">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-400">Basic Salary</span>
                <div className="flex gap-4 items-center">
                  <span className="text-slate-200 font-mono">{formatCurrency(breakdown.basic)}</span>
                  <div className="flex items-center gap-1 w-16">
                    <input 
                      type="number" 
                      value={percentages.basic}
                      onChange={(e) => handlePercentChange('basic', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-600 text-right text-xs text-blue-400 focus:outline-none" 
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-600">Define Basic salary from company cost compute it based on monthly Wages.</p>
            </div>

            {/* HRA */}
            <div className="group">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-400">House Rent Allowance</span>
                <div className="flex gap-4 items-center">
                  <span className="text-slate-200 font-mono">{formatCurrency(breakdown.hra)}</span>
                  <div className="flex items-center gap-1 w-16">
                    <input 
                      type="number" 
                      value={percentages.hra}
                      onChange={(e) => handlePercentChange('hra', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-600 text-right text-xs text-blue-400 focus:outline-none" 
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-600">HRA provided to employees 50% of the basic salary.</p>
            </div>

            {/* Standard Allowance */}
            <div className="group">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-400">Standard Allowance</span>
                <div className="flex gap-4 items-center">
                  <span className="text-slate-200 font-mono">{formatCurrency(breakdown.standard)}</span>
                  <div className="flex items-center gap-1 w-16">
                    <input 
                      type="number" 
                      value={percentages.standard}
                      onChange={(e) => handlePercentChange('standard', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-600 text-right text-xs text-blue-400 focus:outline-none" 
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-600">Fixed amount provided to employees as part of salary.</p>
            </div>

            {/* Performance Bonus */}
            <div className="group">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-400">Performance Bonus</span>
                <div className="flex gap-4 items-center">
                  <span className="text-slate-200 font-mono">{formatCurrency(breakdown.bonus)}</span>
                  <div className="flex items-center gap-1 w-16">
                     <input 
                      type="number" 
                      value={percentages.bonus}
                      onChange={(e) => handlePercentChange('bonus', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-600 text-right text-xs text-blue-400 focus:outline-none" 
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-600">Variable amount paid during payroll.</p>
            </div>

            {/* LTA */}
            <div className="group">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-400">Leave Travel Allowance</span>
                <div className="flex gap-4 items-center">
                  <span className="text-slate-200 font-mono">{formatCurrency(breakdown.lta)}</span>
                  <div className="flex items-center gap-1 w-16">
                    <input 
                      type="number" 
                      value={percentages.lta}
                      onChange={(e) => handlePercentChange('lta', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-600 text-right text-xs text-blue-400 focus:outline-none" 
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-600">LTA is paid to cover travel expenses.</p>
            </div>

            {/* Fixed Allowance (Balancing) */}
            <div className="group mt-6 pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-emerald-400 font-medium">Fixed Allowance (Balancing)</span>
                <div className="flex gap-4 items-center">
                  <span className="text-emerald-400 font-mono font-bold">{formatCurrency(breakdown.fixedAllowance)}</span>
                  <div className="flex items-center gap-1 w-16">
                    {/* Display calculated % for reference */}
                    <span className="w-full text-right text-xs text-emerald-600">
                      {((breakdown.fixedAllowance / breakdown.basic) * 100).toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Automatically calculated: Wage - (Total of above components)
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Deductions */}
        <div className="space-y-8">
           
           {/* PF Section */}
           <div>
              <h3 className="text-slate-300 font-medium mb-4 border-b border-slate-700 pb-2">Provident Fund (PF) Contribution</h3>
              
              <div className="space-y-4">
                 {/* Employee PF */}
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Employee</span>
                    <div className="flex gap-4 items-center">
                       <span className="text-slate-200 font-mono">{formatCurrency(breakdown.pfEmployee)}</span>
                       <div className="flex items-center gap-1 w-16">
                         <input 
                            type="number" 
                            value={percentages.pf}
                            onChange={(e) => handlePercentChange('pf', e.target.value)}
                            className="w-full bg-transparent border-b border-slate-600 text-right text-xs text-blue-400 focus:outline-none" 
                          />
                          <span className="text-xs text-slate-500">%</span>
                       </div>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-600 mb-2">PF is calculated based on the basic salary</p>

                 {/* Employer PF */}
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Employer's</span>
                    <div className="flex gap-4 items-center">
                       <span className="text-slate-200 font-mono">{formatCurrency(breakdown.pfEmployer)}</span>
                       <div className="flex items-center gap-1 w-16">
                          <span className="w-full text-right text-xs text-slate-500">{percentages.pf}</span>
                          <span className="text-xs text-slate-500">%</span>
                       </div>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-600">PF is calculated based on the basic salary</p>
              </div>
           </div>

           {/* Tax Deductions */}
           <div>
              <h3 className="text-slate-300 font-medium mb-4 border-b border-slate-700 pb-2">Tax Deductions</h3>
              
              <div className="flex justify-between items-center text-sm mb-1">
                 <span className="text-slate-400">Professional Tax</span>
                 <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1">
                       <input 
                         type="number" 
                         value={profTax}
                         onChange={(e) => setProfTax(parseInt(e.target.value))}
                         className="bg-transparent border-b border-slate-600 text-right text-slate-200 w-24 focus:outline-none focus:border-blue-500 font-mono"
                       />
                       <span className="text-xs text-slate-500">/ month</span>
                    </div>
                 </div>
              </div>
              <p className="text-[10px] text-slate-600">Professional Tax deducted from the Gross salary</p>
           </div>
           
           {/* Save Button */}
           <div className="pt-8 flex justify-end">
              <button className="bg-slate-100 text-slate-900 px-8 py-2 rounded shadow hover:bg-white transition-colors flex items-center gap-2 text-sm font-bold">
                 <Save className="h-4 w-4" /> Save Configuration
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default SalaryInfoTab;