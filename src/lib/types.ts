// src/lib/types.ts - Clean and working version

/* ================= ENTITY INTERFACES ================= */

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;  // This is already here - it stores Nepali date (YYYY-MM-DD format)
  studentId: string;
  class: string;
  rollNo: number;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subject: string;
  marks: number;
  grade: string;
  result: "Pass" | "Fail";
  createdAt?: string;
  updatedAt?: string;
}

export interface Result {
  id: number;
  studentId: number;
  studentName: string;
  class: string;
  totalMarks: number;
  percentage: number;
  result: "Pass" | "Fail";
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  rollNo: string;
  course: string;
  enrolledOn: string;
  status: "Active" | "Completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  teacherId: string;
  subject: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassData {
  id: number;
  name: string;
  teacherName: string;
  studentCount: number;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacherName: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  id: number;
  studentName: string;
  studentId?: number;
  date: string;
  status: "Present" | "Absent" | "Leave";
  createdAt?: string;
  updatedAt?: string;
}

export interface Fee {
  id: number;
  studentName: string;
  studentId?: number;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  createdAt?: string;
  updatedAt?: string;
}

/* ================= API RESPONSE TYPES ================= */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  message?: string;
  error?: string;
  details?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: string[];
  code?: string;
}

/* ================= PAGINATION TYPES ================= */

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/* ================= FILTER TYPES ================= */

export interface StudentFilters {
  status?: "Active" | "Inactive";
  class?: string;
  search?: string;
}

export interface TeacherFilters {
  status?: "Active" | "Inactive";
  subject?: string;
  search?: string;
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
  studentId?: number;
  status?: "Present" | "Absent" | "Leave";
}

export interface FeeFilters {
  status?: "Paid" | "Pending" | "Overdue";
  studentId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

/* ================= FORM REQUEST TYPES ================= */

export type CreateStudentRequest = Omit<Student, "id" | "createdAt" | "updatedAt">;

export type UpdateStudentRequest = Partial<Omit<Student, "id" | "createdAt" | "updatedAt">>;

export type CreateTeacherRequest = Omit<Teacher, "id" | "createdAt" | "updatedAt">;

export type UpdateTeacherRequest = Partial<Omit<Teacher, "id" | "createdAt" | "updatedAt">>;

export type CreateGradeRequest = Omit<Grade, "id" | "createdAt" | "updatedAt">;

export type UpdateGradeRequest = Partial<Omit<Grade, "id" | "createdAt" | "updatedAt">>;

export type CreateResultRequest = Omit<Result, "id" | "createdAt" | "updatedAt">;

export type UpdateResultRequest = Partial<Omit<Result, "id" | "createdAt" | "updatedAt">>;

export type CreateEnrollmentRequest = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;

export type UpdateEnrollmentRequest = Partial<Omit<Enrollment, "id" | "createdAt" | "updatedAt">>;

export type CreateClassRequest = Omit<ClassData, "id" | "createdAt" | "updatedAt">;

export type UpdateClassRequest = Partial<Omit<ClassData, "id" | "createdAt" | "updatedAt">>;

export type CreateSubjectRequest = Omit<Subject, "id" | "createdAt" | "updatedAt">;

export type UpdateSubjectRequest = Partial<Omit<Subject, "id" | "createdAt" | "updatedAt">>;

export type CreateAttendanceRequest = Omit<Attendance, "id" | "createdAt" | "updatedAt">;

export type UpdateAttendanceRequest = Partial<Omit<Attendance, "id" | "createdAt" | "updatedAt">>;

export type CreateFeeRequest = Omit<Fee, "id" | "createdAt" | "updatedAt">;

export type UpdateFeeRequest = Partial<Omit<Fee, "id" | "createdAt" | "updatedAt">>;

/* ================= DASHBOARD TYPES ================= */

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: number;
  pendingFees: number;
}

export interface MonthlyEnrollment {
  month: string;
  enrollments: number;
}

export interface AttendanceOverview {
  present: number;
  absent: number;
  leave: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

/* ================= REPORT TYPES ================= */

export interface StudentReport {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  byClass: Record<string, number>;
}

export interface AttendanceReport {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  percentage: number;
}

export interface FeeReport {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paymentPercentage: number;
}

/* ================= AUTH TYPES ================= */

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "teacher" | "staff";
  status: "Active" | "Inactive";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

/* ================= ERROR TYPES ================= */

export class ApiError extends Error {
  public readonly name = "ApiError";

  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string,
    public readonly details?: string[]
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  timeout?: number;
}

/* ================= UTILITY TYPES ================= */

export type EntityType = Student | Teacher | Grade | Result | Enrollment | ClassData | Subject | Attendance | Fee;

export type AllFilters = StudentFilters | TeacherFilters | AttendanceFilters | FeeFilters;

export type AllRequests =
  | CreateStudentRequest
  | CreateTeacherRequest
  | CreateGradeRequest
  | CreateResultRequest
  | CreateEnrollmentRequest
  | CreateClassRequest
  | CreateSubjectRequest
  | CreateAttendanceRequest
  | CreateFeeRequest;

/* ================= CONSTANTS ================= */

export const STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export const RESULT = {
  PASS: "Pass",
  FAIL: "Fail",
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LEAVE: "Leave",
} as const;

export const FEE_STATUS = {
  PAID: "Paid",
  PENDING: "Pending",
  OVERDUE: "Overdue",
} as const;

export const ENROLLMENT_STATUS = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
} as const;

/* ================= FORM STATE TYPES ================= */

export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  data?: Record<string, unknown>;
}

export interface TableState {
  data: EntityType[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationResponse;
  filters: AllFilters;
}

/* ================= MODAL TYPES ================= */

export interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit" | "view";
  data?: EntityType;
}

/* ================= NOTIFICATION TYPES ================= */

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}