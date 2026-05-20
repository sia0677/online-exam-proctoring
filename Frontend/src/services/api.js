import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
};

// ── Exams ─────────────────────────────────────────────────────────────────────
export const examsAPI = {
  getAll:        ()          => api.get('/exams'),
  getById:       (id)        => api.get(`/exams/${id}`),
  getWithQs:     (id)        => api.get(`/exams/${id}/questions`),
  create:        (data)      => api.post('/exams', data),
  update:        (id, data)  => api.put(`/exams/${id}`, data),
  delete:        (id)        => api.delete(`/exams/${id}`),
  addQuestion:   (id, data)  => api.post(`/exams/${id}/questions`, data),
};

// ── Submissions ───────────────────────────────────────────────────────────────
export const submissionsAPI = {
  start:  (examId)             => api.post(`/submissions/${examId}/start`),
  save:   (subId, data)        => api.put(`/submissions/${subId}/save`, data),
  submit: (subId, data)        => api.post(`/submissions/${subId}/submit`, data),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll:   ()   => api.get('/users'),
  getById:  (id) => api.get(`/users/${id}`),
  delete:   (id) => api.delete(`/users/${id}`),
};

export default api;
