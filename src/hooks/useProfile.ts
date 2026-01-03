'use client';

import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useProfile(employeeId?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileApi.getProfile(employeeId);
      // API returns everything nested under profile
      setProfile(data.profile);
      setEmergencyContacts(data.profile?.emergencyContacts || []);
      setEducation(data.profile?.education || []);
      setWorkExperience(data.profile?.workExperience || []);
      setSkills(data.profile?.skills || []);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [employeeId]);

  const updateProfile = async (updateData: any) => {
    try {
      const data = await profileApi.updateProfile(updateData, employeeId);
      toast.success(data.message);
      await fetchProfile(); // Refresh data
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  return {
    profile,
    emergencyContacts,
    education,
    workExperience,
    skills,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}

