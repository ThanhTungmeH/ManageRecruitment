import { Candidate, Interview, DashboardStats } from '../types';


export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Nguyen Van An',
    email: 'an.nguyen@email.com',
    phone: '+84 901 234 567',
    position: 'Senior Frontend Developer',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    education: 'Computer Science - HCMUS',
    location: 'Ho Chi Minh City',
    aiScore: 92,
    status: 'interview',
    appliedDate: new Date('2024-01-16'),
    notes: ['Strong technical skills', 'Great communication'],
    source: 'LinkedIn'
  },
  {
    id: '2',
    name: 'Tran Thi Binh',
    email: 'binh.tran@email.com',
    phone: '+84 902 345 678',
    position: 'UX/UI Designer',
    experience: 3,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    education: 'Design - FTU',
    location: 'Ha Noi',
    aiScore: 88,
    status: 'screening',
    appliedDate: new Date('2024-01-17'),
    notes: ['Creative portfolio', 'Good design thinking'],
    source: 'Company Website'
  },
  {
    id: '3',
    name: 'Le Minh Duc',
    email: 'duc.le@email.com',
    phone: '+84 903 456 789',
    position: 'Product Manager',
    experience: 6,
    skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
    education: 'MBA - VNU',
    location: 'Ho Chi Minh City',
    aiScore: 95,
    status: 'offer',
    appliedDate: new Date('2024-01-14'),
    notes: ['Excellent leadership experience', 'Strong analytical skills'],
    source: 'Referral'
  },
  {
    id: '4',
    name: 'Pham Thu Hang',
    email: 'hang.pham@email.com',
    phone: '+84 904 567 890',
    position: 'Data Scientist',
    experience: 4,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    education: 'Data Science - HUST',
    location: 'Ha Noi',
    aiScore: 85,
    status: 'new',
    appliedDate: new Date('2024-01-18'),
    notes: ['Strong ML background'],
    source: 'Job Board'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateId: '1',
    candidateName: 'Nguyen Van An',
    position: 'Senior Frontend Developer',
    date: new Date('2024-01-20T10:00:00'),
    interviewer: 'John Smith',
    type: 'video',
    status: 'scheduled'
  },
  {
    id: '2',
    candidateId: '2',
    candidateName: 'Tran Thi Binh',
    position: 'UX/UI Designer',
    date: new Date('2024-01-21T14:00:00'),
    interviewer: 'Jane Doe',
    type: 'onsite',
    status: 'scheduled'
  }
];

export const mockStats: DashboardStats = {
  totalJobs: 12,
  activeJobs: 8,
  totalCandidates: 156,
  newApplications: 23,
  interviewsToday: 3,
  hiredThisMonth: 5,
  averageTimeToHire: 18,
  topSkills: [
    { skill: 'React', count: 45 },
    { skill: 'JavaScript', count: 42 },
    { skill: 'Python', count: 38 },
    { skill: 'TypeScript', count: 35 },
    { skill: 'Node.js', count: 32 }
  ]
};