// backend/controllers/order.controller.js

import Order from '../models/order.model.js';
import Buyer from '../models/buyer.model.js';
import RefundRequest from '../models/refundRequest.model.js';
import mongoose from 'mongoose';

// @desc     Create new order & empty user's cart
// @route    POST /api/v1/orders
// @access   Private
const addOrderItems = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    // 1) Validate order items
    if (!orderItems || orderItems.length === 0) {
      res.statusCode = 400;
      throw new Error('No order items.');
    }

    // 2) Normalize payment method if sent as an object
    const normalizedPaymentMethod =
      typeof paymentMethod === 'object' ? paymentMethod.method : paymentMethod;

    // 3) Create a new Order document
    const order = new Order({
      user: req.buyer._id,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item.product
      })),
      shippingAddress,
      paymentMethod: normalizedPaymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // 4) Save the newly created order
    const createdOrder = await order.save({ session });

    // 5) Empty the cart of the current user (Buyer)
    const buyer = await Buyer.findById(req.buyer._id).session(session);
    if (buyer) {
      buyer.cart = [];
      await buyer.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    
    // 6) Return the newly created order
    return res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc     Get logged-in user orders
// @route    GET /api/v1/orders/my-orders
// @access   Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.buyer._id }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      res.statusCode = 404;
      throw new Error('No orders found for the logged-in user.');
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc     Get order by ID
// @route    GET /api/v1/orders/:id
// @access   Private
const getOrderById = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }
    
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }
    
    // Check if the user is authorized to view this order
    if (req.buyer.role !== 'admin' && order.user._id.toString() !== req.buyer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to access this order');
    }

    // Get associated refund request if any
    const refundRequest = await RefundRequest.findOne({ order: orderId })
      .select('status reason createdAt processedAt');

    // Add the refund request to the response if it exists
    const responseData = {
      ...order.toObject(),
      refundRequest: refundRequest || null
    };

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to paid
// @route    PUT /api/v1/orders/:id/pay
// @access   Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }
    
    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }
    
    if (order.isPaid) {
      res.statusCode = 400;
      throw new Error('Order is already paid');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.updateTime,
      email_address: req.body.email
    };
    
    // Update status to Processing once paid
    if (order.status === 'Pending') {
      order.status = 'Processing';
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to delivered
// @route    PUT /api/v1/orders/:id/deliver
// @access   Private/Admin
const updateOrderToDeliver = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }
    
    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }
    
    if (!order.isPaid) {
      res.statusCode = 400;
      throw new Error('Cannot mark unpaid order as delivered');
    }
    
    if (order.isDelivered) {
      res.statusCode = 400;
      throw new Error('Order is already delivered');
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order status
// @route    PUT /api/v1/orders/:id/status
// @access   Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { status, reason } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }

    if (!status) {
      res.statusCode = 400;
      throw new Error('Status is required');
    }
    
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
    if (!validStatuses.includes(status)) {
      res.statusCode = 400;
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }
    
    // Handle status transitions
    if (status === 'Cancelled') {
      order.isCancelled = true;
      order.cancelledAt = new Date();
      order.cancellationReason = reason || 'Cancelled by admin';
    } else if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === 'Refunded' && !order.refundRequested) {
      res.statusCode = 400;
      throw new Error('Cannot mark as refunded without a refund request');
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Get all orders
// @route    GET /api/v1/orders
// @access   Private/Admin
const getOrders = async (req, res, next) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Add filtering
    const filterOptions = {};
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    // Filter by refund status
    if (req.query.refundStatus) {
      filterOptions.refundStatus = req.query.refundStatus;
    }
    
    // Filter by refund requested
    if (req.query.refundRequested) {
      filterOptions.refundRequested = req.query.refundRequested === 'true';
    }
    
    // Add date range filtering
    if (req.query.startDate && req.query.endDate) {
      filterOptions.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const orders = await Order.find(filterOptions)
      .populate('user', 'id name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // For each order, get the associated refund request if any
    const ordersWithRefunds = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();
      const refundRequest = await RefundRequest.findOne({ order: order._id })
        .select('status reason createdAt processedAt');
      
      return {
        ...orderObj,
        refundRequest: refundRequest || null
      };
    }));

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filterOptions);
    
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        orders: [],
        page,
        pages: Math.ceil(totalOrders / limit) || 1,
        total: totalOrders
      });
    }
    
    res.status(200).json({
      orders: ordersWithRefunds,
      page,
      pages: Math.ceil(totalOrders / limit),
      total: totalOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get order statistics
// @route    GET /api/v1/orders/stats
// @access   Private/Admin
const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $facet: {
          'statusCounts': [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          'refundStatusCounts': [
            {
              $group: {
                _id: '$refundStatus',
                count: { $sum: 1 }
              }
            }
          ],
          'totalRevenue': [
            {
              $match: { isPaid: true }
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: '$totalPrice' }
              }
            }
          ],
          'totalRefunds': [
            {
              $match: { refundStatus: 'Approved' }
            },
            {
              $group: {
                _id: null,
                amount: { $sum: '$refundAmount' }
              }
            }
          ],
          'monthlyRevenue': [
            {
              $match: { isPaid: true }
            },
            {
              $group: {
                _id: { 
                  month: { $month: '$paidAt' },
                  year: { $year: '$paidAt' }
                },
                revenue: { $sum: '$totalPrice' },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': -1, '_id.month': -1 }
            },
            {
              $limit: 12
            }
          ]
        }
      }
    ]);
    
    res.status(200).json(stats[0]);
  } catch (error) {
    next(error);
  }
};

