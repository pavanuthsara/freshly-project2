import api from './api';

export default {
  async login(credentials) {
    const response = await api.post('/farmers/login', credentials);
    return response.data.farmer;
  },

  async register(farmerData) {
    const response = await api.post('/farmers/register', farmerData);
    return response.data.farmer;
  },

  async logout() {
    await api.post('/farmers/logout');
  },

  async getCurrentUser() {
    const response = await api.get('/farmers/me');
    return response.data.farmer;
  },

  async updateProfile(updatedData) {
    const response = await api.put('/farmers/profile', updatedData);
    return response.data.farmer;
  }
};