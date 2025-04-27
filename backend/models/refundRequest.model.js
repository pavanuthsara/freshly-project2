// backend/models/refundRequest.model.js

import mongoose from 'mongoose';

const refundRequestSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Buyer'
    },
    reason: {
      type: String,
      required: true
    },
    items: [
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
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminNotes: {
      type: String
    },
    processedAt: {
      type: Date
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    refundAmount: {
      type: Number,
      default: 0.0
    },
    evidence: [
      {
        type: String // URLs to images or documents uploaded as evidence
      }
    ],
    communication: [
      {
        message: { type: String },
        sender: { 
          type: String, 
          enum: ['customer', 'admin'] 
        },
        timestamp: { 
          type: Date, 
          default: Date.now 
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Add indexes for performance
refundRequestSchema.index({ order: 1 });
refundRequestSchema.index({ user: 1 });
refundRequestSchema.index({ status: 1 });
refundRequestSchema.index({ createdAt: -1 });

const RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);

export default RefundRequest;