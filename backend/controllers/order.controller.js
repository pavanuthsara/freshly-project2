// backend/controllers/order.controller.js

import Order from '../models/order.model.js';
import Buyer from '../models/buyer.model.js';

// @desc     Create new order & empty user's cart
// @method   POST
// @endpoint /api/v1/orders
// @access   Private
const addOrderItems = async (req, res, next) => {
  try {
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

    // 2) Create a new Order document
    const order = new Order({
      user: req.user._id, // This should match the ID of the logged-in Buyer
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item.product
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // 3) Save the newly created order
    const createdOrder = await order.save();

    // 4) Empty the cart of the current user (Buyer)
    const buyer = await Buyer.findById(req.user._id);
    if (buyer) {
      buyer.cart = []; // Set cart to empty array
      await buyer.save(); // Save changes in the DB
    }

    // 5) Return the newly created order
    return res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Get logged-in user orders
// @method   GET
// @endpoint /api/v1/orders/my-orders
// @access   Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

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
// @method   GET
// @endpoint /api/v1/orders/:id
// @access   Private
const getOrderById = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to paid
// @method   PUT
// @endpoint /api/v1/orders/:id/pay
// @access   Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.updateTime,
      email_address: req.body.email
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to delivered
// @method   PUT
// @endpoint /api/v1/orders/:id/deliver
// @access   Private
const updateOrderToDeliver = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedDeliver = await order.save();
    res.status(200).json(updatedDeliver);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order status
// @method   PUT
// @endpoint /api/v1/orders/:id/status
// @access   Private
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Get all orders
// @method   GET
// @endpoint /api/v1/orders
// @access   Private
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'id name');

    if (!orders || orders.length === 0) {
      res.statusCode = 404;
      throw new Error('Orders not found!');
    }
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Export all controller functions
export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  updateOrderStatus,
  getOrders
};
