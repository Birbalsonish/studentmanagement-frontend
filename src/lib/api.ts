import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for logging (optional)
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Student Service
export const studentService = {
  getAll: (params?: any) => api.get('/students', { params }),
  getById: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Teacher Service
export const teacherService = {
  getAll: (params?: any) => api.get('/teachers', { params }),
  getById: (id: number) => api.get(`/teachers/${id}`),
  create: (data: any) => api.post('/teachers', data),
  update: (id: number, data: any) => api.put(`/teachers/${id}`, data),
  delete: (id: number) => api.delete(`/teachers/${id}`),
};

// Class Service
export const classService = {
  getAll: (params?: any) => api.get('/classes', { params }),
  getById: (id: number) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: number, data: any) => api.put(`/classes/${id}`, data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

// Subject Service
export const subjectService = {
  getAll: (params?: any) => api.get('/subjects', { params }),
  getById: (id: number) => api.get(`/subjects/${id}`),
  create: (data: any) => api.post('/subjects', data),
  update: (id: number, data: any) => api.put(`/subjects/${id}`, data),
  delete: (id: number) => api.delete(`/subjects/${id}`),
};

// Grade Service
export const gradeService = {
  getAll: (params?: any) => api.get('/grades', { params }),
  getById: (id: number) => api.get(`/grades/${id}`),
  create: (data: any) => api.post('/grades', data),
  update: (id: number, data: any) => api.put(`/grades/${id}`, data),
  delete: (id: number) => api.delete(`/grades/${id}`),
};

// Result Service
export const resultService = {
  getAll: (params?: any) => api.get('/results', { params }),
  getById: (id: number) => api.get(`/results/${id}`),
  create: (data: any) => api.post('/results', data),
  update: (id: number, data: any) => api.put(`/results/${id}`, data),
  delete: (id: number) => api.delete(`/results/${id}`),
};

// Enrollment Service
export const enrollmentService = {
  getAll: (params?: any) => api.get('/enrollments', { params }),
  getById: (id: number) => api.get(`/enrollments/${id}`),
  create: (data: any) => api.post('/enrollments', data),
  update: (id: number, data: any) => api.put(`/enrollments/${id}`, data),
  delete: (id: number) => api.delete(`/enrollments/${id}`),
};

// Attendance Service
export const attendanceService = {
  getAll: (params?: any) => api.get('/attendance', { params }),
  getById: (id: number) => api.get(`/attendance/{id}`),
  create: (data: any) => api.post('/attendance', data),
  bulkCreate: (data: any) => api.post('/attendance/bulk', data),
  update: (id: number, data: any) => api.put(`/attendance/${id}`, data),
  delete: (id: number) => api.delete(`/attendance/${id}`),
};

// Fee Service
export const feeService = {
  getAll: (params?: any) => api.get('/fees', { params }),
  getById: (id: number) => api.get(`/fees/${id}`),
  create: (data: any) => api.post('/fees', data),
  update: (id: number, data: any) => api.put(`/fees/${id}`, data),
  delete: (id: number) => api.delete(`/fees/${id}`),
  recordPayment: (id: number, data: any) => api.post(`/fees/${id}/payment`, data),
};

// Dashboard Service
export const dashboardService = {
  getOverview: () => api.get('/dashboard'),
  getStatistics: (params?: any) => api.get('/dashboard/statistics', { params }),
};

// Health Check
export const healthCheck = () => api.get('/health');

export default api;