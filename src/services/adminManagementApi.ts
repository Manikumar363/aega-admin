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
  const base = (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || '';
  return base.replace(/\/$/, '');
};

const buildUrl = (path: string) => {
  const base = getApiBaseUrl();
  if (import.meta.env.DEV) {
    return path;
  }

  return `${base}${path}`;
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

  if (!Array.isArray(data)) {
    return [] as T;
  }

  return data;
};

export const fetchAdminAgents = async () => fetchAdminJson<AdminAgentRecord[]>('/api/admin/agent-management');

export const fetchAdminCompanies = async () => fetchAdminJson<AdminCompanyRecord[]>('/api/admin/companies');

export const fetchAdminStudents = async () => fetchAdminJson<AdminStudentRecord[]>('/api/admin/students');