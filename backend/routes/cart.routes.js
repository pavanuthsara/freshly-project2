import express from 'express';
import { buyerProtect } from '../middleware/auth.middleware.js';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity
} from '../controllers/cart.controller.js';

const router = express.Router();

// GET → Fetch user's cart
// POST → Add or update item in cart
router.route('/')
  .get(buyerProtect, getCart)
  .post(buyerProtect, addToCart);

// DELETE → Remove specific product from cart
// PUT → Update quantity of specific product
router.route('/:productId')
  .delete(buyerProtect, removeFromCart)
  .put(buyerProtect, updateCartItemQuantity);

export default router;
