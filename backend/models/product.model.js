import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      required: true,
      unique: true,
      default: () => `PROD-${Date.now()}`, // Auto-generate productID
    },

    // Reference to the farmer who created the product
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },

    // Reference to the buyer (optional, if needed)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
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

    quantity: {
      type: Number,
      required: true,
      min: [1, 'Minimum quantity is 1 kilo'],
    },

    certification: {
      type: String,
      required: true,
      enum: ['Organic', 'GAP'], // Valid certifications
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;