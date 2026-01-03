'use client';

import React, { useState } from 'react';
import { 
  Pencil, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  User, 
  Plus, 
  Award,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

// --- IMPORTS FOR THE TABS ---
import SalaryInfoTab from '@/components/SalaryInfoTab';
import PrivateInfoTab from '@/components/PrivateInfoTab';

const AdminProfileView = () => {
  const [activeTab, setActiveTab] = useState('Resume');

  // Mock Data matching your wireframe fields
  const employee = {
    name: 'Sarah Jenkins',
    role: 'UI Designer',
    loginId: 'EMP-2024-001',
    email: 'sarah.jenkins@dayflow.com',
    mobile: '+91 98765 43210',
    company: 'Dayflow Tech Pvt Ltd',
    department: 'Product Design',
    manager: 'Michael Ross',
    location: 'Ahmedabad, Gujarat',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    jobLove: 'I love creating intuitive user experiences that solve complex problems. The collaborative environment here allows me to push my creative boundaries.',
    hobbies: 'Photography, Traveling, and Reading sci-fi novels.',
    skills: ['Figma', 'React', 'Tailwind CSS', 'User Research', 'Prototyping'],
    certifications: ['Google UX Design Professional', 'Advanced React Patterns']
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* --- Back Navigation --- */}
        <div className="mb-6">
          <Link href="/dashboard/admin" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors w-fit">
            <ChevronLeft className="h-4 w-4" /> Back to Employee List
          </Link>
        </div>

        {/* --- 1. Top Profile Header Card --- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* Avatar Section */}
            <div className="flex-shrink-0 relative mx-auto md:mx-0">
              <div className="h-40 w-40 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden bg-slate-100">
                <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" />
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-md border-2 border-white">
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid md:grid-cols-2 gap-x-12 gap-y-6">
              
              {/* Left Column: Personal Identity */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 inline-block mb-1">
                    {employee.name}
                  </h1>
                  <p className="text-slate-500 font-medium">{employee.role}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Login ID</label>
                    <div className="text-slate-900 font-medium flex items-center gap-2">
                       <User className="h-4 w-4 text-slate-400" /> {employee.loginId}
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                    <div className="text-slate-900 font-medium flex items-center gap-2">
                       <Mail className="h-4 w-4 text-slate-400" /> {employee.email}
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile</label>
                    <div className="text-slate-900 font-medium flex items-center gap-2">
                       <Phone className="h-4 w-4 text-slate-400" /> {employee.mobile}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Company Details */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-slate-100 pb-2 mb-4">
                   <span className="text-sm font-semibold text-slate-900">Employment Details</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</label>
                      <div className="text-slate-900 font-medium">{employee.company}</div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                      <div className="text-slate-900 font-medium">{employee.department}</div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manager</label>
                      <div className="text-slate-900 font-medium flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">M</div>
                        {employee.manager}
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                      <div className="text-slate-900 font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" /> {employee.location}
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- 2. Navigation Tabs --- */}
        <div className="border-b border-slate-200 mb-8">
           <div className="flex gap-8">
             {['Resume', 'Private Info', 'Salary Info'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-4 px-2 text-sm font-bold transition-all relative ${
                   activeTab === tab 
                     ? 'text-slate-900' 
                     : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {tab}
                 {activeTab === tab && (
                   <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900"></span>
                 )}
               </button>
             ))}
           </div>
        </div>

        {/* --- 3. Main Content Grid --- */}
        
        {/* VIEW 1: RESUME TAB */}
        {activeTab === 'Resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            
            {/* LEFT COLUMN (Wider) - About & Interests */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-transparent">
                 <h3 className="text-xl font-medium text-slate-900 mb-2 border-b border-slate-200 pb-2">About</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">{employee.about}</p>
              </div>
              <div className="bg-transparent">
                 <h3 className="text-xl font-medium text-slate-900 mb-2 border-b border-slate-200 pb-2">What I love about my job</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">{employee.jobLove}</p>
              </div>
              <div className="bg-transparent">
                 <h3 className="text-xl font-medium text-slate-900 mb-2 border-b border-slate-200 pb-2">My interests and hobbies</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">{employee.hobbies}</p>
              </div>
            </div>

            {/* RIGHT COLUMN (Narrower) - Skills & Certifications */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {employee.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  <Plus className="h-4 w-4" /> Add Skills
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Certification</h3>
                <div className="space-y-3 mb-6">
                  {employee.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                       <Award className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                       <span className="text-sm text-slate-700 font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  <Plus className="h-4 w-4" /> Add Certification
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* VIEW 2: PRIVATE INFO TAB */}
        {activeTab === 'Private Info' && (
           <PrivateInfoTab />
        )}

        {/* VIEW 3: SALARY INFO TAB (With Role Check) */}
        {activeTab === 'Salary Info' && (
           <SalaryInfoTab role="admin" />
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminProfileView;