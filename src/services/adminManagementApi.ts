type ApiHeaders = Record<string, string>;

export interface AdminAgentRecord {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  authorization: Partial<Record<string, boolean>>;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface AdminCompanyRecord {
  _id: string;
  companyName: string;
  founderName: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  companyDocument1?: string;
  companyDocument2?: string;
  agentId?: string;
  createdAt: string;
  __v: number;
  performanceMatrix?: Record<string, unknown>;
}

export interface AdminStudentRecord {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  tenthInformation: unknown[];
  twelfthInformation: unknown[];
  graduationInformation: Array<{
    schoolOrCollege: string;
    boardOrUniversity: string;
    streamOrSpecialization: string;
    cgpaOrPercentage: string;
    yearOfPassing: string;
  }>;
  postGraduationInformation: unknown[];
  employmentInformation: unknown[];
  preferredRegionAndCollege: Array<{ region?: string; collegeName?: string }>;
  agentId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    businessType?: string;
  };
  universitiesPreferences: Array<{
    universityName: string;
    courseName: string;
    region: string;
    country: string;
    location: string;
    eligibilityStatus: string;
    applicationStatus: string;
    intakeDate: string;
    startDate: string;
    endDate: string;
    tuitionFee: string;
    firstTermFee: string;
    logoUrl: string;
    universityEmail: string;
    createdAt?: string;
    updatedAt?: string;
    _id: string;
  }>;
  createdAt: string;
  __v: number;
}

const getApiBaseUrl = () => {
  const base = (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || 'http://localhost:3000';
  return base.replace(/\/$/, '');
};

const buildUrl = (path: string) => {
  const base = getApiBaseUrl();
  // Always use the base URL if it's configured, regardless of dev/production mode
  if (base) {
    return `${base}${path}`;
  }

  // Fall back to relative paths only if no base URL is configured
  return path;
};

const getAuthHeaders = (): ApiHeaders => {
  const headers: ApiHeaders = {};
  const token = localStorage.getItem('refresh_token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const fetchAdminJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = (await response.json().catch(() => null)) as T | { message?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && !Array.isArray(data) && 'message' in data
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || 'Failed to load records');
  }

  if (Array.isArray(data)) {
    return data as T;
  }

  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data?: unknown[] }).data)) {
    return (data as { data: T }).data;
  }

  return [] as T;
};

export const fetchAdminAgents = async () => fetchAdminJson<AdminAgentRecord[]>('/api/admin/agent-management');

export const fetchAdminCompanies = async () => fetchAdminJson<AdminCompanyRecord[]>('/api/admin/companies');

export const fetchAdminStudents = async () => fetchAdminJson<AdminStudentRecord[]>('/api/admin/students');

export const fetchAdminStudentById = async (studentId: string): Promise<AdminStudentRecord> => {
  const response = await fetch(buildUrl(`/api/admin/students/${studentId}`), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch student details');
  }

  const data = await response.json();
  return data.data || data;
};

// Fetch universities list
export const fetchAdminUniversities = async () => fetchAdminJson<unknown[]>('/api/admin/universities');

// Accept university
export const acceptUniversity = async (universityId: string, notes?: string) => {
  const response = await fetch(buildUrl(`/api/admin/universities/${universityId}/accept`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      notes: notes || 'University has been verified and approved',
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || 'Failed to accept university');
  }

  return data;
};

// Reject university
export const rejectUniversity = async (universityId: string, reason: string, notes?: string) => {
  const response = await fetch(buildUrl(`/api/admin/universities/${universityId}/reject`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      reason,
      notes: notes || '',
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || 'Failed to reject university');
  }

  return data;
};

// Update university
export const updateUniversity = async (universityId: string, updates: Record<string, unknown>) => {
  const response = await fetch(buildUrl(`/api/admin/universities/${universityId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || 'Failed to update university');
  }

  return data;
};

// Delete university
export const deleteUniversity = async (universityId: string) => {
  const response = await fetch(buildUrl(`/api/admin/universities/${universityId}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || 'Failed to delete university');
  }

  return data;
};