import mongoose from 'mongoose';

// Define schema for individual cart items
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  qty: {
    type: Number,
    required: true,
    default: 1
  }
});

// Define the schema for buyers
const buyerSchema = new mongoose.Schema(
  {
    // Buyer's name
    name: {
      type: String,
      required: true
    },
    // Buyer's email, must be unique
    email: {
      type: String,
      required: true,
      unique: true
    },
    // Buyer's password
    password: {
      type: String,
      required: true
    },
    // Buyer's cart (array of products with quantity)
    cart: [cartItemSchema]
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Create and export the Buyer model
const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;
