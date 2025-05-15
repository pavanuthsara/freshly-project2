import Admin from '../models/adminModel.js';
import User from '../models/buyer.model.js';
import Order from '../models/orderModel.js';
import RefundRequest from '../models/refundRequest.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password)) && user.isAdmin) {
      const token = generateToken(res, user._id);

      res.json({
        admin: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin ?? user.isAdmin;
      user.isActive = req.body.isActive ?? user.isActive;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');
    
    const totalUsers = await User.countDocuments({ isAdmin: false });
    console.log('Total users:', totalUsers);
    
    const totalOrders = await Order.countDocuments();
    console.log('Total orders:', totalOrders);
    
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    console.log('Total revenue aggregation:', totalRevenue);
    
    const pendingRefunds = await Order.countDocuments({ refundStatus: 'pending' });
    console.log('Pending refunds:', pendingRefunds);

    const stats = {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingRefunds
    };
    
    console.log('Final stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all refund requests
// @route   GET /api/admin/refunds
// @access  Private/Admin
export const getAllRefundRequests = async (req, res) => {
  try {
    // Find orders that have a refund request and are paid
    const refunds = await Order.find({ 
      isPaid: true,
      refundStatus: { $exists: true, $ne: null }
    })
      .populate('user', 'name email')
      .sort({ refundRequestedAt: -1 });
    
    console.log('Found refunds:', refunds); // Debug log
    res.json(refunds);
  } catch (error) {
    console.error('Error fetching refunds:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process refund request
// @route   PUT /api/admin/refunds/:id/process
// @access  Private/Admin
export const processRefundRequest = async (req, res) => {
  try {
    const { status, adminReason } = req.body;
    const refundRequest = await RefundRequest.findById(req.params.id)
      .populate('order', 'totalPrice');
    
    if (!refundRequest) {
      res.status(404);
      throw new Error('Refund request not found');
    }

    if (refundRequest.status !== 'Pending') {
      res.status(400);
      throw new Error('This refund request has already been processed');
    }

    if (!adminReason) {
      res.status(400);
      throw new Error('Please provide a reason for your decision');
    }

    refundRequest.status = status;
    refundRequest.adminNotes = adminReason;
    refundRequest.processedAt = new Date();
    refundRequest.processedBy = req.user._id;
    
    if (status === 'Approved') {
      refundRequest.refundAmount = refundRequest.order.totalPrice;
    }

    const updatedRefund = await refundRequest.save();
    res.json(updatedRefund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new admin (only accessible by existing admins)
// @route   POST /api/admin/register
// @access  Private/Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with admin privileges
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true
    });

    if (user) {
      const token = generateToken(res, user._id);

      res.status(201).json({
        admin: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 