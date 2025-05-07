import express from 'express';
const router = express.Router();
import {createReview, getBuyerReviews, updateReview, deleteReview} from '../controllers/reviews.controller.js'; // Adjust the path as necessary
import { protect } from '../middleware/auth.middleware.js'; // Adjust the path as necessary
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, upload.fields([{ name: 'pictures', maxCount: 3 }]), createReview);
router.get('/', protect, getBuyerReviews);
router.put('/:reviewId', protect, upload.fields([{ name: 'pictures', maxCount: 3 }]), updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;