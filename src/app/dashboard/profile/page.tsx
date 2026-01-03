'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  Camera, 
  Save, 
  X,
  Pencil,
  Download
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock Data mimicking database record
  const [profile, setProfile] = useState({
    // Personal Details [Source: 56]
    fullName: 'John Doe',
    email: 'john.doe@dayflow.com',
    phone: '+91 98765 43210',
    address: 'B-101, Tech Park Avenue, Ahmedabad, Gujarat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    
    // Job Details [Source: 57]
    employeeId: 'EMP-001',
    department: 'Engineering',
    designation: 'Senior Frontend Developer',
    joiningDate: '12th Aug, 2023',
    manager: 'Sarah Smith',

    // Salary Structure [Source: 61]
    basicSalary: '₹ 85,000',
    hra: '₹ 42,500',
    allowances: '₹ 20,000',
    
    // Documents [Source: 62]
    documents: [
      { name: 'Offer_Letter.pdf', size: '2.4 MB' },
      { name: 'Aadhar_Card.pdf', size: '1.1 MB' },
      { name: 'NDA_Signed.pdf', size: '0.8 MB' },
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500">Manage your personal information and view job details.</p>
          </div>
          
          {/* Edit / Save Logic */}
          {isEditing ? (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              
              {/* Avatar Section [Source: 63, 65] */}
              <div className="relative inline-block mt-8 mb-4">
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="h-28 w-28 rounded-full border-4 border-white shadow-md bg-white"
                />
                {isEditing && (
                  <button className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-lg" title="Change Picture">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
              <p className="text-slate-500 text-sm mb-4">{profile.designation}</p>
              
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 py-2 rounded-lg border border-slate-100">
                <span>Employee ID:</span>
                <span className="font-mono text-slate-900">{profile.employeeId}</span>
              </div>
            </div>

            {/* Documents Section [Source: 62] */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> Documents
              </h3>
              <div className="space-y-3">
                {profile.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <FileText className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.size}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Personal Details Section [Source: 56] */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    disabled 
                    type="text" 
                    value={profile.fullName} 
                    className="w-full rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      disabled 
                      type="email" 
                      value={profile.email} 
                      className="pl-10 w-full rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                    />
                  </div>
                </div>

                {/* Editable Field: Phone [Source: 65] */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number {isEditing && <span className="text-blue-600 text-xs">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      name="phone"
                      disabled={!isEditing}
                      type="tel" 
                      value={profile.phone} 
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border-slate-200 ${
                        isEditing ? 'bg-white focus:ring-blue-500 focus:border-blue-500' : 'bg-slate-50 text-slate-500 cursor-not-allowed'
                      }`} 
                    />
                  </div>
                </div>

                {/* Editable Field: Address [Source: 65] */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Address {isEditing && <span className="text-blue-600 text-xs">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea 
                      name="address"
                      disabled={!isEditing}
                      rows={2}
                      value={profile.address}
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border-slate-200 ${
                        isEditing ? 'bg-white focus:ring-blue-500 focus:border-blue-500' : 'bg-slate-50 text-slate-500 cursor-not-allowed'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Job Details Section [Source: 57] */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-600" /> Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <div className="text-slate-900 font-medium">{profile.department}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Manager</label>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">SM</div>
                    <span className="text-slate-900 font-medium">{profile.manager}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Date of Joining</label>
                  <div className="text-slate-900 font-medium">{profile.joiningDate}</div>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Employment Status</label>
                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                     Active Full-Time
                   </span>
                </div>
              </div>
            </div>

             {/* 3. Salary Structure [Source: 61] */}
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-50 rounded-full blur-xl opacity-50"></div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="text-emerald-600 font-serif font-black text-xl">₹</span> Salary Structure
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-slate-600">Basic Salary</span>
                    <span className="font-mono font-medium text-slate-900">{profile.basicSalary}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-slate-600">HRA (House Rent Allowance)</span>
                    <span className="font-mono font-medium text-slate-900">{profile.hra}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-slate-600">Special Allowances</span>
                    <span className="font-mono font-medium text-slate-900">{profile.allowances}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-900 font-bold">Gross Salary (Monthly)</span>
                    <span className="font-mono font-bold text-emerald-600 text-lg">₹ 1,47,500</span>
                  </div>
                </div>
                
                <div className="mt-6 bg-slate-50 p-4 rounded-lg text-xs text-slate-500 flex items-start gap-2">
                  <div className="mt-0.5 min-w-[16px]"><FileText className="h-4 w-4" /></div>
                  Confidential: This information is visible only to you and the HR Admin.
                </div>
             </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;