import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Normalize URL: Ensure it ends with /api/v1
if (API_BASE_URL && !API_BASE_URL.endsWith('/api/v1') && !API_BASE_URL.endsWith('/api/v1/')) {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  API_BASE_URL = `${base}/api/v1`;
}

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
