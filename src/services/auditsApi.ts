type ApiHeaders = Record<string, string>;

export interface AuditCriterion {
  _id?: string;
  criterion: string;
  evidence: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface AuditCategory {
  _id?: string;
  name: string;
  description: string;
  target: 'agent' | 'university';
  criteria?: AuditCriterion[];
  createdBy?: string | { _id: string; name: string; email: string; role: string };
  createdAt?: string;
  updatedAt?: string;
}

const getApiBaseUrl = () => {
  const base = (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || 'http://localhost:3000';
  return base.replace(/\/$/, '');
};

const buildUrl = (path: string) => {
  const base = getApiBaseUrl();
  if (base) {
    return `${base}${path}`;
  }
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

export const fetchAuditCategories = async (target?: 'agent' | 'university'): Promise<AuditCategory[]> => {
  const url = buildUrl(target ? `/api/admin/audits?target=${target}` : '/api/admin/audits');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch audit categories');
  }

  const data = await response.json();
  return data.data || data || [];
};

export const getAuditCategoryById = async (auditId: string): Promise<AuditCategory> => {
  const response = await fetch(buildUrl(`/api/admin/audits/${auditId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch audit category details');
  }

  const data = await response.json();
  return data.data || data;
};

export const createAuditCategory = async (auditData: Omit<AuditCategory, '_id'>): Promise<AuditCategory> => {
  const response = await fetch(buildUrl('/api/admin/audits'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(auditData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create audit category');
  }

  const data = await response.json();
  return data.data || data;
};

export const updateAuditCategory = async (auditId: string, auditData: Partial<AuditCategory>): Promise<AuditCategory> => {
  const response = await fetch(buildUrl(`/api/admin/audits/${auditId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(auditData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update audit category');
  }

  const data = await response.json();
  return data.data || data;
};

export const deleteAuditCategory = async (auditId: string): Promise<void> => {
  const response = await fetch(buildUrl(`/api/admin/audits/${auditId}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete audit category');
  }
};

export const addAuditCriterion = async (
  auditId: string,
  criterionData: { criterion: string; evidence: string }
): Promise<AuditCriterion> => {
  const response = await fetch(buildUrl(`/api/admin/audits/${auditId}/criteria`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(criterionData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to add audit criterion');
  }

  const data = await response.json();
  return data.data || data;
};

export const updateAuditCriterion = async (
  auditId: string,
  criterionId: string,
  criterionData: { criterion: string; evidence: string }
): Promise<AuditCriterion> => {
  const response = await fetch(buildUrl(`/api/admin/audits/${auditId}/criteria/${criterionId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(criterionData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update audit criterion');
  }

  const data = await response.json();
  return data.data || data;
};

export const deleteAuditCriterion = async (auditId: string, criterionId: string): Promise<void> => {
  const response = await fetch(buildUrl(`/api/admin/audits/${auditId}/criteria/${criterionId}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete audit criterion');
  }
};

export interface AuditAnswer {
  criterionId: string;
  status: 'compliant' | 'non-compliant';
  severity: 'low' | 'medium' | 'high';
  comment?: string;
}

export interface AuditCheckSubmission {
  targetType: 'agent' | 'company' | 'university';
  targetId: string;
  categoryId: string;
  answers: AuditAnswer[];
}

export interface AuditCheck {
  _id: string;
  targetType: 'agent' | 'company' | 'university';
  targetId: string;
  categoryId: string;
  categoryName: string;
  answers: Array<{
    criterionId: string;
    criterion: string;
    evidence: string;
    severity: 'low' | 'medium' | 'high';
    status: 'compliant' | 'non-compliant';
    comment?: string;
  }>;
  complianceScore: number;
  auditedBy: string | { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface AuditCheckSummary {
  complianceScore: number;
  numberOfAudits: number;
  activeAlerts: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const submitAuditCheck = async (checkData: AuditCheckSubmission): Promise<AuditCheck> => {
  const response = await fetch(buildUrl('/api/admin/audits/checks/submit'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(checkData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit audit check');
  }

  const data = await response.json();
  return data.data || data;
};

export const fetchAuditChecks = async (targetType: string, targetId: string): Promise<AuditCheck[]> => {
  const response = await fetch(buildUrl(`/api/admin/audits/checks/list?targetType=${targetType}&targetId=${targetId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch audit checks');
  }

  const data = await response.json();
  return data.data || data || [];
};

export const fetchAuditCheckSummary = async (targetType: string, targetId: string): Promise<AuditCheckSummary> => {
  const response = await fetch(buildUrl(`/api/admin/audits/checks/summary?targetType=${targetType}&targetId=${targetId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch audit check summary');
  }

  const data = await response.json();
  return data.data || data;
};

// --- COMPLIANCES & COMPLAINTS ENHANCEMENTS ---

export interface ComplianceSummary {
  overallScore: number;
  activeIssues: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ComplianceStatusItem {
  id: number;
  categoryId: string;
  name: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
}

export interface TargetComplaint {
  _id: string;
  targetType?: string;
  targetId?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  countryOfResidence: string;
  agentNameOrCompany: string;
  typeOfComplaint: string;
  description: string;
  status: 'submitted' | 'in-review' | 'resolved' | 'rejected';
  replyMessage?: string;
  createdAt: string;
}

export const fetchComplianceSummary = async (targetType: string, targetId: string): Promise<ComplianceSummary> => {
  const response = await fetch(buildUrl(`/api/admin/audits/compliances/summary?targetType=${targetType}&targetId=${targetId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch compliance summary');
  }

  const data = await response.json();
  return data.data || data;
};

export const fetchComplianceStatus = async (targetType: string, targetId: string): Promise<ComplianceStatusItem[]> => {
  const response = await fetch(buildUrl(`/api/admin/audits/compliances/status?targetType=${targetType}&targetId=${targetId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch compliance status list');
  }

  const data = await response.json();
  return data.data || data || [];
};

export const fetchTargetComplaints = async (targetType: string, targetId: string): Promise<TargetComplaint[]> => {
  const response = await fetch(buildUrl(`/api/complaints/admin/target?targetType=${targetType}&targetId=${targetId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch complaints raised against this target');
  }

  return response.json();
};

export const raiseTargetComplaint = async (complaintData: {
  targetType: string;
  targetId: string;
  typeOfComplaint: string;
  description: string;
}): Promise<TargetComplaint> => {
  const response = await fetch(buildUrl('/api/complaints/admin/raise'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(complaintData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to raise complaint');
  }

  const data = await response.json();
  return data.data || data;
};
