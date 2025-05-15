import api from './api';

export default {
  async getProducts() {
    const response = await api.get('/products');
    return response.data.products;
  },

  async getFarmerProducts(farmerId) {
    const response = await api.get(`/products/farmer/${farmerId}`);
    return response.data.products;
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data.product;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.product;
  },

  async deleteProduct(id) {
    await api.delete(`/products/${id}`);
  }
};