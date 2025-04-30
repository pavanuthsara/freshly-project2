import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Buyer from '../models/buyer.model.js';
import Farmer from '../models/farmer.model.js';
import Driver from '../models/driver.model.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    // Check if the token is provided as a cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Authentication failed: Token not provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Explicitly check each model type
    let user = null;

    // Check Buyer
    user = await Buyer.findById(decoded.userId).select('-password');
    if (user) {
      user.userType = 'Buyer';
      req.user = user;
    }

    // If not a buyer, check Farmer
    if (!user) {
      user = await Farmer.findById(decoded.userId).select('-password');
      if (user) {
        user.userType = 'Farmer';
        req.user = user;
      }
    }

    // If not a farmer, check Driver
    if (!user) {
      user = await Driver.findById(decoded.userId).select('-password');
      if (user) {
        user.userType = 'Driver';
        req.user = user;
      }
    }

    if (!user) {
      res.status(401);
      throw new Error('Authentication failed: User not found.');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Authentication failed: Token verification failed.');
  }
});

// Middleware to check if the user is an admin.
const admin = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      res.statusCode = 401;
      throw new Error('Authorization failed: Not authorized as an admin.');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { protect, admin };