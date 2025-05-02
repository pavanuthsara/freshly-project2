import jwt from 'jsonwebtoken';
import Farmer from '../models/farmer.model.js';
import Buyer from '../models/buyer.model.js';

// Common authentication middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find the user (either farmer or buyer)
    const farmer = await Farmer.findById(decoded.id).select('-password');
    const buyer = await Buyer.findById(decoded.id).select('-password');

    if (!farmer && !buyer) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach the appropriate user to the request
    if (farmer) {
      req.user = farmer;
      req.userType = 'farmer';
    } else {
      req.user = buyer;
      req.userType = 'buyer';
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Farmer-specific middleware
export const farmerProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const farmer = await Farmer.findById(decoded.id).select('-password');

    if (!farmer) {
      return res.status(401).json({ message: 'Not authorized, farmer not found' });
    }

    req.farmer = farmer;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Buyer-specific middleware
export const buyerProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const buyer = await Buyer.findById(decoded.userId).select('-password');

    if (!buyer) {
      return res.status(401).json({ message: 'Not authorized, buyer not found' });
    }

    req.buyer = buyer;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Admin middleware
export const admin = async (req, res, next) => {
  try {
    // Check if buyer exists and has admin status
    if (!req.buyer || !req.buyer.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
}; 