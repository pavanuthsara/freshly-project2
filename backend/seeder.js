import mongoose from 'mongoose';
import { products } from './data/products.js';
import Product from './models/productModel.js';

// Direct connection string - replace 'freshly' with your database name
const MONGODB_URI = 'mongodb://127.0.0.1:27017/freshly';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // Instead of deleting, we'll just insert new products
    await Product.insertMany(products);
    console.log('New Products Added Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the import
importData(); 