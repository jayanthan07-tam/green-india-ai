export type UserRole =
  | "Citizen"
  | "Department Officer"
  | "Reviewer"
  | "Administrator"
  | "Super Administrator";

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  department?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
}

export type PasswordStrength = "weak" | "good" | "strong";

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  category: "Sanitation & Waste" | "Potholes & Roads" | "Water Supply" | "Street Lighting" | "Air & Environmental" | "Tree Plantation";
  description: string;
  location: string;
  district: string;
  state: string;
  lat?: number;
  lng?: number;
  status: "Pending Verification" | "Assigned to Department" | "Work In Progress" | "Resolved (AI Validated)" | "Rejected";
  priority: "High" | "Medium" | "Low";
  beforeImageUrl?: string;
  afterImageUrl?: string;
  aiVerificationScore?: number; // 0 to 100%
  aiAnalysisNotes?: string;
  submittedBy: string;
  assignedDepartment: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStat {
  id: string;
  name: string;
  code: string;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  aiProofRate: number; // percentage
  avgResolutionDays: number;
}
