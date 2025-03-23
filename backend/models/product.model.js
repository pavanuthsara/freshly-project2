// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
    unique: true
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
  min: [0.01, "Price must be greater than 0"]
},

// Quantity available in stock
quantity: {
  type: Number,
  required: true,
  min: [1, "Minimum quantity is 1 kilo"]
},
certification: {
  type: String,
  required: true,
  enum: ['Organic', 'GAP'], // these are some certificates to you know validate the product
},

farmer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Farmer',
  required: true,
},



},
{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);