import Review from '../models/review.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/reviews directory exists
const reviewsDir = path.join(__dirname, '..', 'uploads', 'reviews');
if (!fs.existsSync(reviewsDir)) {
  fs.mkdirSync(reviewsDir, { recursive: true });
}

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { orderId, description, rating } = req.body;
    const buyerId = req.user._id; // Assuming user is authenticated and ID is available
    const pictures = [];

    // Handle file uploads
    if (req.files && req.files.pictures) {
      const files = Array.isArray(req.files.pictures) ? req.files.pictures : [req.files.pictures];
      if (files.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 pictures allowed.' });
      }

      for (const file of files) {
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({ message: 'Only image files are allowed.' });
        }
        const filePath = `/uploads/reviews/${Date.now()}_${file.originalname}`;
        fs.writeFileSync(path.join(__dirname, '..', filePath), file.buffer); // Use file.buffer for memory storage
        pictures.push(filePath);
      }
    }

    const review = new Review({
      orderId,
      buyerId,
      description,
      rating,
      pictures,
    });

    await review.save();
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// Get all reviews for a buyer
export const getBuyerReviews = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const reviews = await Review.find({ buyerId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { description, rating } = req.body;
    const buyerId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, buyerId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }

    // Update fields
    review.description = description || review.description;
    review.rating = rating || review.rating;

    // Handle picture updates
    if (req.files && req.files.pictures) {
      // Delete old pictures
      review.pictures.forEach((pic) => {
        const filePath = path.join(__dirname, '..', pic);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      const files = Array.isArray(req.files.pictures) ? req.files.pictures : [req.files.pictures];
      if (files.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 pictures allowed.' });
      }

      const newPictures = [];
      for (const file of files) {
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({ message: 'Only image files are allowed.' });
        }
        const filePath = `/uploads/reviews/${Date.now()}_${file.originalname}`;
        fs.writeFileSync(path.join(__dirname, '..', filePath), file.buffer);
        newPictures.push(filePath);
      }
      review.pictures = newPictures;
    }

    await review.save();
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const buyerId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, buyerId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }

    // Delete associated pictures
    review.pictures.forEach((pic) => {
      const filePath = path.join(__dirname, '..', pic);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};