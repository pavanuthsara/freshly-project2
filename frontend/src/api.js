import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Use relative URL so Vite proxy handles requests
  withCredentials: true, // Include cookies in requests
});

export default api;

export const login = (email, password) => api.post('/buyers/login', { email, password });
export const register = (name, email, password) => api.post('/buyers', { name, email, password });
