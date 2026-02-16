// Updated types to match Laravel backend API

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  gender: "Male" | "Female" | "Other";
  status: "Active" | "Inactive";
  admission_number: string;
  admission_date: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gender: "Male" | "Female" | "Other";
  qualification?: string;
  specialization?: string;
  joining_date: string;
  salary?: number;
  status: "Active" | "Inactive";
  employee_id: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Class {
  id: number;
  name: string;
  section?: string;
  teacher_id?: number;
  capacity: number;
  room_number?: string;
  status: "Active" | "Inactive";
  description?: string;
  teacher?: Teacher;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher_id?: number;
  class_id?: number;
  credits: number;
  type: "Theory" | "Practical" | "Both";
  status: "Active" | "Inactive";
  description?: string;
  teacher?: Teacher;
  class?: Class;
  created_at?: string;
  updated_at?: string;
}

export interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  exam_type: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
  exam_date: string;
  academic_year: string;
  remarks?: string;
  student?: Student;
  subject?: Subject;
  created_at?: string;
  updated_at?: string;
}

export interface Result {
  id: number;
  student_id: number;
  class_id: number;
  exam_type: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  division?: string;
  result_status: "Pass" | "Fail";
  rank?: number;
  academic_year: string;
  remarks?: string;
  student?: Student;
  class?: Class;
  created_at?: string;
  updated_at?: string;
}

export interface Enrollment {
  id: number;
  student_id: number;
  class_id: number;
  enrollment_date: string;
  academic_year: string;
  status: "Active" | "Completed" | "Dropped";
  remarks?: string;
  student?: Student;
  class?: Class;
  created_at?: string;
  updated_at?: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  class_id: number;
  subject_id?: number;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
  student?: Student;
  class?: Class;
  subject?: Subject;
  created_at?: string;
  updated_at?: string;
}

export interface Fee {
  id: number;
  student_id: number;
  fee_type: string;
  amount: number;
  paid_amount: number;
  pending_amount: number;
  due_date: string;
  paid_date?: string;
  status: "Paid" | "Pending" | "Overdue" | "Partial";
  payment_method?: string;
  transaction_id?: string;
  academic_year: string;
  remarks?: string;
  student?: Student;
  created_at?: string;
  updated_at?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface DashboardData {
  overview: {
    total_students: number;
    total_teachers: number;
    total_classes: number;
    total_subjects: number;
    total_enrollments: number;
  };
  recent_enrollments: Enrollment[];
  fee_statistics: {
    total_fees: number;
    collected_fees: number;
    pending_fees: number;
    overdue_fees: number;
  };
  attendance_summary: {
    total_today: number;
    present_today: number;
    absent_today: number;
    attendance_rate: number;
  };
  top_performers: any[];
}