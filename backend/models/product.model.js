// backend/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      required: true,
      unique: true,
      default: () => `PROD-${Date.now()}` // Auto-generate productID  
    },

    // Reference to the buyer/farmer/user who created the product (optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      default: 0
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
