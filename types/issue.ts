export type Urgency = 'Low' | 'Medium' | 'High';
export type Status = 'Open' | 'In Progress' | 'Resolved';
export type IssueCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'AC/HVAC'
  | 'Furniture'
  | 'Cleaning'
  | 'Other';

export interface Issue {
  ticketNumber: string;
  propertyName: string;
  issueCategory: IssueCategory;
  urgency: Urgency;
  description: string;
  photoURL: string;
  dateSubmitted: string;
  status: Status;
}