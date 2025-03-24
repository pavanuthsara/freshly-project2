import jwt from 'jsonwebtoken';
import Farmer from '../models/farmer.model.js';

const generateProductID = () => {
    return `PROD-${Math.random().toString(36).substr(2, 9)}`;
  };
  
export default generateProductID;