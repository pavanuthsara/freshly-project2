// backend/routes/product.routes.js
import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validator.js';
import { check, param } from 'express-validator';

const router = express.Router();

// Define validators if needed (you already have these in previous steps)

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/:id', getProduct);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
