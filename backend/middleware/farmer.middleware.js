import Farmer from '../models/farmer.model.js';
import jwt from 'jsonwebtoken';

const farmerProtect = async (req, res, next) => {
  try {
    console.log('All cookies:', req.cookies); // Log all cookies
    console.log('Headers:', req.headers); // Log all headers
    // Extract token from cookies
    const token = req.cookies.jwt;
    console.log('Token from cookie:', token); // Debugging: Log the token

    if (!token) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Token not provided.');
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decodedToken); // Debugging: Log the decoded token
    } catch (error) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Invalid token.');
    }

    // Find the farmer in the database
    const farmer = await Farmer.findById(decodedToken.userId).select('-password');
    console.log('Farmer:', farmer); // Debugging: Log the farmer

    if (!farmer) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Farmer not found.');
    }

    // Attach the farmer to the request object
    req.farmer = farmer;
    next();
  } catch (error) {
    console.error('Error in farmerProtect middleware:', error.message); // Debugging: Log the error
    next(error);
  }
};

export { farmerProtect };