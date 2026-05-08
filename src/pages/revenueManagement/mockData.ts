export type RevenueRow = {
  id: number;
  organizationName: string;
  type: 'University' | 'Agency';
  date: string;
  amount: string;
};

export const sampleRevenueRows: RevenueRow[] = [
  { id: 1, organizationName: 'Loughborough University', type: 'University', date: '01/09/2026', amount: '$500' },
  { id: 2, organizationName: 'Kingston University', type: 'University', date: '13/09/2026', amount: '$500' },
  { id: 3, organizationName: 'City College London', type: 'University', date: '15/09/2026', amount: '$500' },
  { id: 4, organizationName: 'KAIST', type: 'University', date: '12/09/2026', amount: '$500' },
  { id: 5, organizationName: 'RMIT University', type: 'University', date: '06/09/2026', amount: '$500' },
  { id: 6, organizationName: 'ABC Company', type: 'Agency', date: '07/11/2025', amount: '$750' },
  { id: 7, organizationName: 'ABC Company', type: 'Agency', date: '12/05/2023', amount: '$300' },
  { id: 8, organizationName: 'ABC Company', type: 'Agency', date: '15/08/2024', amount: '$600' },
  { id: 9, organizationName: 'ABC Company', type: 'Agency', date: '20/02/2025', amount: '$400' },
  { id: 10, organizationName: 'ABC Company', type: 'Agency', date: '20/02/2025', amount: '$400' },
  { id: 11, organizationName: 'Glasgow International College', type: 'University', date: '02/10/2026', amount: '$550' },
  { id: 12, organizationName: 'Horizon Partners', type: 'Agency', date: '19/04/2025', amount: '$650' },
];
