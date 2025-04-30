import { body } from 'express-validator';

// Driver Registration Validation
export const validateDriverRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('NIC').notEmpty().withMessage('NIC is required'),
  body('contactNumber').isNumeric().withMessage('Contact number must be numeric'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleCapacity').isNumeric().withMessage('Vehicle capacity must be a number'),
];

// Driver Login Validation
export const validateDriverLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
