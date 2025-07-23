import { Timestamp } from "firebase/firestore";

export type OpportunityType = 'MUN' | 'Internship' | 'Volunteering' | 'Competition' | 'Summer Camp' | 'Hackathon' | 'Workshop';
export type OpportunityAudience = 'All Nationalities' | 'Emiratis Only';
export type OpportunityFormat = 'Online' | 'Offline';
export type OpportunityPrice = 'Free' | 'Paid';
export type OpportunityStatus = 'pending' | 'approved' | 'rejected';
export type Emirate = "All Emirates" | "Abu Dhabi" | "Ajman" | "Dubai" | "Fujairah" | "Ras Al Khaimah" | "Sharjah" | "Umm Al Quwain";


export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  description: string;
  summary?: string;
  subject: string;
  grades: number[];
  price: OpportunityPrice;
  audience: OpportunityAudience;
  format: OpportunityFormat;
  deadline: Timestamp;
  emirate: Emirate;
  registrationLink?: string;
  detailsLink?: string;
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
