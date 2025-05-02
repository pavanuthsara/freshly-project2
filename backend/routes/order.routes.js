// backend/routes/order.routes.js

import express from 'express';
import { buyerProtect, admin } from '../middleware/auth.middleware.js';
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
      .isLength({ min: 10 })
      .withMessage('Refund reason must be at least 10 characters long')
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
      .withMessage('Invalid Refund Request ID'),
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 1 })
      .withMessage('Message cannot be empty')
  ]
};

// Public routes
router.post('/', buyerProtect, validator.addOrderItems, validateRequest, addOrderItems);
router.get('/myorders', buyerProtect, getMyOrders);
router.get('/:id', buyerProtect, validator.getOrderById, validateRequest, getOrderById);
router.put('/:id/pay', buyerProtect, validator.updateOrderToPaid, validateRequest, updateOrderToPaid);

// Admin routes
router.get('/', buyerProtect, admin, getOrders);
router.put('/:id/deliver', buyerProtect, admin, validator.updateOrderToDeliver, validateRequest, updateOrderToDeliver);
router.put('/:id/status', buyerProtect, admin, validator.updateOrderStatus, validateRequest, updateOrderStatus);

// Refund routes
router.post('/:id/refund', buyerProtect, validator.requestRefund, validateRequest, requestRefund);
router.put('/refund/:id/process', buyerProtect, admin, processRefundRequest);
router.get('/refund/myrequests', buyerProtect, getMyRefundRequests);
router.get('/refund/:id', buyerProtect, getRefundRequestById);
router.post('/refund/:id/message', buyerProtect, validator.addRefundMessage, validateRequest, addRefundMessage);
router.post('/refund/:id/evidence', buyerProtect, upload.single('evidence'), uploadRefundEvidence);

// Stats routes
router.get('/stats/orders', buyerProtect, admin, getOrderStats);
router.get('/stats/refunds', buyerProtect, admin, getRefundStats);

export default router;