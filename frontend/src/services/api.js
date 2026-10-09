import axios from 'axios';

// Ambil base URL dari env (jika ada), atau gunakan IP/hostname tempat frontend diakses + port 5000
const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: apiUrl,
});

// Request interceptor: tambahkan Authorization header dari localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: kalau 401, hapus token dan redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const backendHost = import.meta.env.VITE_SERVER_URL || `http://${window.location.hostname}:5000`;
  return `${backendHost}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
