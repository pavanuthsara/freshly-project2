import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';

const api = axios.create({
  baseURL: isDevelopment 
    ? 'http://localhost:5000/api' 
    : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        // Clear any stored tokens
        localStorage.removeItem('token');
        document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Add a small delay before redirecting to allow for state updates
        setTimeout(() => {
          window.location.href = '/buyer/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const login = (email, password) => api.post('/buyers/login', { email, password });
export const register = (name, email, password) => api.post('/buyers', { name, email, password });
