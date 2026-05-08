export type Student = {
  id: number;
  apiId?: string;
  name: string;
  program: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: 'blue' | 'orange' | 'red';
  online: boolean;
};

export const sampleStudents: Student[] = [
  {
    id: 1,
    name: 'Ava Johnson',
    program: 'MBA',
    mobile: '+91 98765 43210',
    email: 'ava.johnson@example.com',
    location: 'Hyderabad',
    avatar: '/avatar.jpg',
    verified: 'blue',
    online: true,
  },
  {
    id: 2,
    name: 'Liam Patel',
    program: 'BBA',
    mobile: '+91 98111 22334',
    email: 'liam.patel@example.com',
    location: 'Bangalore',
    avatar: '/avatar.jpg',
    verified: 'orange',
    online: true,
  },
  {
    id: 3,
    name: 'Mia Chen',
    program: 'Data Science',
    mobile: '+91 99001 11223',
    email: 'mia.chen@example.com',
    location: 'Delhi',
    avatar: '/avatar.jpg',
    verified: 'blue',
    online: false,
  },
  {
    id: 4,
    name: 'Noah Williams',
    program: 'Computer Science',
    mobile: '+91 97654 32109',
    email: 'noah.williams@example.com',
    location: 'Chennai',
    avatar: '/avatar.jpg',
    verified: 'orange',
    online: true,
  },
  {
    id: 5,
    name: 'Sophia Khan',
    program: 'Mechanical Engineering',
    mobile: '+91 98989 12121',
    email: 'sophia.khan@example.com',
    location: 'Pune',
    avatar: '/avatar.jpg',
    verified: 'blue',
    online: true,
  },
  {
    id: 6,
    name: 'Ethan Brown',
    program: 'Psychology',
    mobile: '+91 99887 66554',
    email: 'ethan.brown@example.com',
    location: 'Mumbai',
    avatar: '/avatar.jpg',
    verified: 'blue',
    online: false,
  },
  {
    id: 7,
    name: 'Olivia Garcia',
    program: 'Law',
    mobile: '+91 90909 45454',
    email: 'olivia.garcia@example.com',
    location: 'Ahmedabad',
    avatar: '/avatar.jpg',
    verified: 'orange',
    online: true,
  },
  {
    id: 8,
    name: 'James Wilson',
    program: 'Finance',
    mobile: '+91 93456 77889',
    email: 'james.wilson@example.com',
    location: 'Kochi',
    avatar: '/avatar.jpg',
    verified: 'blue',
    online: true,
  },
  {
    id: 9,
    name: 'Isabella Moore',
    program: 'Architecture',
    mobile: '+91 94444 55566',
    email: 'isabella.moore@example.com',
    location: 'Noida',
    avatar: '/avatar.jpg',
    verified: 'blue',
    online: true,
  },
  {
    id: 10,
    name: 'Benjamin Taylor',
    program: 'Hospitality',
    mobile: '+91 97777 88899',
    email: 'benjamin.taylor@example.com',
    location: 'Jaipur',
    avatar: '/avatar.jpg',
    verified: 'orange',
    online: true,
  },
];
