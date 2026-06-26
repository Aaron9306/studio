import { User, Opportunity } from './types';



export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ahmed Al Mulla',
    email: 'student@test.com',
    role: 'student',
    bookmarkedOpportunities: ['opp-1', 'opp-3'],
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
    bookmarkedOpportunities: [],
  },
];


export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'AI Hackathon Challenge 2024',
    type: 'Hackathon',
    description: 'Join the brightest minds to solve real-world problems using AI. A 48-hour event with mentors from leading tech companies. Prizes for the top 3 teams.',
    subject: 'Technology',
    ageRange: [16, 22],
    price: 'Free',
    audience: 'All Nationalities',
    format: 'Offline',
    deadline: '2024-10-15T00:00:00Z', 
    emirate: 'Dubai',
    status: 'approved',
    submittedBy: 'admin-1',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'opp-2',
    title: 'Emirates Literature Festival Volunteer',
    type: 'Volunteering',
    description: 'Be part of the iconic Emirates Literature Festival. Assist with event management, author signings, and guest services. A great opportunity for book lovers.',
    subject: 'Arts & Culture',
    ageRange: [15, 30],
    price: 'Free',
    audience: 'All Nationalities',
    format: 'Offline',
    deadline: '2024-09-30T00:00:00Z',
    emirate: 'Dubai',
    status: 'approved',
    submittedBy: 'admin-1',
    createdAt: '2024-07-02T00:00:00Z',
  },
];
