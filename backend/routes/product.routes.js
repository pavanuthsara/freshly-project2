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
import { farmerProtect } from '../middleware/farmer.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getProducts); // Get all products
router.get('/category/:category', getProductsByCategory); // Get products by category
router.get('/:id', getProduct); // Get a single product

// Protected routes (require farmer authentication)
const protectedRouter  = express.Router();
protectedRouter .use(farmerProtect); // Apply farmerProtect middleware to all routes below
protectedRouter .post('/', createProduct); // Create a product
protectedRouter .put('/:id', updateProduct); // Update a product
protectedRouter .delete('/:id', deleteProduct); // Delete a product
protectedRouter .get("/", getFarmerProducts); // Requires authentication


export default {
  publicRoutes: router,
  protectedRoutes: protectedRouter
};