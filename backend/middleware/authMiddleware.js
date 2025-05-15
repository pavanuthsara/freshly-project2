// backend/middleware/authMiddleware.js

import Buyer from '../models/buyer.model.js';
import jwt from 'jsonwebtoken';

// Middleware to protect routes by verifying JWT authentication token.
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // If no token in header, check cookies
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Token not provided.');
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decodedToken) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Invalid token.');
    }
    
    req.user = await Buyer.findById(decodedToken.userId).select('-password');
    
    if (!req.user) {
      res.statusCode = 401;
      throw new Error('Authentication failed: User not found.');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is an admin
const admin = (req, res, next) => {
  try {
    // The protect middleware must be used before this middleware
    if (!req.user) {
      res.statusCode = 401;
      throw new Error('Authentication failed: User not authenticated.');
    }
    
    // Check if user has admin status
    if (!req.user.isAdmin) {
      res.statusCode = 403;
      throw new Error('Authorization failed: Admin access required.');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export { protect, admin };