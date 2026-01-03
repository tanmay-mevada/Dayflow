'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Plane, 
  MoreVertical,
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Employees');

  // Mock Data based on your wireframe requirements
  const employees = [
    { id: 1, name: 'Sarah Jenkins', role: 'UI Designer', status: 'Present', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 2, name: 'Mike Ross', role: 'Backend Dev', status: 'Leave', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 3, name: 'Rachel Zane', role: 'Paralegal', status: 'Absent', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel' },
    { id: 4, name: 'Harvey Specter', role: 'Senior Partner', status: 'Present', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey' },
    { id: 5, name: 'Donna Paulsen', role: 'COO', status: 'Present', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donna' },
    { id: 6, name: 'Louis Litt', role: 'Finances', status: 'Leave', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Louis' },
    { id: 7, name: 'Jessica Pearson', role: 'Managing Partner', status: 'Absent', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    { id: 8, name: 'Katrina Bennett', role: 'Associate', status: 'Present', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Katrina' },
    { id: 9, name: 'Alex Williams', role: 'Senior Partner', status: 'Present', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  ];

  // Helper to render the specific indicator requested in the image details
  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case 'Present':
        // Green dot: Employee is present in the office
        return <div className="h-4 w-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" title="Present"></div>;
      case 'Leave':
        // Airplane icon: Employee is on leave
        return (
          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-blue-600" title="On Leave">
            <Plane className="h-3 w-3 fill-current" />
          </div>
        );
      case 'Absent':
        // Yellow dot: Employee is absent (No time off applied)
        return <div className="h-4 w-4 bg-amber-400 rounded-full border-2 border-white shadow-sm" title="Absent"></div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        
        {/* --- Top Navigation Tabs (Matching Wireframe Header) --- */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
           {['Employees', 'Attendance', 'Time Off'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-sm font-semibold transition-colors relative ${
                 activeTab === tab 
                   ? 'text-slate-900' 
                   : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               {tab}
               {activeTab === tab && (
                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></span>
               )}
             </button>
           ))}
        </div>

        {/* --- Action Bar (New Button & Search) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           
           {/* "NEW" Button - Purple as requested */}
           <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-md shadow-purple-200 font-medium text-sm uppercase tracking-wide">
              <Plus className="h-4 w-4" /> New
           </button>

           {/* Search Bar */}
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search employees..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
              />
           </div>
        </div>

        {/* --- Employee Grid Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div 
              key={emp.id} 
              className="group bg-white rounded-xl border border-slate-200 p-6 relative hover:shadow-lg hover:border-purple-100 transition-all duration-300"
            >
              {/* STATUS INDICATOR (Top Right Corner) */}
              <div className="absolute top-4 right-4 z-10">
                 {renderStatusIndicator(emp.status)}
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-center pt-2">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={emp.image} 
                      alt={emp.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Employee Info */}
                <h3 className="text-lg font-bold text-slate-900">{emp.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{emp.role}</p>
                
                {/* Optional: Card Actions (Edit/View) */}
                <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-purple-600 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;