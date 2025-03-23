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

export default router;
