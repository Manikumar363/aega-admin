export interface ComplaintRecord {
  replyMessage: string | null;
  repliedBy: string | null;
  repliedAt: string | null;
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  countryOfResidence: string;
  agentNameOrCompany: string;
  aegaReferenceNumber: string;
  typeOfComplaint: string;
  description: string;
  evidenceFiles: Array<{
    fileUrl: string;
    fileName: string;
  }>;
  acceptedDeclaration: boolean;
  status: string;
  createdAt: string;
  __v: number;
}

export interface EnquiryRecord {
  id: string;
  referenceNumber: string;
  name: string;
  mobileNumber: string;
  email: string;
  subject: string;
  message: string;
  countryOfResidence: string;
  agentNameOrCompany: string;
  status: string;
  createdAt: string;
  replyMessage: string | null;
  repliedBy: string | null;
  repliedAt: string | null;
  evidenceFiles: ComplaintRecord['evidenceFiles'];
}

export interface ComplaintReplyResponse {
  message: string;
  complaint: ComplaintRecord;
  email?: {
    sent: boolean;
    error?: string;
  };
}

const getApiBaseUrl = () => {
  const base = (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || '';
  return base.replace(/\/$/, '');
};

const getComplaintUrl = () => {
  const base = getApiBaseUrl();
  return import.meta.env.DEV ? '/api/complaints/admin' : `${base}/api/complaints/admin`;
};

const getAuthHeaders = () => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('refresh_token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const mapComplaintToEnquiry = (complaint: ComplaintRecord): EnquiryRecord => ({
  id: complaint._id,
  referenceNumber: complaint.aegaReferenceNumber,
  name: `${complaint.firstName} ${complaint.lastName}`.trim(),
  mobileNumber: complaint.phoneNumber,
  email: complaint.emailAddress,
  subject: complaint.typeOfComplaint,
  message: complaint.description,
  countryOfResidence: complaint.countryOfResidence,
  agentNameOrCompany: complaint.agentNameOrCompany,
  status: complaint.status,
  createdAt: complaint.createdAt,
  replyMessage: complaint.replyMessage,
  repliedBy: complaint.repliedBy,
  repliedAt: complaint.repliedAt,
  evidenceFiles: complaint.evidenceFiles,
});

export const fetchAdminComplaints = async (): Promise<EnquiryRecord[]> => {
  const response = await fetch(getComplaintUrl(), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = (await response.json().catch(() => null)) as ComplaintRecord[] | { message?: string } | null;

  if (!response.ok) {
    const message = data && !Array.isArray(data) ? data.message : 'Failed to load enquiries';
    throw new Error(message || 'Failed to load enquiries');
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(mapComplaintToEnquiry);
};

export const replyToAdminComplaint = async (complaintId: string, replyMessage: string): Promise<ComplaintReplyResponse> => {
  const response = await fetch(`${getComplaintUrl()}/${complaintId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ replyMessage }),
  });

  const data = (await response.json().catch(() => null)) as ComplaintReplyResponse | { message?: string } | null;

  if (!response.ok) {
    const message = data && !Array.isArray(data) ? data.message : 'Failed to send reply';
    throw new Error(message || 'Failed to send reply');
  }

  if (!data || Array.isArray(data) || !('complaint' in data)) {
    throw new Error('Invalid reply response from server');
  }

  return data;
};