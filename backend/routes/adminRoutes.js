import express from 'express';
import {
  adminLogin,
  registerAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  getAllOrders,
  getOrderById,
  getAllRefundRequests,
  processRefundRequest,
  getDashboardStats,
  updateOrderStatus
} from '../controllers/adminController.js';
import { buyerProtect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no middleware)
router.post('/login', adminLogin);
router.post('/register', registerAdmin);

// Create a new router for protected routes
const protectedRouter = express.Router();
protectedRouter.use(buyerProtect, admin);

// Protected routes
protectedRouter.get('/dashboard/stats', getDashboardStats);
protectedRouter.get('/users', getAllUsers);
protectedRouter.get('/users/:id', getUserById);
protectedRouter.put('/users/:id', updateUser);
protectedRouter.get('/orders', getAllOrders);
protectedRouter.get('/orders/:id', getOrderById);
protectedRouter.get('/refunds', getAllRefundRequests);
protectedRouter.put('/refunds/:id/process', processRefundRequest);
protectedRouter.put('/orders/:id/status', updateOrderStatus);

// Mount protected routes
router.use(protectedRouter);

export default router; 