import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 8000),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.metadata = { start: Date.now() };
  return config;
});

api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.start || Date.now());
    if (import.meta.env.DEV) {
      const method = (response.config.method || 'get').toUpperCase();
      console.log(`[API] ${response.status} ${method} ${response.config.url} – ${duration}ms`);
    }
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!error.response && error.code === 'ERR_NETWORK') {
      return Promise.reject({
        status: 0,
        message: 'Không kết nối được máy chủ. Kiểm tra json-server đã chạy chưa?',
      });
    }

    const status = error.response?.status || 0;
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject({ status, message });
  }
);

export default api;
export const isCancel = axios.isCancel;
