'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, FileText, Download, Calendar, Users, DollarSign, PieChart,
  Printer, Search, Filter, X, Check, ArrowUpRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/hooks/useSession';

const AnalyticsPage = () => {
  const { role } = useSession();
  const isAdmin = role === 'admin' || role === 'hr_officer';
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');

  // --- MOCK EMPLOYEES ---
  const employees = [
    { _id: '1', firstName: 'Sarah', lastName: 'Jenkins', employeeId: 'EMP-2024-001', designation: 'Senior Developer' },
    { _id: '2', firstName: 'Michael', lastName: 'Ross', employeeId: 'EMP-2024-002', designation: 'UI/UX Designer' },
    { _id: '3', firstName: 'Donna', lastName: 'Paulsen', employeeId: 'EMP-2024-003', designation: 'Operations Manager' },
    { _id: '4', firstName: 'Harvey', lastName: 'Specter', employeeId: 'EMP-2024-004', designation: 'Legal Advisor' },
    { _id: '5', firstName: 'Rachel', lastName: 'Zane', employeeId: 'EMP-2024-005', designation: 'Paralegal' },
  ];

  // --- REPORT STATE ---
  const [reportConfig, setReportConfig] = useState({
    type: 'payslip',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    employeeId: ''
  });
  
  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Close dropdown logic
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectEmployee = (emp: any) => {
    setReportConfig({ ...reportConfig, employeeId: emp.employeeId });
    setSearchQuery(`${emp.firstName} ${emp.lastName} (${emp.employeeId})`);
    setIsDropdownOpen(false);
  };

  const clearSelection = () => {
    setReportConfig({ ...reportConfig, employeeId: '' });
    setSearchQuery('');
  };

  const handleGenerateReport = () => {
    setGeneratedReport({
      id: `RPT-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString(),
      type: reportConfig.type === 'payslip' ? 'Salary Slip' : 'Attendance Log',
      period: `${reportConfig.month}/${reportConfig.year}`,
      status: 'Generated'
    });
  };

  // --- CHART DATA ---
  const weeklyStats = [
    { day: 'Mon', present: 90, late: 5, absent: 5 },
    { day: 'Tue', present: 85, late: 10, absent: 5 },
    { day: 'Wed', present: 95, late: 2, absent: 3 },
    { day: 'Thu', present: 88, late: 8, absent: 4 },
    { day: 'Fri', present: 80, late: 15, absent: 5 },
  ];

  // Updated to be more random (bigger and smaller)
  const monthlyPayroll = [
    { month: 'Jun', amount: 480 },
    { month: 'Jul', amount: 350 }, // Smaller
    { month: 'Aug', amount: 500 }, // Bigger
    { month: 'Sep', amount: 420 }, // Smaller
    { month: 'Oct', amount: 550 }, // Biggest
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
           <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
              <p className="text-slate-500">Monitor company metrics and generate official documents.</p>
           </div>
           <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <BarChart3 className="h-4 w-4" /> Overview
              </button>
              <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <FileText className="h-4 w-4" /> Reports Center
              </button>
           </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Key Metrics */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="p-3 bg-blue-50 rounded-xl"><Users className="h-6 w-6 text-blue-600" /></div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" /> 2.5%
                      </span>
                   </div>
                   <div className="mt-4">
                      <div className="text-3xl font-bold text-slate-900">96%</div>
                      <div className="text-sm text-slate-500">Average Attendance</div>
                   </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="p-3 bg-emerald-50 rounded-xl"><DollarSign className="h-6 w-6 text-emerald-600" /></div>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Oct 2025</span>
                   </div>
                   <div className="mt-4">
                      <div className="text-3xl font-bold text-slate-900">₹4.8L</div>
                      <div className="text-sm text-slate-500">Total Payroll Cost</div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="p-3 bg-amber-50 rounded-xl"><PieChart className="h-6 w-6 text-amber-600" /></div>
                   </div>
                   <div className="mt-4">
                      <div className="text-3xl font-bold text-slate-900">12</div>
                      <div className="text-sm text-slate-500">Pending Leave Requests</div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Weekly Attendance Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-6">Weekly Attendance Trends</h3>
                   <div className="flex items-end justify-between h-64 gap-4 pt-4 px-2">
                      {weeklyStats.map((stat, i) => (
                         // Added h-full here to ensure the column takes full height
                         <div key={i} className="flex flex-col items-center w-full h-full gap-2 justify-end group cursor-pointer">
                            <div className="w-full max-w-[48px] h-full flex flex-col justify-end relative">
                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                                  {stat.present}% Present
                               </div>
                               {/* Absent */}
                               <div style={{ height: `${stat.absent}%` }} className="w-full bg-red-400 rounded-t-sm opacity-90"></div>
                               {/* Late */}
                               <div style={{ height: `${stat.late}%` }} className="w-full bg-amber-400 opacity-90"></div>
                               {/* Present */}
                               <div style={{ height: `${stat.present}%` }} className="w-full bg-blue-600 rounded-b-sm shadow-sm group-hover:bg-blue-700 transition-colors"></div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">{stat.day}</span>
                         </div>
                      ))}
                   </div>
                   <div className="flex justify-center gap-6 mt-6 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Present</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-sm"></div> Late</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Absent</div>
                   </div>
                </div>

                {/* 2. Payroll Cost Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-6">Payroll Cost History</h3>
                   <div className="flex items-end justify-between h-64 gap-6 pt-4 px-4">
                      {monthlyPayroll.map((item, i) => (
                         // Added h-full and justify-end here
                         <div key={i} className="flex flex-col items-center w-full h-full gap-2 justify-end group cursor-pointer">
                            <div 
                               // Using max value of 600k to calculate percentage
                               style={{ height: `${(item.amount / 600) * 100}%` }} 
                               className="w-full max-w-[60px] bg-emerald-500 rounded-t-lg shadow-sm group-hover:bg-emerald-600 transition-all relative"
                            >
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-slate-900 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                                  {item.amount}k
                               </div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">{item.month}</span>
                            <div className="w-full h-1 bg-emerald-100 rounded-full mt-1"></div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB 2: REPORTS CENTER */}
        {activeTab === 'reports' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Configuration Panel */}
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-6">
                 <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" /> Report Settings
                 </h3>
                 
                 <div className="space-y-5">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                       <select 
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={reportConfig.type}
                          onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                       >
                          <option value="payslip">Salary Slip</option>
                          <option value="attendance">Attendance Log</option>
                          {isAdmin && <option value="tax">Tax Summary</option>}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
                          <select 
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={reportConfig.month}
                            onChange={(e) => setReportConfig({...reportConfig, month: Number(e.target.value)})}
                          >
                             {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                                <option key={i} value={i+1}>{m}</option>
                             ))}
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                          <select 
                             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                             value={reportConfig.year}
                             onChange={(e) => setReportConfig({...reportConfig, year: Number(e.target.value)})}
                          >
                             <option value="2024">2024</option>
                             <option value="2025">2025</option>
                          </select>
                       </div>
                    </div>

                    {/* SEARCH DROPDOWN */}
                    {isAdmin && (
                       <div className="relative" ref={dropdownRef}>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
                          <div className="relative">
                             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                             <input 
                                type="text" 
                                placeholder="Search..."
                                className="pl-10 pr-8 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                    if(reportConfig.employeeId) setReportConfig({ ...reportConfig, employeeId: '' });
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                             />
                             {searchQuery && (
                                <button onClick={clearSelection} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                                    <X className="h-4 w-4" />
                                </button>
                             )}
                          </div>
                          
                          {/* Results List */}
                          {isDropdownOpen && searchQuery && !reportConfig.employeeId && (
                             <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp) => (
                                        <div 
                                            key={emp._id}
                                            onClick={() => handleSelectEmployee(emp)}
                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {emp.firstName[0]}{emp.lastName[0]}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-sm font-medium text-slate-900 truncate">{emp.firstName} {emp.lastName}</div>
                                                    <div className="text-xs text-slate-500 truncate">{emp.employeeId} • {emp.designation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-xs text-slate-500">No employees found.</div>
                                )}
                             </div>
                          )}
                          
                          {reportConfig.employeeId && (
                              <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                  <Check className="h-3 w-3" /> Employee Selected
                              </div>
                          )}
                       </div>
                    )}

                    <button 
                       onClick={handleGenerateReport}
                       className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                    >
                       Generate Report
                    </button>
                 </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-2 space-y-4">
                  {generatedReport ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                 <FileText className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900">{generatedReport.type}</h4>
                                 <p className="text-xs text-slate-500">Generated on {generatedReport.date}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg">
                                 <Download className="h-3 w-3" /> Download PDF
                              </button>
                           </div>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-slate-500">Report Preview Ready for {reportConfig.employeeId || 'All Employees'}</p>
                        </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                       <FileText className="h-12 w-12 mb-3 opacity-20" />
                       <p className="font-medium">No report generated</p>
                       <p className="text-sm">Select options and click generate to view preview.</p>
                    </div>
                  )}
              </div>
           </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;