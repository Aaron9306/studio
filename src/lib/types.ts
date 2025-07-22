import { Timestamp } from "firebase/firestore";

export type OpportunityType = 'MUN' | 'Internship' | 'Volunteering' | 'Competition' | 'Summer Camp' | 'Hackathon';
export type OpportunityAudience = 'All Nationalities' | 'Emiratis Only';
export type OpportunityFormat = 'Online' | 'Offline';
export type OpportunityPrice = 'Free' | 'Paid';
export type OpportunityStatus = 'pending' | 'approved' | 'rejected';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  description: string;
  subject: string;
  ageRange: [number, number];
  price: OpportunityPrice;
  audience: OpportunityAudience;
  format: OpportunityFormat;
  deadline: Timestamp;
  registrationLink?: string;
  imageUrl?: string;
  status: OpportunityStatus;
  submittedBy: string; // user id
  createdAt: Timestamp;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  bookmarkedOpportunities: string[]; // array of opportunity ids
}
