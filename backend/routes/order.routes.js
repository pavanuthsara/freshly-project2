// backend/routes/order.routes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  getOrders,
  updateOrderStatus
} from '../controllers/order.controller.js';
import validateRequest from '../middleware/validator.js';
import { param, check, body } from 'express-validator';

const router = express.Router();

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
      .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
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
    check('paymentMethod')
      .notEmpty()
      .withMessage('Payment method is required'),
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
  ]
};

// Routes
router
  .route('/')
  .post(validator.addOrderItems, validateRequest, protect, addOrderItems)
  .get(protect, getOrders);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', validator.getOrderById, validateRequest, protect, getOrderById);
router.put('/:id/pay', validator.updateOrderToPaid, validateRequest, protect, updateOrderToPaid);
router.put('/:id/deliver', validator.updateOrderToDeliver, validateRequest, protect, updateOrderToDeliver);
router.put('/:id/status', validator.updateOrderStatus, validateRequest, protect, updateOrderStatus);

export default router;
