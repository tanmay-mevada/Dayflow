'use client';

import React from 'react';
import { CreditCard, User, Calendar, MapPin, Mail, Hash, Briefcase } from 'lucide-react';

// Mock data based on the fields in your wireframe
const mockPrivateInfo = {
  // Left Column: Personal
  dob: '15th August, 1990',
  address: 'B-101, Tech Park Avenue, Ahmedabad, Gujarat, India - 380015',
  nationality: 'Indian',
  personalEmail: 'sarah.j.personal@email.com',
  gender: 'Female',
  maritalStatus: 'Married',
  joiningDate: '12th August, 2023',

  // Right Column: Bank & Statutory
  accountNumber: '123456789012',
  bankName: 'HDFC Bank Ltd.',
  ifscCode: 'HDFC0001234',
  panNo: 'ABCDE1234F',
  uanNo: '100900123456',
  empCode: 'EMP-2024-001'
};

const PrivateInfoTab = () => {
  
  // Helper function to create the underlined field style from your wireframe
  const renderField = (label: string, value: string, icon?: React.ReactNode) => (
    <div className="group">
      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        {icon && <span className="text-slate-300 group-hover:text-slate-400 transition-colors">{icon}</span>}
        {label}
      </label>
      <div className="block w-full border-b border-slate-200 py-2 text-slate-900 font-medium font-mono text-sm break-words">
        {value}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        
        {/* --- LEFT COLUMN: Personal Info --- */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-slate-400" /> Personal Details
          </h3>
          
          {renderField('Date of Birth', mockPrivateInfo.dob, <Calendar className="h-4 w-4" />)}
          {renderField('Residing Address', mockPrivateInfo.address, <MapPin className="h-4 w-4" />)}
          {renderField('Nationality', mockPrivateInfo.nationality)}
          {renderField('Personal Email', mockPrivateInfo.personalEmail, <Mail className="h-4 w-4" />)}
          
          <div className="grid grid-cols-2 gap-6">
            {renderField('Gender', mockPrivateInfo.gender)}
            {renderField('Marital Status', mockPrivateInfo.maritalStatus)}
          </div>
          
          {renderField('Date of Joining', mockPrivateInfo.joiningDate, <Briefcase className="h-4 w-4" />)}
        </div>

        {/* --- RIGHT COLUMN: Bank & Statutory Details --- */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-400" /> Bank & Statutory Details
          </h3>
          
          {renderField('Account Number', mockPrivateInfo.accountNumber, <Hash className="h-4 w-4" />)}
          {renderField('Bank Name', mockPrivateInfo.bankName)}
          {renderField('IFSC Code', mockPrivateInfo.ifscCode, <Hash className="h-4 w-4" />)}
          
          <div className="pt-4 border-t border-slate-50 space-y-6">
            {renderField('PAN No', mockPrivateInfo.panNo, <CreditCard className="h-4 w-4" />)}
            {renderField('UAN NO', mockPrivateInfo.uanNo, <Hash className="h-4 w-4" />)}
            {renderField('Emp Code', mockPrivateInfo.empCode, <User className="h-4 w-4" />)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivateInfoTab;