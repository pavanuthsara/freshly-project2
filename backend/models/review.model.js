import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    trim: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  pictures: [{
    type: String, // Store file paths or URLs
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;