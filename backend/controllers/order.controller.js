// backend/controllers/order.controller.js

import Order from '../models/order.model.js';
import Buyer from '../models/buyer.model.js';
import RefundRequest from '../models/refundRequest.model.js';
import DeliveryRequest from '../models/deliveryModels/deliveryRequest.model.js';
import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';

// @desc     Create delivery request for an order
// @route    POST /api/v1/orders/:id/delivery-request
// @access   Private
const createDeliveryRequest = async (order) => {
  try {
    // Calculate total weight from order items (assuming each item has a weight property)
    const totalWeight = Math.floor(Math.random() * (500 - 10 + 1)) + 10;;

    // Create delivery request
    const deliveryRequest = new DeliveryRequest({
      deliveryId: `DEL-${Date.now()}`,
      buyerId: order.user,
      farmerId: order.orderItems[0].product, // Assuming first item's product belongs to the farmer
      weight: totalWeight,
      pickup: order.shippingAddress.address, // Using shipping address as pickup point
      dropOff: order.shippingAddress.address, // Using shipping address as drop-off point
      status: 'pending'
    });

    await deliveryRequest.save();
    return deliveryRequest;
  } catch (error) {
    console.error('Error creating delivery request:', error);
    throw error;
  }
};

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
      user: req.user._id,
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

    // 5) Create delivery request for the order
    await createDeliveryRequest(createdOrder);

    // 6) Empty the cart of the current user (Buyer)
    const buyer = await Buyer.findById(req.user._id).session(session);
    if (buyer) {
      buyer.cart = [];
      await buyer.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    
    // 7) Return the newly created order
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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

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
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
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

// @desc     Cancel order
// @route    PUT /api/v1/orders/:id/cancel
// @access   Private
const cancelOrder = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { reason } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }
    
    if (!reason || reason.length < 10) {
      res.statusCode = 400;
      throw new Error('Please provide a detailed cancellation reason (minimum 10 characters)');
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found');
    }
    
    // Check if user is authorized to cancel this order
    if (order.user.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to cancel this order');
    }
    
    // Check if order can be cancelled
    if (order.isPaid) {
      res.statusCode = 400;
      throw new Error('Cannot cancel a paid order. Please request a refund instead.');
    }
    
    if (order.status !== 'Pending') {
      res.statusCode = 400;
      throw new Error('Only pending orders can be cancelled');
    }
    
    // Update order status
    order.status = 'Cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    order.cancelledBy = req.user._id;
    
    // Add to cancellation history
    order.cancellationHistory = order.cancellationHistory || [];
    order.cancellationHistory.push({
      reason,
      cancelledBy: req.user._id,
      cancelledAt: new Date()
    });
    
    await order.save();
    
    // Notify admin about cancellation
    await Notification.create({
      user: req.user._id,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: `Order #${order._id} has been cancelled by ${req.user.name}`,
      data: {
        orderId: order._id,
        reason
      }
    });
    
    res.status(200).json({
      message: 'Order cancelled successfully',
      order: {
        _id: order._id,
        status: order.status,
        cancellationReason: order.cancellationReason,
        cancelledAt: order.cancelledAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Request refund for an order
// @route    POST /api/v1/orders/:id/refund-request
// @access   Private
const requestRefund = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { reason, items, evidence, refundAmount } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.statusCode = 400;
      throw new Error('Invalid order ID format');
    }
    
    if (!reason || reason.length < 10) {
      res.statusCode = 400;
      throw new Error('Please provide a detailed refund reason (minimum 10 characters)');
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found');
    }
    
    // Check if this is the user's order
    if (order.user.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to request refund for this order');
    }
    
    // Check if order is eligible for refund
    if (!order.isPaid) {
      res.statusCode = 400;
      throw new Error('Cannot request refund for an unpaid order');
    }
    
    if (order.status === 'Cancelled') {
      res.statusCode = 400;
      throw new Error('Cannot request refund for a cancelled order');
    }
    
    // Check if a refund request already exists
    const existingRequest = await RefundRequest.findOne({ 
      order: orderId, 
      status: { $nin: ['Rejected'] } 
    });
    
    if (existingRequest) {
      res.statusCode = 400;
      throw new Error('A refund request for this order is already in progress');
    }
    
    // Validate refund amount if provided
    if (refundAmount && (refundAmount <= 0 || refundAmount > order.totalPrice)) {
      res.statusCode = 400;
      throw new Error('Invalid refund amount');
    }
    
    // Create refund request
    const refundRequest = new RefundRequest({
      order: orderId,
      user: req.user._id,
      reason,
      items: items || order.orderItems,
      status: 'Pending',
      evidence: evidence || [],
      refundAmount: refundAmount || order.totalPrice,
      communication: [{
        message: reason,
        sender: 'customer',
        timestamp: new Date()
      }]
    });
    
    await refundRequest.save();
    
    // Update order status
    order.refundRequested = true;
    order.refundRequestedAt = new Date();
    order.refundStatus = 'Pending';
    order.refundReason = reason;
    await order.save();
    
    // Notify admin about refund request
    await Notification.create({
      user: req.user._id,
      type: 'refund_requested',
      title: 'New Refund Request',
      message: `New refund request for Order #${order._id} from ${req.user.name}`,
      data: {
        orderId: order._id,
        refundRequestId: refundRequest._id,
        reason
      }
    });
    
    res.status(201).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Process refund request (approve/reject)
// @route    PUT /api/v1/orders/refund-requests/:id
// @access   Private/Admin
const processRefundRequest = async (req, res, next) => {
  try {
    const { id: requestId } = req.params;
    const { status, adminNotes, refundAmount, message } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.statusCode = 400;
      throw new Error('Invalid request ID format');
    }
    
    if (!status || !['Processing', 'Approved', 'Rejected'].includes(status)) {
      res.statusCode = 400;
      throw new Error('Valid status (Approved/Rejected/Processing) is required');
    }
    
    const refundRequest = await RefundRequest.findById(requestId);
    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }
    
    // Update refund request
    refundRequest.status = status;
    if (adminNotes) refundRequest.adminNotes = adminNotes;
    refundRequest.processedAt = new Date();
    refundRequest.processedBy = req.user._id;
    
    // Add communication if message provided
    if (message) {
      refundRequest.communication.push({
        message,
        sender: 'admin',
        timestamp: new Date()
      });
    }
    
    // If a specific refund amount is provided
    if (refundAmount !== undefined && status === 'Approved') {
      refundRequest.refundAmount = refundAmount;
    }
    
    await refundRequest.save();
    
    // Update the order based on the refund request status
    const order = await Order.findById(refundRequest.order);
    if (order) {
      order.refundStatus = status;
      
      if (status === 'Approved') {
        order.refundProcessedAt = new Date();
        order.refundAmount = refundAmount || order.totalPrice;
        // If it's a full refund, update the order status
        if (!refundAmount || refundAmount >= order.totalPrice) {
          order.status = 'Refunded';
        }
      } else if (status === 'Rejected') {
        order.refundRequested = false; // Can request again if rejected
      }
      
      await order.save();
    }
    
    res.status(200).json({
      refundRequest,
      order: {
        _id: order._id,
        status: order.status,
        refundStatus: order.refundStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get all refund requests
// @route    GET /api/v1/orders/refund-requests
// @access   Private/Admin
const getRefundRequests = async (req, res, next) => {
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
    
    const refundRequests = await RefundRequest.find(filterOptions)
      .populate('order', 'orderItems totalPrice isPaid createdAt status')
      .populate('user', 'name email')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalRequests = await RefundRequest.countDocuments(filterOptions);
    
    res.status(200).json({
      refundRequests,
      page,
      pages: Math.ceil(totalRequests / limit) || 1,
      total: totalRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get my refund requests
// @route    GET /api/v1/orders/my-refund-requests
// @access   Private
const getMyRefundRequests = async (req, res, next) => {
  try {
    const refundRequests = await RefundRequest.find({ user: req.user._id })
      .populate('order', 'orderItems totalPrice isPaid createdAt status')
      .sort({ createdAt: -1 });
    
    res.status(200).json(refundRequests);
  } catch (error) {
    next(error);
  }
};

// @desc     Get refund request by ID
// @route    GET /api/v1/orders/refund-requests/:id
// @access   Private
const getRefundRequestById = async (req, res, next) => {
  try {
    const { id: requestId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.statusCode = 400;
      throw new Error('Invalid request ID format');
    }
    
    const refundRequest = await RefundRequest.findById(requestId)
      .populate('order')
      .populate('user', 'name email')
      .populate('processedBy', 'name email');
    
    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }
    
    // Check if user is authorized to view this request
    if (req.user.role !== 'admin' && refundRequest.user._id.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to access this refund request');
    }
    
    res.status(200).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Add message to refund request communication
// @route    POST /api/v1/orders/refund-requests/:id/message
// @access   Private
const addRefundMessage = async (req, res, next) => {
  try {
    const { id: requestId } = req.params;
    const { message } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.statusCode = 400;
      throw new Error('Invalid request ID format');
    }
    
    if (!message) {
      res.statusCode = 400;
      throw new Error('Message content is required');
    }
    
    const refundRequest = await RefundRequest.findById(requestId);
    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }
    
    // Check if user has permission to add message
    const isAdmin = req.user.role === 'admin';
    const isOwner = refundRequest.user.toString() === req.user._id.toString();
    
    if (!isAdmin && !isOwner) {
      res.statusCode = 403;
      throw new Error('Not authorized to add messages to this refund request');
    }
    
    // Determine sender role (admin or customer)
    const senderRole = isAdmin ? 'admin' : 'customer';
    
    // Add message to communication array
    refundRequest.communication.push({
      message,
      sender: senderRole,
      timestamp: new Date()
    });
    
    await refundRequest.save();
    
    res.status(200).json(refundRequest);
  } catch (error) {
    next(error);
  }
};

// @desc     Upload evidence for refund request
// @route    POST /api/v1/orders/refund-requests/:id/evidence
// @access   Private
const uploadRefundEvidence = async (req, res, next) => {
  try {
    const { id: requestId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.statusCode = 400;
      throw new Error('Invalid request ID format');
    }
    
    if (!req.files || req.files.length === 0) {
      res.statusCode = 400;
      throw new Error('Please upload at least one file');
    }
    
    const refundRequest = await RefundRequest.findById(requestId);
    if (!refundRequest) {
      res.statusCode = 404;
      throw new Error('Refund request not found');
    }
    
    // Check if user has permission to add evidence
    if (refundRequest.user.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to add evidence to this refund request');
    }
    
    // Check if refund is in a state where evidence can be added
    if (['Approved', 'Rejected'].includes(refundRequest.status)) {
      res.statusCode = 400;
      throw new Error(`Cannot add evidence to a refund request that is already ${refundRequest.status.toLowerCase()}`);
    }
    
    // Get file paths and add to evidence array
    const filePaths = req.files.map(file => file.path);
    refundRequest.evidence = [...refundRequest.evidence, ...filePaths];
    
    await refundRequest.save();
    
    res.status(200).json({
      message: 'Evidence uploaded successfully',
      evidence: refundRequest.evidence
    });
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
  cancelOrder,
  requestRefund,
  processRefundRequest,
  getRefundRequests,
  getMyRefundRequests,
  getRefundRequestById,
  addRefundMessage,
  uploadRefundEvidence,
  getRefundStats
};