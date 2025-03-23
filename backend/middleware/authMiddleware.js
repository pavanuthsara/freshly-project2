import User from '../models/buyer.model.js';
import jwt from 'jsonwebtoken';

// Middleware to protect routes by verifying JWT authentication token.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Token not provided.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Invalid token.');
    }

    req.user = await User.findById(decodedToken.userId).select('-password');

    if (!req.user) {
      res.statusCode = 401;
      throw new Error('Authentication failed: User not found.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { protect };
