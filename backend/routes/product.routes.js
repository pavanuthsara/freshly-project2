// backend/routes/product.routes.js
import express from 'express';
import {
  getProducts,
  getProductsByCategory,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts
} from '../controllers/product.controller.js';
import { farmerProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getProducts); // Get all products
router.get('/category/:category', getProductsByCategory); // Get products by category
router.get('/:id', getProduct); // Get a single product

// Protected routes (require farmer authentication)
router.post('/', farmerProtect, createProduct); // Create a product
router.put('/:id', farmerProtect, updateProduct); // Update a product
router.delete('/:id', farmerProtect, deleteProduct); // Delete a product
router.get('/farmer/products', farmerProtect, getFarmerProducts); // Get farmer's products

export default router;
