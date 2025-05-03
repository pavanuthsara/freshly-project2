import Review from '../models/review.model.js';

// Get review by order ID
const getReviewByOrder = async (req, res) => {
  try {
    const review = await Review.findOne({ order: req.params.orderId });
    if (!review) return res.status(404).json({ message: 'No review found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { order, rating, comment } = req.body;
    // You may want to get user from req.user if using auth middleware
    const user = req.user ? req.user._id : req.body.user;
    const review = new Review({ order, user, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating, comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { getReviewByOrder, createReview, updateReview, deleteReview }; 