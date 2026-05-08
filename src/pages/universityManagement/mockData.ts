export type University = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  location: string;
  shortCode: string;
  logoColor: string;
  verified: 'green' | 'yellow';
  online: boolean;
};

export const universities: University[] = [
  {
    id: 1,
    name: 'Loughborough University',
    mobile: '5506556340',
    email: 'uni@gmail.com',
    location: 'Loughborough',
    shortCode: 'LU',
    logoColor: '#5C2EA8',
    verified: 'green',
    online: true,
  },
  {
    id: 2,
    name: 'Kingston University',
    mobile: '9876543210',
    email: 'uni@gmail.com',
    location: 'London',
    shortCode: 'KU',
    logoColor: '#1F2937',
    verified: 'yellow',
    online: true,
  },
  {
    id: 3,
    name: 'City College London',
    mobile: '6543217890',
    email: 'uni@gmail.com',
    location: 'London',
    shortCode: 'CL',
    logoColor: '#D9363E',
    verified: 'green',
    online: false,
  },
  {
    id: 4,
    name: 'KAIST',
    mobile: '7890123456',
    email: 'uni@gmail.com',
    location: 'Daejeon',
    shortCode: 'KS',
    logoColor: '#0E7490',
    verified: 'yellow',
    online: false,
  },
  {
    id: 5,
    name: 'RMIT University',
    mobile: '1234567890',
    email: 'uni@gmail.com',
    location: 'Melbourne',
    shortCode: 'RM',
    logoColor: '#DC2626',
    verified: 'green',
    online: true,
  },
  {
    id: 6,
    name: 'UCD Dublin',
    mobile: '4567890123',
    email: 'uni@gmail.com',
    location: 'Dublin',
    shortCode: 'UC',
    logoColor: '#1D4ED8',
    verified: 'green',
    online: true,
  },
  {
    id: 7,
    name: 'TU Berlin',
    mobile: '9876504321',
    email: 'uni@gmail.com',
    location: 'Berlin',
    shortCode: 'TB',
    logoColor: '#BE123C',
    verified: 'green',
    online: true,
  },
  {
    id: 8,
    name: 'MIT',
    mobile: '2345678901',
    email: 'uni@gmail.com',
    location: 'Cambridge',
    shortCode: 'MI',
    logoColor: '#B91C1C',
    verified: 'green',
    online: true,
  },
  {
    id: 9,
    name: 'Carnegie Mellon University',
    mobile: '3456789012',
    email: 'uni@gmail.com',
    location: 'Pittsburgh',
    shortCode: 'CM',
    logoColor: '#B91C1C',
    verified: 'green',
    online: true,
  },
  {
    id: 10,
    name: 'UC Berkeley',
    mobile: '4567890123',
    email: 'uni@gmail.com',
    location: 'California',
    shortCode: 'UB',
    logoColor: '#0369A1',
    verified: 'yellow',
    online: true,
  },
];
