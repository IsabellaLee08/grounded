export type Category =
  | 'Academic' | 'Arts' | 'Athletics & Rec' | 'Career & Networking' | 'Community Service'
  | 'Cultural' | 'Food' | 'Music' | 'Social' | 'Tech' | 'Wellness';

export const CATEGORIES: Category[] = [
  'Academic', 'Arts', 'Athletics & Rec', 'Career & Networking', 'Community Service',
  'Cultural', 'Food', 'Music', 'Social', 'Tech', 'Wellness',
];

export const MAJORS = [
  'Economics', 'Commerce', 'Computer Science', 'Engineering', 'Biology',
  'Politics', 'English', 'Psychology', 'Other',
];

export type OrgType = 'club' | 'business';

// "Organizations" + "Businesses" tables
export interface Org {
  id: string;
  name: string;
  type: OrgType;
  category: Category;
  description: string;
  email: string;
  followers: number;
}

export type EventStatus = 'pending' | 'approved' | 'rejected';

// "Events" + "Event Submissions" tables (status drives the approval workflow)
export interface AppEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "6:00 PM"
  location: string;
  description: string;
  cost: string; // "Free" or "$5"
  registrationLink?: string;
  category: Category;
  orgId: string;
  status: EventStatus;
  popularMajors?: string[];
  followers: number;
}

// "Users" table + onboarding survey responses
export interface Profile {
  name: string;
  email: string;
  major: string;
  age: string;
  bio: string;
  interests: Category[];
  onboarded: boolean;
}
