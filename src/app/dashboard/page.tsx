import React from 'react';
import { Clock, CalendarCheck, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good Morning, John! 👋</h2>
          <p className="text-slate-500 mt-1">Here is what is happening with you today.</p>
        </div>

        {/* Quick Stats / Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Attendance Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                Present
              </span>
            </div>
            <div className="text-slate-500 text-sm mb-1">Check-in Time</div>
            <div className="text-2xl font-bold text-slate-900">09:02 AM</div>
            <button className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-600">
              View History
            </button>
          </div>

          {/* Card 2: Leave Balance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <CalendarCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-slate-500 text-sm mb-1">Available Paid Leave</div>
            <div className="text-2xl font-bold text-slate-900">12 Days</div>
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Apply Leave
            </button>
          </div>

          {/* Card 3: Next Holiday */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-purple-50 rounded-xl">
                <CalendarCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-slate-500 text-sm mb-1">Upcoming Holiday</div>
            <div className="text-2xl font-bold text-slate-900">26 Jan</div>
            <div className="text-sm text-slate-500 mt-1">Republic Day</div>
          </div>
        </div>

        {/* Recent Activity Table [Source: 45] */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Activity</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">Today, 09:02 AM</td>
                <td className="px-6 py-4 text-slate-600">Daily Check-in</td>
                <td className="px-6 py-4"><span className="text-emerald-600 font-medium">On Time</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">Yesterday</td>
                <td className="px-6 py-4 text-slate-600">Leave Request (Sick)</td>
                <td className="px-6 py-4"><span className="text-amber-600 font-medium">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;