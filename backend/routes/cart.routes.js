import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addToCart,
  getCart,
  removeFromCart
} from '../controllers/cart.controller.js';

const router = express.Router();

// GET → Fetch user's cart
// POST → Add or update item in cart
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

// DELETE → Remove specific product from cart
router.route('/:productId')
  .delete(protect, removeFromCart);

export default router;
