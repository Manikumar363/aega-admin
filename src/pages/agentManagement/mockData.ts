export type AuthorizationKey =
  | 'addAgent'
  | 'editAgent'
  | 'assignUni'
  | 'addOffice'
  | 'editOffice'
  | 'removeOffice'
  | 'assignRegion'
  | 'assignCourse'
  | 'removeAgent';

export type EditableAgent = {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  authorization?: Partial<Record<AuthorizationKey, boolean>>;
};

export type Agent = {
  id: number;
  apiId: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: 'blue' | 'orange' | 'red';
  online: boolean;
  source: EditableAgent;
};

const verifiedColors: Record<string, 'blue' | 'orange' | 'red'> = {
  blue: 'blue',
  orange: 'orange',
  red: 'red',
};

const sampleEditableAgents: EditableAgent[] = [
  {
    id: 'agt-1',
    firstName: 'Amit',
    lastName: 'Sharma',
    emailId: 'amit@aega.com',
    mobileNumber: '+91 98765 43210',
    designation: 'Managing Director',
    office: 'Hyderabad',
    country: 'India',
    authorization: { addAgent: true, editAgent: true, assignUni: true },
  },
  {
    id: 'agt-2',
    firstName: 'Nina',
    lastName: 'Patel',
    emailId: 'nina@aega.com',
    mobileNumber: '+91 98111 22334',
    designation: 'Chief Operating Officer',
    office: 'Bangalore',
    country: 'India',
    authorization: { addAgent: true, editAgent: true, addOffice: true },
  },
  {
    id: 'agt-3',
    firstName: 'Rahul',
    lastName: 'Verma',
    emailId: 'rahul@aega.com',
    mobileNumber: '+91 99001 11223',
    designation: 'Counselor',
    office: 'Noida',
    country: 'India',
    authorization: { assignRegion: true, assignCourse: true },
  },
  {
    id: 'agt-4',
    firstName: 'Sara',
    lastName: 'Ali',
    emailId: 'sara@aega.com',
    mobileNumber: '+91 97654 32109',
    designation: 'Managing Director',
    office: 'Delhi',
    country: 'India',
    authorization: { editOffice: true, removeOffice: true },
  },
  {
    id: 'agt-5',
    firstName: 'Daniel',
    lastName: 'Khan',
    emailId: 'daniel@aega.com',
    mobileNumber: '+91 98989 12121',
    designation: 'Counselor',
    office: 'Chennai',
    country: 'India',
    authorization: { removeAgent: true },
  },
  {
    id: 'agt-6',
    firstName: 'Priya',
    lastName: 'Rao',
    emailId: 'priya@aega.com',
    mobileNumber: '+91 99887 66554',
    designation: 'Chief Operating Officer',
    office: 'Pune',
    country: 'India',
    authorization: { addAgent: true, assignRegion: true },
  },
  {
    id: 'agt-7',
    firstName: 'Mohammed',
    lastName: 'Irfan',
    emailId: 'irfan@aega.com',
    mobileNumber: '+91 90909 45454',
    designation: 'Managing Director',
    office: 'Mumbai',
    country: 'India',
    authorization: { addAgent: true, editOffice: true, assignCourse: true },
  },
  {
    id: 'agt-8',
    firstName: 'Leah',
    lastName: 'Martin',
    emailId: 'leah@aega.com',
    mobileNumber: '+44 7711 223344',
    designation: 'Counselor',
    office: 'London',
    country: 'UK',
    authorization: { addAgent: true, editAgent: true },
  },
];

export const sampleAgents: Agent[] = sampleEditableAgents.map((agent, index) => ({
  id: index + 1,
  apiId: agent.id,
  name: `${agent.firstName} ${agent.lastName}`.trim(),
  designation: agent.designation,
  mobile: agent.mobileNumber,
  email: agent.emailId,
  location: agent.office,
  avatar: '/avatar.jpg',
  verified: verifiedColors[index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'orange' : 'red'],
  online: index % 2 === 0,
  source: agent,
}));
