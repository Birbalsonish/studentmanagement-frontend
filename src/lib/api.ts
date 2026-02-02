// src/services/api.ts - Fixed with type-only imports

import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  Student,
  Teacher,
  Grade,
  Result,
  Enrollment,
  ClassData,
  Subject,
  Attendance,
  Fee,
  ApiResponse,
  ApiListResponse,
  PaginationParams,
  StudentFilters,
  TeacherFilters,
  AttendanceFilters,
  FeeFilters,
} from '@/lib/types';

// Get API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ================= STUDENT SERVICE ================= */

export const studentService = {
  getAll: (params?: PaginationParams & StudentFilters) =>
    api.get<ApiListResponse<Student>>('/students', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Student>>(`/students/${id}`),

  create: (data: Omit<Student, 'id'>) =>
    api.post<ApiResponse<Student>>('/students', data),

  update: (id: number, data: Partial<Student>) =>
    api.put<ApiResponse<Student>>(`/students/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/students/${id}`),

  search: (query: string) =>
    api.get<ApiListResponse<Student>>('/students/search', { params: { q: query } }),
};

/* ================= TEACHER SERVICE ================= */

export const teacherService = {
  getAll: (params?: PaginationParams & TeacherFilters) =>
    api.get<ApiListResponse<Teacher>>('/teachers', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Teacher>>(`/teachers/${id}`),

  create: (data: Omit<Teacher, 'id'>) =>
    api.post<ApiResponse<Teacher>>('/teachers', data),

  update: (id: number, data: Partial<Teacher>) =>
    api.put<ApiResponse<Teacher>>(`/teachers/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/teachers/${id}`),

  search: (query: string) =>
    api.get<ApiListResponse<Teacher>>('/teachers/search', { params: { q: query } }),
};

/* ================= GRADE SERVICE ================= */

export const gradeService = {
  getAll: (params?: PaginationParams) =>
    api.get<ApiListResponse<Grade>>('/grades', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Grade>>(`/grades/${id}`),

  getByStudent: (studentId: number) =>
    api.get<ApiListResponse<Grade>>('/grades', { params: { studentId } }),

  create: (data: Omit<Grade, 'id'>) =>
    api.post<ApiResponse<Grade>>('/grades', data),

  update: (id: number, data: Partial<Grade>) =>
    api.put<ApiResponse<Grade>>(`/grades/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/grades/${id}`),
};

/* ================= RESULT SERVICE ================= */

export const resultService = {
  getAll: (params?: PaginationParams) =>
    api.get<ApiListResponse<Result>>('/results', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Result>>(`/results/${id}`),

  getByStudent: (studentId: number) =>
    api.get<ApiListResponse<Result>>('/results', { params: { studentId } }),

  create: (data: Omit<Result, 'id'>) =>
    api.post<ApiResponse<Result>>('/results', data),

  update: (id: number, data: Partial<Result>) =>
    api.put<ApiResponse<Result>>(`/results/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/results/${id}`),
};

/* ================= ENROLLMENT SERVICE ================= */

export const enrollmentService = {
  getAll: (params?: PaginationParams) =>
    api.get<ApiListResponse<Enrollment>>('/enrollments', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`),

  getByStudent: (studentId: number) =>
    api.get<ApiListResponse<Enrollment>>('/enrollments', { params: { studentId } }),

  create: (data: Omit<Enrollment, 'id'>) =>
    api.post<ApiResponse<Enrollment>>('/enrollments', data),

  update: (id: number, data: Partial<Enrollment>) =>
    api.put<ApiResponse<Enrollment>>(`/enrollments/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/enrollments/${id}`),
};

/* ================= CLASS SERVICE ================= */

export const classService = {
  getAll: (params?: PaginationParams) =>
    api.get<ApiListResponse<ClassData>>('/classes', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<ClassData>>(`/classes/${id}`),

  create: (data: Omit<ClassData, 'id'>) =>
    api.post<ApiResponse<ClassData>>('/classes', data),

  update: (id: number, data: Partial<ClassData>) =>
    api.put<ApiResponse<ClassData>>(`/classes/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/classes/${id}`),
};

/* ================= SUBJECT SERVICE ================= */

export const subjectService = {
  getAll: (params?: PaginationParams) =>
    api.get<ApiListResponse<Subject>>('/subjects', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Subject>>(`/subjects/${id}`),

  getByTeacher: (teacherName: string) =>
    api.get<ApiListResponse<Subject>>('/subjects', { params: { teacherName } }),

  create: (data: Omit<Subject, 'id'>) =>
    api.post<ApiResponse<Subject>>('/subjects', data),

  update: (id: number, data: Partial<Subject>) =>
    api.put<ApiResponse<Subject>>(`/subjects/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/subjects/${id}`),
};

/* ================= ATTENDANCE SERVICE ================= */

export const attendanceService = {
  getAll: (params?: PaginationParams & AttendanceFilters) =>
    api.get<ApiListResponse<Attendance>>('/attendance', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Attendance>>(`/attendance/${id}`),

  getByDate: (date: string) =>
    api.get<ApiListResponse<Attendance>>('/attendance', { params: { date } }),

  getByStudent: (studentId: number) =>
    api.get<ApiListResponse<Attendance>>('/attendance', { params: { studentId } }),

  create: (data: Omit<Attendance, 'id'>) =>
    api.post<ApiResponse<Attendance>>('/attendance', data),

  update: (id: number, data: Partial<Attendance>) =>
    api.put<ApiResponse<Attendance>>(`/attendance/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/attendance/${id}`),

  markBulk: (data: Omit<Attendance, 'id'>[]) =>
    api.post<ApiResponse<Attendance[]>>('/attendance/bulk', { records: data }),
};

/* ================= FEE SERVICE ================= */

export const feeService = {
  getAll: (params?: PaginationParams & FeeFilters) =>
    api.get<ApiListResponse<Fee>>('/fees', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Fee>>(`/fees/${id}`),

  getByStudent: (studentId: number) =>
    api.get<ApiListResponse<Fee>>('/fees', { params: { studentId } }),

  create: (data: Omit<Fee, 'id'>) =>
    api.post<ApiResponse<Fee>>('/fees', data),

  update: (id: number, data: Partial<Fee>) =>
    api.put<ApiResponse<Fee>>(`/fees/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/fees/${id}`),

  getByStatus: (status: 'Paid' | 'Pending' | 'Overdue') =>
    api.get<ApiListResponse<Fee>>('/fees', { params: { status } }),
};

/* ================= DASHBOARD SERVICE ================= */

export const dashboardService = {
  getStats: () =>
    api.get('/dashboard/stats'),

  getMonthlyEnrollments: (month?: number) =>
    api.get('/dashboard/enrollments', { params: { month } }),

  getAttendanceOverview: () =>
    api.get('/dashboard/attendance'),

  getMonthlyRevenue: () =>
    api.get('/dashboard/revenue'),

  getReports: () =>
    api.get('/dashboard/reports'),
};

/* ================= AUTH SERVICE (For Future) ================= */

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh'),

  getCurrentUser: () =>
    api.get('/auth/me'),
};

/* ================= ERROR HANDLING ================= */

export const handleApiError = (error: AxiosError): string => {
  if (error.response?.status === 400) {
    return 'Invalid input. Please check your data.';
  } else if (error.response?.status === 401) {
    return 'Unauthorized. Please login again.';
  } else if (error.response?.status === 404) {
    return 'Resource not found.';
  } else if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  }
  return 'An error occurred. Please try again.';
};

export default api;