

export type OpportunityType = 'MUN' | 'Internship' | 'Volunteering' | 'Competition' | 'Bootcamp' | 'Hackathon' | 'Workshop';
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
  grades: string[];
  price: OpportunityPrice;
  audience: OpportunityAudience;
  format: OpportunityFormat;
  deadline: string; 
  emirate: Emirate;
  registrationLink?: string;
  detailsLink?: string;
  imageUrl?: string;
  status: OpportunityStatus;
  submittedBy: string;
  createdAt: string; 
  ageRange?: number[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  bookmarkedOpportunities: string[];
}
