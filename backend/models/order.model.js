// backend/models/order.model.js

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Buyer' // updated from 'User'
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        }
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    
    // Order status field
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
      default: 'Pending'
    },
    
    // Refund fields
    refundRequested: {
      type: Boolean,
      default: false
    },
    refundRequestedAt: {
      type: Date
    },
    refundStatus: {
      type: String,
      enum: ['None', 'Pending', 'Processing', 'Approved', 'Rejected'],
      default: 'None'
    },
    refundReason: {
      type: String
    },
    refundProcessedAt: {
      type: Date
    },
    refundAmount: {
      type: Number,
      default: 0.0
    },
    
    // Cancellation fields
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: {
      type: Date
    },
    cancellationReason: {
      type: String
    },
    
    // Optional admin notes
    adminNotes: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ refundStatus: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });
orderSchema.index({ refundRequested: 1 });
orderSchema.index({ isCancelled: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;