import Driver from '../models/driver.model.js';
import jwt from 'jsonwebtoken';

const driverProtect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies.jwt) {
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
    req.driver = await Driver.findById(decodedToken.userId).select('-password');
    if (!req.driver) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Driver not found.');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { driverProtect }; 