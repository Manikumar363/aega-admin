export type CompanyRow = {
  id: number;
  apiId?: string;
  name: string;
  owner: string;
  mobile: string;
  email: string;
  region: string;
  initials: string;
};

const makeInitials = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return 'CMP';

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 4).toUpperCase();

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const SAMPLE_COMPANIES: CompanyRow[] = [
  { id: 1, name: 'Aega Global Education', owner: 'Ravi Kumar', mobile: '+91 98765 43210', email: 'ravi@aega.com', region: 'Hyderabad', initials: makeInitials('Aega Global Education') },
  { id: 2, name: 'Nova Overseas Solutions', owner: 'Anita Sharma', mobile: '+91 98111 22334', email: 'anita@novaoverseas.com', region: 'Bangalore', initials: makeInitials('Nova Overseas Solutions') },
  { id: 3, name: 'Bright Future Consultants', owner: 'Mohammed Khan', mobile: '+91 99001 11223', email: 'mohammed@brightfuture.com', region: 'Delhi', initials: makeInitials('Bright Future Consultants') },
  { id: 4, name: 'EduWorld Partners', owner: 'Priya Reddy', mobile: '+91 97654 32109', email: 'priya@eduworld.com', region: 'Chennai', initials: makeInitials('EduWorld Partners') },
  { id: 5, name: 'Global Reach Advisers', owner: 'Suresh Babu', mobile: '+91 98989 12121', email: 'suresh@globalreach.com', region: 'Pune', initials: makeInitials('Global Reach Advisers') },
  { id: 6, name: 'Study Bridge International', owner: 'Neha Verma', mobile: '+91 99887 66554', email: 'neha@studybridge.com', region: 'Mumbai', initials: makeInitials('Study Bridge International') },
  { id: 7, name: 'Campus Connect LLP', owner: 'Arjun Patel', mobile: '+91 90909 45454', email: 'arjun@campusconnect.com', region: 'Ahmedabad', initials: makeInitials('Campus Connect LLP') },
  { id: 8, name: 'Prime Pathways', owner: 'Kavitha Rao', mobile: '+91 93456 77889', email: 'kavitha@primepathways.com', region: 'Kochi', initials: makeInitials('Prime Pathways') },
  { id: 9, name: 'Vista Scholars', owner: 'Imran Ali', mobile: '+91 94444 55566', email: 'imran@vistascholars.com', region: 'Noida', initials: makeInitials('Vista Scholars') },
  { id: 10, name: 'Zenith Admissions', owner: 'Sara Joseph', mobile: '+91 97777 88899', email: 'sara@zenithadmissions.com', region: 'Hyderabad', initials: makeInitials('Zenith Admissions') },
  { id: 11, name: 'FutureGate Education', owner: 'Rahul Singh', mobile: '+91 96666 12121', email: 'rahul@futuregate.com', region: 'Jaipur', initials: makeInitials('FutureGate Education') },
  { id: 12, name: 'Meridian Study Hub', owner: 'Pooja Nair', mobile: '+91 95555 34343', email: 'pooja@meridianhub.com', region: 'Bangalore', initials: makeInitials('Meridian Study Hub') },
];
