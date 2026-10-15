export interface CustomField {
  id: string;
  label: string;
  type?: 'text' | 'date' | 'number';
}

export interface AthleteRecord {
  id: string;
  firstName: string;
  lastName: string;
  licenseNo: string;
  club: string;
  region: string;
  degree: string;
  degreeDate: string;
  certNo: string;
  birthDate?: string;
  category?: string;
  [key: string]: string | undefined;
}

export interface ClubAccount {
  id: string;
  club: string;
  pass: string;
  region?: string;
  managerName?: string;
  phone?: string;
}

export interface AttachedFile {
  name: string;
  size: string;
  type: string;
  data: string; // Base64 data URL
}

export interface SubmissionItem {
  itemId: string;
  data: Record<string, string>;
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface Submission {
  id: string | number;
  sender: string;
  items: SubmissionItem[];
  file?: AttachedFile | null;
  date: string;
  notes?: string;
}

export type UserRole = 'admin' | 'club' | null;

export interface ValidationResult {
  isAlert: boolean;
  severity: 'info' | 'warning' | 'error';
  reason: string;
}
