// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
    unique: true
    },
    
// Reference to the user who created the product
user: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'User'
},
// Name of the product
name: {
  type: String,
  required: true
},
// Image URL of the product
image: {
  type: String,
  required: true
},
// Description of the product
description: {
  type: String,
  required: true
},

// Category of the product
category: {
  type: String,
  required: true
},

// Price of the product
price: {
  type: Number,
  required: true,
  default: 0
},

// Quantity available in stock
countInStock: {
  type: Number,
  required: true,
  default: 0
},


},
{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);