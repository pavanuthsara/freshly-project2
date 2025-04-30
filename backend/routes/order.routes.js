// backend/routes/order.routes.js

import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  getOrders,
  updateOrderStatus,
  // Refund-related controllers
  requestRefund,
  processRefundRequest,
  getRefundRequests,
  getMyRefundRequests,
  getRefundRequestById,
  addRefundMessage,
  uploadRefundEvidence,
  getOrderStats,
  getRefundStats
} from '../controllers/order.controller.js';
import validateRequest from '../middleware/validator.js';
import { param, check, body } from 'express-validator';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/refund-evidence/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and PDF only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new Error('Only image and PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// ✅ Cleaned up validators with clearer string checks
const validator = {
  getOrderById: [
    param('id')
      .notEmpty()
      .withMessage('Id is required')
      .isMongoId()
      .withMessage('Invalid Id Format')
  ],
  updateOrderToPaid: [
    param('id')
      .notEmpty()
      .withMessage('Id is required')
      .isMongoId()
      .withMessage('Invalid Id Format')
  ],
  updateOrderToDeliver: [
    param('id')
      .notEmpty()
      .withMessage('Id is required')
      .isMongoId()
      .withMessage('Invalid Id Format')
  ],
  updateOrderStatus: [
    param('id')
      .notEmpty()
      .withMessage('Order ID is required')
      .isMongoId()
      .withMessage('Invalid Order ID'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'])
      .withMessage('Invalid status value')
  ],
  addOrderItems: [
    check('orderItems')
      .notEmpty()
      .withMessage('Order items are required'),
    check('shippingAddress.address')
      .notEmpty()
      .withMessage('Address is required'),
    check('shippingAddress.city')
      .notEmpty()
      .withMessage('City is required'),
    check('shippingAddress.postalCode')
      .notEmpty()
      .withMessage('Postal code is required'),
    check('shippingAddress.country')
      .notEmpty()
      .withMessage('Country is required'),
    
    // ✅ Ensure paymentMethod is a string
    check('paymentMethod')
      .notEmpty()
      .withMessage('Payment method is required')
      .isString()
      .withMessage('Payment method must be a string'),
    
    check('itemsPrice')
      .notEmpty()
      .withMessage('Items price is required')
      .isNumeric()
      .withMessage('Items price must be a number'),
    check('taxPrice')
      .notEmpty()
      .withMessage('Tax price is required')
      .isNumeric()
      .withMessage('Tax price must be a number'),
    check('shippingPrice')
      .notEmpty()
      .withMessage('Shipping price is required')
      .isNumeric()
      .withMessage('Shipping price must be a number'),
    check('totalPrice')
      .notEmpty()
      .withMessage('Total price is required')
      .isNumeric()
      .withMessage('Total price must be a number')
  ],
  // Validators for refund-related endpoints
  requestRefund: [
    param('id')
      .notEmpty()
      .withMessage('Order ID is required')
      .isMongoId()
      .withMessage('Invalid Order ID'),
    body('reason')
      .notEmpty()
      .withMessage('Refund reason is required')
      .isString()
      .withMessage('Reason must be a string')
  ],
  processRefundRequest: [
    param('id')
      .notEmpty()
      .withMessage('Refund request ID is required')
      .isMongoId()
      .withMessage('Invalid refund request ID'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['Processing', 'Approved', 'Rejected'])
      .withMessage('Invalid status value')
  ],
  getRefundRequestById: [
    param('id')
      .notEmpty()
      .withMessage('Refund request ID is required')
      .isMongoId()
      .withMessage('Invalid refund request ID')
  ],
  addRefundMessage: [
    param('id')
      .notEmpty()
      .withMessage('Refund request ID is required')
      .isMongoId()
      .withMessage('Invalid refund request ID'),
    body('message')
      .notEmpty()
      .withMessage('Message content is required')
      .isString()
      .withMessage('Message must be a string')
  ]
};

// ✅ Regular order routes
router
  .route('/')
  .post(validator.addOrderItems, validateRequest, protect, addOrderItems)
  .get(protect, admin, getOrders);

// Fixed route order: specific routes before parametrized routes
router.get('/my-orders', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);
router.get('/my-refund-requests', protect, getMyRefundRequests);
router.get('/refund-requests', protect, admin, getRefundRequests);
router.get('/refund-stats', protect, admin, getRefundStats);

// Refund request routes with specific params
router.get(
  '/refund-requests/:id', 
  validator.getRefundRequestById,
  validateRequest,
  protect, 
  getRefundRequestById
);

router.put(
  '/refund-requests/:id', 
  validator.processRefundRequest,
  validateRequest,
  protect, 
  admin, 
  processRefundRequest
);

router.post(
  '/refund-requests/:id/message',
  validator.addRefundMessage,
  validateRequest,
  protect,
  addRefundMessage
);

router.post(
  '/refund-requests/:id/evidence',
  validator.getRefundRequestById,
  validateRequest,
  protect,
  upload.array('evidence', 5),
  uploadRefundEvidence
);

// Generic order routes with params - must come after specific routes
router.get('/:id', validator.getOrderById, validateRequest, protect, getOrderById);
router.put('/:id/pay', validator.updateOrderToPaid, validateRequest, protect, updateOrderToPaid);
router.put('/:id/deliver', validator.updateOrderToDeliver, validateRequest, protect, admin, updateOrderToDeliver);
router.put('/:id/status', validator.updateOrderStatus, validateRequest, protect, admin, updateOrderStatus);
router.post(
  '/:id/refund-request', 
  validator.requestRefund, 
  validateRequest, 
  protect, 
  requestRefund
);

export default router;