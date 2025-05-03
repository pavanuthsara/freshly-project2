import express from 'express';
import reviewController from '../controllers/review.controller.js';
const router = express.Router();

// Get review by order ID
router.get('/order/:orderId', reviewController.getReviewByOrder);
// Create a review
router.post('/', reviewController.createReview);
// Update a review
router.put('/:reviewId', reviewController.updateReview);
// Delete a review
router.delete('/:reviewId', reviewController.deleteReview);

export default router; 