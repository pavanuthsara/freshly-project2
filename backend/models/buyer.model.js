import mongoose from 'mongoose';

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
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create the Buyer model
const Buyer = mongoose.model('Buyer', buyerSchema);

// Export the Buyer model
export default Buyer;
