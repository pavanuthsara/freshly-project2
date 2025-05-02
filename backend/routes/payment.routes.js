import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { buyerProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a Stripe Checkout Session (requires user to be authenticated)
router.post(
  '/create-checkout-session',
  buyerProtect,
  createCheckoutSession
);

// NOTE: The webhook route is handled directly in server.js
// to ensure it runs before the express.json() middleware

export default router;