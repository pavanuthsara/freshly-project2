import mongoose from 'mongoose';
import generateProductID from '../../utils/productListingUtils/generateProudctIDs.util.js';

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      required: true,
      unique: true,
      default: generateProductID,
    },
    farmer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, 'Price must be greater than 0'],
    },
    countInStock: {
      type: Number,
      required: true,
      min: [1, 'Minimum stock is 1 kilo'],
    },
    certification: {
      type: String,
      required: true,
      enum: ['Organic', 'GAP'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;