// @desc     Request refund for an order
// @route    POST /api/v1/orders/:id/refund
// @access   Private
const requestRefund = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found');
    }

    // Check if the user is the owner of the order
    if (order.user.toString() !== req.buyer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to request refund for this order');
    }

    // Create refund request
    const refundRequest = new RefundRequest({
      order: orderId,
      user: req.buyer._id,
      reason
    });

    await refundRequest.save();
    res.status(201).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Process refund request
// @route    PUT /api/v1/orders/refund/:id/process
// @access   Private/Admin
const processRefundRequest = async (req, res, next) => {
  try {
    const { id: refundId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(refundId)) {
      res.statusCode = 400;
      throw new Error('Invalid refund request ID format');
    }

    const refundRequest = await RefundRequest.findById(refundId);

    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }

    refundRequest.status = status;
    refundRequest.processedAt = new Date();
    refundRequest.processedBy = req.buyer._id;

    await refundRequest.save();
    res.status(200).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Get logged-in user's refund requests
// @route    GET /api/v1/orders/refund/myrequests
// @access   Private
const getMyRefundRequests = async (req, res, next) => {
  try {
    const refundRequests = await RefundRequest.find({ user: req.buyer._id })
      .populate('order')
      .sort({ createdAt: -1 });

    res.status(200).json(refundRequests);
  } catch (error) {
    next(error);
  }
};

// @desc     Get refund request by ID
// @route    GET /api/v1/orders/refund/:id
// @access   Private
const getRefundRequestById = async (req, res, next) => {
  try {
    const { id: refundId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(refundId)) {
      res.statusCode = 400;
      throw new Error('Invalid refund request ID format');
    }

    const refundRequest = await RefundRequest.findById(refundId)
      .populate('order')
      .populate('user', 'name email');

    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }

    // Check if the user is authorized to view this refund request
    if (req.buyer.role !== 'admin' && refundRequest.user._id.toString() !== req.buyer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to access this refund request');
    }

    res.status(200).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Add message to refund request
// @route    POST /api/v1/orders/refund/:id/message
// @access   Private
const addRefundMessage = async (req, res, next) => {
  try {
    const { id: refundId } = req.params;
    const { message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(refundId)) {
      res.statusCode = 400;
      throw new Error('Invalid refund request ID format');
    }

    const refundRequest = await RefundRequest.findById(refundId);

    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }

    const isOwner = refundRequest.user.toString() === req.buyer._id.toString();
    if (!isOwner && req.buyer.role !== 'admin') {
      res.statusCode = 403;
      throw new Error('Not authorized to add message to this refund request');
    }

    refundRequest.messages.push({
      sender: req.buyer._id,
      message,
      isAdmin: req.buyer.role === 'admin'
    });

    await refundRequest.save();
    res.status(200).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Upload evidence for refund request
// @route    POST /api/v1/orders/refund/:id/evidence
// @access   Private
const uploadRefundEvidence = async (req, res, next) => {
  try {
    const { id: refundId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(refundId)) {
      res.statusCode = 400;
      throw new Error('Invalid refund request ID format');
    }

    const refundRequest = await RefundRequest.findById(refundId);

    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }

    if (refundRequest.user.toString() !== req.buyer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to upload evidence for this refund request');
    }

    if (!req.file) {
      res.statusCode = 400;
      throw new Error('No file uploaded');
    }

    refundRequest.evidence = req.file.path;
    await refundRequest.save();
    res.status(200).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Get refund statistics
// @route    GET /api/v1/orders/refund-stats
// @access   Private/Admin
const getRefundStats = async (req, res, next) => {
  try {
    // Get order stats related to refunds
    const orderStats = await Order.aggregate([
      {
        $facet: {
          'refundStatusCounts': [
            {
              $group: {
                _id: '$refundStatus',
                count: { $sum: 1 }
              }
            }
          ],
          'refundsByMonth': [
            {
              $match: { 
                refundProcessedAt: { $exists: true, $ne: null },
                refundStatus: 'Approved'
              }
            },
            {
              $group: {
                _id: { 
                  month: { $month: '$refundProcessedAt' },
                  year: { $year: '$refundProcessedAt' }
                },
                totalAmount: { $sum: '$refundAmount' },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': -1, '_id.month': -1 }
            },
            {
              $limit: 12
            }
          ],
          'totalRefundAmount': [
            {
              $match: { refundStatus: 'Approved' }
            },
            {
              $group: {
                _id: null,
                amount: { $sum: '$refundAmount' }
              }
            }
          ]
        }
      }
    ]);
    
    // Get refund request stats
    const refundRequestStats = await RefundRequest.aggregate([
      {
        $facet: {
          'statusCounts': [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          'avgProcessingTime': [
            {
              $match: { 
                processedAt: { $exists: true, $ne: null },
                createdAt: { $exists: true }
              }
            },
            {
              $project: {
                processingTimeHours: { 
                  $divide: [
                    { $subtract: ['$processedAt', '$createdAt'] },
                    3600000 // Convert ms to hours
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                avgTime: { $avg: '$processingTimeHours' }
              }
            }
          ],
          'reasonCategories': [
            {
              $group: {
                _id: '$reason',
                count: { $sum: 1 }
              }
            },
            {
              $sort: { count: -1 }
            },
            {
              $limit: 10
            }
          ]
        }
      }
    ]);
    
    // Calculate refund rate
    const totalOrders = await Order.countDocuments({ isPaid: true });
    const refundedOrders = await Order.countDocuments({ refundStatus: 'Approved' });
    const refundRate = totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0;
    
    // Return combined stats
    res.status(200).json({
      orderStats: orderStats[0],
      refundRequestStats: refundRequestStats[0],
      refundRate: {
        totalOrders,
        refundedOrders,
        rate: refundRate.toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  updateOrderStatus,
  getOrders,
  getOrderStats,
  requestRefund,
  processRefundRequest,
  getMyRefundRequests,
  getRefundRequestById,
  addRefundMessage,
  uploadRefundEvidence,
  getRefundStats
};