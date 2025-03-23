import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
//import User from '../models/userModel.js';
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

    // Check if the token belongs to a user or a driver
    if (decoded.userId) {
      req.user = await User.findById(decoded.userId).select('-password');
    } else if (decoded.driverId) {
      req.driver = await Driver.findById(decoded.driverId).select('-password');
    } else {
      res.status(401);
      throw new Error('Authentication failed: Invalid token payload.');
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

export { protect, admin};