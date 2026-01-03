'use client';

import React, { useState, useEffect } from 'react';
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
  Download,
  Calendar,
  Globe,
  Users as UsersIcon
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        maritalStatus: profile.maritalStatus || '',
        nationality: profile.nationality || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Marital status is required';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsSaving(true);
    try {
      const updatePayload: any = {
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality.trim(),
      };

      await updateProfile(updatePayload);
      setIsEditing(false);
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        maritalStatus: profile.maritalStatus || '',
        nationality: profile.nationality || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading profile...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">Failed to load profile</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User';
  const profilePicture = profile.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`;
  const managerName = profile.managerId 
    ? `${profile.managerId.firstName || ''} ${profile.managerId.lastName || ''}`.trim()
    : 'Not assigned';

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
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
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
              
              {/* Avatar Section */}
              <div className="relative inline-block mt-8 mb-4">
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="h-28 w-28 rounded-full border-4 border-white shadow-md bg-white"
                />
                {isEditing && (
                  <button className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-lg" title="Change Picture">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-slate-500 text-sm mb-4">{profile.designation || 'Employee'}</p>
              
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 py-2 rounded-lg border border-slate-100">
                <span>Employee ID:</span>
                <span className="font-mono text-slate-900">{profile.employeeId}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Personal Details Section */}
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
                    value={fullName}
                    className="w-full rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed px-4 py-2.5 border" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input 
                      disabled 
                      type="email" 
                      value={profile.email || ''}
                      className="pl-10 w-full rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed px-4 py-2.5 border" 
                    />
                  </div>
                </div>

                {/* Phone Number - Editable */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                    {isEditing && <span className="text-blue-600 text-xs ml-2">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input 
                      name="phoneNumber"
                      disabled={!isEditing}
                      type="tel" 
                      value={formData.phoneNumber} 
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border px-4 py-2.5 ${
                        errors.phoneNumber 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : isEditing 
                            ? 'bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Date of Birth - Editable */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                    {isEditing && <span className="text-blue-600 text-xs ml-2">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input 
                      name="dateOfBirth"
                      disabled={!isEditing}
                      type="date" 
                      value={formData.dateOfBirth} 
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`pl-10 w-full rounded-lg border px-4 py-2.5 ${
                        errors.dateOfBirth 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : isEditing 
                            ? 'bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Gender - Editable */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                    {isEditing && <span className="text-blue-600 text-xs ml-2">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <select 
                      name="gender"
                      disabled={!isEditing}
                      value={formData.gender} 
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border px-4 py-2.5 ${
                        errors.gender 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : isEditing 
                            ? 'bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Marital Status - Editable */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Marital Status <span className="text-red-500">*</span>
                    {isEditing && <span className="text-blue-600 text-xs ml-2">(Editable)</span>}
                  </label>
                  <select 
                    name="maritalStatus"
                    disabled={!isEditing}
                    value={formData.maritalStatus} 
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 ${
                      errors.maritalStatus 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : isEditing 
                          ? 'bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && (
                    <p className="mt-1 text-sm text-red-600">{errors.maritalStatus}</p>
                  )}
                </div>

                {/* Nationality - Editable */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                    {isEditing && <span className="text-blue-600 text-xs ml-2">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input 
                      name="nationality"
                      disabled={!isEditing}
                      type="text" 
                      value={formData.nationality} 
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border px-4 py-2.5 ${
                        errors.nationality 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : isEditing 
                            ? 'bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                      placeholder="e.g., Indian, American"
                    />
                  </div>
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                  )}
                </div>

                {/* Address - Editable */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Address <span className="text-red-500">*</span>
                    {isEditing && <span className="text-blue-600 text-xs ml-2">(Editable)</span>}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <textarea 
                      name="address"
                      disabled={!isEditing}
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border px-4 py-2.5 resize-none ${
                        errors.address 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : isEditing 
                            ? 'bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Job Details Section */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-600" /> Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <div className="text-slate-900 font-medium">{profile.department || 'Not assigned'}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Manager</label>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                      {managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-slate-900 font-medium">{managerName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Date of Joining</label>
                  <div className="text-slate-900 font-medium">
                    {profile.dateOfJoining 
                      ? new Date(profile.dateOfJoining).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'Not available'}
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Employment Status</label>
                   <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                     profile.employmentStatus === 'active' 
                       ? 'bg-emerald-100 text-emerald-700'
                       : profile.employmentStatus === 'inactive'
                       ? 'bg-yellow-100 text-yellow-700'
                       : 'bg-red-100 text-red-700'
                   }`}>
                     {profile.employmentStatus ? profile.employmentStatus.charAt(0).toUpperCase() + profile.employmentStatus.slice(1) : 'Active'}
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
