import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getProductsByCategory,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router.get('/', getProducts); // Get all products
router.get('/top', getTopProducts); // Get top products
router.get('/:id', getProduct); // Get a single product
router.post('/', createProduct); // Create a product
router.put('/:id', updateProduct); // Update a product
router.delete('/:id', deleteProduct); // Delete a product
router.get('/category/:category', getProductsByCategory); // Get products by category

export default router;