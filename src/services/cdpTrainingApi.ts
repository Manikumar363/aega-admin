type ApiHeaders = Record<string, string>;

export interface CDPCourse {
  _id?: string;
  id?: number;
  courseName: string;
  type: 'mandatory' | 'optional' | 'Standard' | 'Recommended';
  timeInHr: number;
  modules: number;
  hyperLink: string;
  description: string;
  coverPicture?: string;
  name?: string;
  for?: 'University' | 'Agents';
  time?: string;
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

export const fetchCDPCourses = async (): Promise<CDPCourse[]> => {
  const response = await fetch(buildUrl('/api/admin/cdp-courses'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch CDP courses');
  }

  const data = await response.json();
  return data.data || data || [];
};

export const getCDPCourseById = async (courseId: string): Promise<CDPCourse> => {
  const response = await fetch(buildUrl(`/api/admin/cdp-courses/${courseId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch course details');
  }

  const data = await response.json();
  return data.data || data;
};

export const createCDPCourse = async (courseData: Omit<CDPCourse, '_id' | 'id'>): Promise<CDPCourse> => {
  const response = await fetch(buildUrl('/api/admin/cdp-courses'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create course');
  }

  const data = await response.json();
  return data.data || data;
};

export const updateCDPCourse = async (courseId: string, courseData: Partial<CDPCourse>): Promise<CDPCourse> => {
  const response = await fetch(buildUrl(`/api/admin/cdp-courses/${courseId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update course');
  }

  const data = await response.json();
  return data.data || data;
};

export const deleteCDPCourse = async (courseId: string): Promise<void> => {
  const response = await fetch(buildUrl(`/api/admin/cdp-courses/${courseId}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete course');
  }
};
