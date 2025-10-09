export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: "full-time" | "part-time" | "internship";
  status: "active" | "paused" | "closed";
  description: string;
  requirements: string;
  benefits: string;
  skills_required: string;
  experience_level: string;
  urgency_level: "high" | "medium" | "low";
  salary: string;
  num_applicants: number;
  posted_date: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  address: string;
}
export interface ApplicationData {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cv: File | null;
}
export interface Candidate {
  id: string;
  full_name: string; // Thay đổi từ 'name' thành 'full_name' để match với database
  email: string;
  phone: string;
  total_applications: number; // Số đơn ứng tuyển
  latest_application_date: string; // Lần cuối ứng tuyển
  status: "pending" | "reviewing" | "interviewed" | "accepted" | "rejected"; // Match với Application status
  job_titles: string[]; // Danh sách các vị trí đã ứng tuyển
  cv_filename?: string; // CV mới nhất
  cv_path?: string; // Đường dẫn CV
  // Có thể thêm các field tùy chọn sau:
  skills?: string[];
  experience_level?: string;
  location?: string;
  notes?: string[]; // Ghi chú của HR
  source?: string; // Nguồn ứng tuyển (website, linkedin, etc.)
}

export interface Interview {
  id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  position?: string;
  interview_date: string;
  interviewer: string;
  interviewer_email: string;
  location: string;
  type: "onsite";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  duration: number;
  job_title: string;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  newApplications: number;
  interviewsToday: number;
  hiredThisMonth: number;
  averageTimeToHire: number;
  topSkills: { skill: string; count: number }[];
}
export interface JobFormData {
  title: string;
  department: string;
  num_applicants: number;
  location: string;
  employment_type: "full-time" | "part-time" | "internship";
  description: string;
  requirements: string;
  benefits: string;
  skills_required: string;
  experience_level: string;
  urgency_level: string;
  salary: string;
  deadline: string;
  status: string;
  address: string;
}
export interface Application {
  id: string;
  ai_score?: number;
  ai_analysis?: string;
  job_id: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  cvUrl: string;
  status:
    | "pending"
    | "reviewing"
    | "interviewed"
    | "scheduled_interview"
    | "accepted"
    | "rejected";
  appliedDate: string;
  cv_filename: string;
  cv_path: string;
  job_title: string;
  submitted_at: string;
}
export interface InterviewScheduleData {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  date: string;
  time: string;
  duration: number;
  type: "onsite"; // Chỉ hỗ trợ offline
  interviewer: string;
  interviewerEmail: string;
  location: string; // Bắt buộc cho phỏng vấn offline
  notes?: string;
  jobTitle?: string;
}

export interface AIScoreResult {
  
  overallScore?: number;
  ranking?: string;
  fitScore?: {
    overall?: number;
    skills?: number;
    experience?: number;
    education?: number;
  };
  recommendation?: string;
  strengths?: string[];
  weaknesses?: string[];
  skills?: {
    name?: string;
    required?: boolean;
    match?: number;
  }[];
  experience?: {
    years?: number;
    level?: string;
    relevant?: boolean;
  };
  education?: {
    degree?: string;
    relevant?: boolean;
    score?: number;
  };
}
export interface ApplicantsListProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  jobSkills: string[];
  experience: string;
  description: string;
}
export interface AIScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AIScoreResult;
}

