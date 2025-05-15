import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPasswordRequest,
  resetPassword
} from '../controllers/Buyer.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validator.js';
import { body, param } from 'express-validator';
import Order from '../models/order.model.js';

const router = express.Router();

// Validation logic for buyer routes
const validator = {
  checkLogin: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is Required')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Password is Empty')
  ],
  checkNewUser: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is Required')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Password is Empty')
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is Required')
      .escape()
  ],
  resetPasswordRequest: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is Required')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email address')
  ],
  resetPassword: [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is Required')
      .escape()
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    param('id')
      .exists()
      .withMessage('Id is required')
      .isMongoId()
      .withMessage('Invalid Id'),
    param('token')
      .trim()
      .notEmpty()
      .withMessage('Token is Required')
  ]
};

// Route to register a new buyer
router.post('/', validator.checkNewUser, validateRequest, registerUser);

// Route for buyer login
router.post('/login', validator.checkLogin, validateRequest, loginUser);

// Route for buyer logout
router.post('/logout', protect, logoutUser);

// Routes for password reset
router.post('/reset-password/request', validator.resetPasswordRequest, validateRequest, resetPasswordRequest);
router.post('/reset-password/reset/:id/:token', validator.resetPassword, validateRequest, resetPassword);

// Routes for buyer profile
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(validator.checkNewUser, validateRequest, protect, updateUserProfile);

// Route for buyer dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const buyerId = req.user._id;
    
    // Get total orders count
    const totalOrders = await Order.countDocuments({ user: buyerId });
    
    // Get total amount spent
    const orders = await Order.find({ 
      user: buyerId, 
      status: 'Delivered',
      totalPrice: { $exists: true }
    });
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ 
      user: buyerId, 
      status: { $in: ['Processing', 'Shipped'] } 
    });
    
    // Get favorite products count (you can implement this based on your logic)
    const favoriteProducts = 0; // Placeholder - implement based on your wishlist logic
    
    res.json({
      totalOrders,
      totalSpent,
      pendingOrders,
      favoriteProducts
    });
  } catch (error) {
    console.error('Error fetching buyer stats:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
