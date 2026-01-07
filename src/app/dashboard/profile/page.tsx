'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Camera, 
  Save, 
  X,
  Pencil,
  Calendar,
  Globe,
  Users as UsersIcon,
  Upload
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      // Reset image state on load
      setImagePreview(null);
      setSelectedImageFile(null);
    }
  }, [profile]);

  // --- IMAGE HANDLING FUNCTIONS ---

  const handleImageClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Validate File Size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      // 2. Validate File Type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error("Only JPG, PNG, and WebP formats are allowed");
        return;
      }

      // 3. Create Preview
      setSelectedImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  // Helper to convert file to Base64 string for API storage
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // --------------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber.trim())) newErrors.phoneNumber = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
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
      let profilePictureData = profile?.profilePicture; // Keep existing if no change

      // If a new file was selected, convert to Base64
      if (selectedImageFile) {
        profilePictureData = await convertToBase64(selectedImageFile);
      }

      const updatePayload: any = {
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality.trim(),
        profilePicture: profilePictureData, // Add the image data here
      };

      await updateProfile(updatePayload);
      
      // Cleanup
      setIsEditing(false);
      setErrors({});
      if (imagePreview) URL.revokeObjectURL(imagePreview); // Memory cleanup
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset text fields
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
    // Reset image fields
    setErrors({});
    setImagePreview(null);
    setSelectedImageFile(null);
    setIsEditing(false);
  };

  if (loading) return <DashboardLayout><div className="flex justify-center py-12">Loading...</div></DashboardLayout>;
  if (!profile) return <DashboardLayout><div className="flex justify-center py-12 text-red-500">Failed to load profile</div></DashboardLayout>;

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User';
  // Logic: Show Preview -> Show Saved Profile Pic -> Show Default Avatar
  const displayImage = imagePreview || profile.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`;
  
  const managerName = profile.managerId 
    ? `${profile.managerId.firstName || ''} ${profile.managerId.lastName || ''}`.trim()
    : 'Not assigned';

  return (
    <DashboardLayout>
      <div className="max-w-5xl pb-10 mx-auto text-black">
        
        {/* Hidden File Input */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp"
        />

        {/* Header & Controls */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500">Manage your personal information and view job details.</p>
          </div>
          
          {isEditing ? (
            <div className="flex gap-3">
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-slate-700 border-slate-200 hover:bg-slate-50"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* LEFT COLUMN: Identity Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="relative p-6 overflow-hidden text-center bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              
              {/* Avatar Section */}
              <div className="relative inline-block mt-8 mb-4 group">
                <div className="relative w-32 h-32 mx-auto overflow-hidden bg-white border-4 border-white rounded-full shadow-md">
                    <img 
                    src={displayImage} 
                    alt="Profile" 
                    className="object-cover w-full h-full"
                    />
                    
                    {/* Hover Overlay for Editing */}
                    {isEditing && (
                        <div 
                            onClick={handleImageClick}
                            className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 cursor-pointer bg-black/40 group-hover:opacity-100"
                        >
                            <Upload className="w-8 h-8 text-white/80" />
                        </div>
                    )}
                </div>

                {isEditing && (
                  <button 
                    onClick={handleImageClick}
                    className="absolute z-10 p-2 text-white transition-colors rounded-full shadow-lg bottom-1 right-1 bg-slate-900 hover:bg-slate-700" 
                    title="Change Picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="mb-4 text-sm text-slate-500">{profile.designation || 'Employee'}</p>
              
              <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium border rounded-lg text-slate-600 bg-slate-50 border-slate-100">
                <span>Employee ID:</span>
                <span className="font-mono text-slate-900">{profile.loginId}</span>
              </div>

                {isEditing && (
                    <p className="mt-4 text-xs text-slate-400">
                        Allowed: JPG, PNG, WebP (Max 2MB)
                    </p>
                )}
            </div>
          </div>

          {/* RIGHT COLUMN: Details Form */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* 1. Personal Details Section */}
            <div className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200">
              <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-900">
                <User className="w-5 h-5 text-blue-600" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    disabled 
                    type="text" 
                    value={fullName}
                    className="w-full rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed px-4 py-2.5 border" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Email Address</label>
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

                {/* Phone Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
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
                          ? 'border-red-300 focus:ring-red-500' 
                          : isEditing ? 'bg-white focus:ring-blue-500' : 'bg-slate-50 cursor-not-allowed'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Date of Birth <span className="text-red-500">*</span>
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
                          ? 'border-red-300 focus:ring-red-500' 
                          : isEditing ? 'bg-white focus:ring-blue-500' : 'bg-slate-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Gender <span className="text-red-500">*</span>
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
                          ? 'border-red-300 focus:ring-red-500' 
                          : isEditing ? 'bg-white focus:ring-blue-500' : 'bg-slate-50 cursor-not-allowed'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="maritalStatus"
                    disabled={!isEditing}
                    value={formData.maritalStatus} 
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 ${
                      errors.maritalStatus 
                        ? 'border-red-300 focus:ring-red-500' 
                        : isEditing ? 'bg-white focus:ring-blue-500' : 'bg-slate-50 cursor-not-allowed'
                    }`}
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && <p className="mt-1 text-sm text-red-600">{errors.maritalStatus}</p>}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Nationality <span className="text-red-500">*</span>
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
                          ? 'border-red-300 focus:ring-red-500' 
                          : isEditing ? 'bg-white focus:ring-blue-500' : 'bg-slate-50 cursor-not-allowed'
                      }`}
                      placeholder="e.g., Indian"
                    />
                  </div>
                  {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Current Address <span className="text-red-500">*</span>
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
                          ? 'border-red-300 focus:ring-red-500' 
                          : isEditing ? 'bg-white focus:ring-blue-500' : 'bg-slate-50 cursor-not-allowed'
                      }`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* 2. Job Details Section (Read Only) */}
            <div className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200">
              <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-900">
                <Briefcase className="w-5 h-5 text-purple-600" /> Job Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs font-medium tracking-wider uppercase text-slate-400">Department</label>
                  <div className="font-medium text-slate-900">{profile.department || 'Not assigned'}</div>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium tracking-wider uppercase text-slate-400">Manager</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-purple-600 bg-purple-100 rounded-full">
                      {managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-900">{managerName}</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium tracking-wider uppercase text-slate-400">Date of Joining</label>
                  <div className="font-medium text-slate-900">
                    {profile.dateOfJoining 
                      ? new Date(profile.dateOfJoining).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'Not available'}
                  </div>
                </div>
                <div>
                   <label className="block mb-1 text-xs font-medium tracking-wider uppercase text-slate-400">Employment Status</label>
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