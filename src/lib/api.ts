// API Client Utility Functions
// All API calls go through these functions for consistency

const API_BASE = '/api';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

// Attendance APIs
export const attendanceApi = {
  checkIn: () => apiRequest<{ message: string; checkInTime: string }>('/attendance/checkin', { method: 'POST' }),
  
  checkOut: () => apiRequest<{ message: string; checkOutTime: string; totalHours: number }>('/attendance/checkout', { method: 'POST' }),
  
  getRecords: (params?: { employeeId?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    const query = queryParams.toString();
    return apiRequest<{ attendance: any[] }>(`/attendance${query ? `?${query}` : ''}`);
  },
  
  updateRecord: (attendanceId: string, data: { status?: string; checkInTime?: string; checkOutTime?: string; notes?: string }) =>
    apiRequest<{ message: string; attendance: any }>('/attendance', {
      method: 'PUT',
      body: JSON.stringify({ attendanceId, ...data }),
    }),
};

// Leave APIs
export const leaveApi = {
  getRecords: (params?: { employeeId?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.status) queryParams.append('status', params.status);
    const query = queryParams.toString();
    return apiRequest<{ leaves: any[] }>(`/leave${query ? `?${query}` : ''}`);
  },
  
  createRequest: (data: { leaveType: string; startDate: string; endDate: string; reason: string; attachment?: string }) =>
    apiRequest<{ message: string; leave: any }>('/leave', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  approveReject: (leaveId: string, status: 'approved' | 'rejected', rejectionReason?: string) =>
    apiRequest<{ message: string; leave: any }>(`/leave/${leaveId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason }),
    }),
  
  cancelRequest: (leaveId: string) =>
    apiRequest<{ message: string }>(`/leave/${leaveId}`, {
      method: 'DELETE',
    }),
  
  getBalance: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ leaveBalance: any }>(`/leave/balance${query}`);
  },
};

// Salary APIs
export const salaryApi = {
  getSalary: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ salary: any }>(`/salary${query}`);
  },
  
  updateSalary: (data: {
    employeeId: string;
    basicSalary: number;
    hra?: number;
    allowances?: number;
    deductions?: number;
    salaryType?: string;
    bankAccountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    effectiveFrom?: string;
  }) =>
    apiRequest<{ message: string; salary: any }>('/salary', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Payroll APIs
export const payrollApi = {
  getRecords: (params?: { employeeId?: string; month?: number; year?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.year) queryParams.append('year', params.year.toString());
    const query = queryParams.toString();
    return apiRequest<{ payrollRecords: any[] }>(`/payroll${query ? `?${query}` : ''}`);
  },
  
  processPayroll: (data: { employeeId: string; month: number; year: number; deductions?: number }) =>
    apiRequest<{ message: string; payrollRecord: any }>('/payroll', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Profile APIs
export const profileApi = {
  getProfile: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ profile: any; emergencyContacts: any[]; education: any[]; workExperience: any[]; skills: any[] }>(`/profile${query}`);
  },
  
  updateProfile: (data: any, employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ message: string; profile: any }>(`/profile${query}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Emergency Contacts
  getEmergencyContacts: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ contacts: any[] }>(`/profile/emergency-contact${query}`);
  },
  
  addEmergencyContact: (data: { name: string; relationship: string; phoneNumber: string; email?: string; address?: string; isPrimary?: boolean }) =>
    apiRequest<{ message: string; contact: any }>('/profile/emergency-contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Education
  getEducation: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ education: any[] }>(`/profile/education${query}`);
  },
  
  addEducation: (data: { degree: string; institution: string; fieldOfStudy?: string; startDate?: string; endDate?: string; grade?: string; certificateUrl?: string }) =>
    apiRequest<{ message: string; education: any }>('/profile/education', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Work Experience
  getWorkExperience: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ workExperience: any[] }>(`/profile/work-experience${query}`);
  },
  
  addWorkExperience: (data: { companyName: string; jobTitle: string; startDate: string; endDate?: string; isCurrentJob?: boolean; description?: string; location?: string; achievements?: string }) =>
    apiRequest<{ message: string; workExperience: any }>('/profile/work-experience', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Skills
  getSkills: (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return apiRequest<{ skills: any[] }>(`/profile/skills${query}`);
  },
  
  addSkill: (data: { skillName: string; proficiency?: string; category?: string }) =>
    apiRequest<{ message: string; skill: any }>('/profile/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  removeSkill: (skillId: string) =>
    apiRequest<{ message: string }>(`/profile/skills?skillId=${skillId}`, {
      method: 'DELETE',
    }),
};

// Documents APIs
export const documentsApi = {
  getDocuments: (params?: { employeeId?: string; documentType?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.documentType) queryParams.append('documentType', params.documentType);
    const query = queryParams.toString();
    return apiRequest<{ documents: any[] }>(`/documents${query ? `?${query}` : ''}`);
  },
  
  uploadDocument: (data: { employeeId?: string; documentType: string; fileName: string; fileUrl: string; fileSize?: number }) =>
    apiRequest<{ message: string; document: any }>('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  deleteDocument: (documentId: string) =>
    apiRequest<{ message: string }>(`/documents/${documentId}`, {
      method: 'DELETE',
    }),
};

