// backend/routes/refund.routes.js

import express from 'express';
import { 
  requestRefund,
  processRefundRequest,
  getRefundRequests,
  getMyRefundRequests,
  getRefundRequestById,
  addRefundMessage,
  uploadRefundEvidence
} from '../controllers/order.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/refund-evidence/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and PDF only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new Error('Only image and PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Request a refund for an order
router.post('/:id/request', protect, requestRefund);

// Get all refund requests (admin only)
router.get('/', protect, admin, getRefundRequests);

// Get logged-in user's refund requests
router.get('/my-requests', protect, getMyRefundRequests);

// Get details of a specific refund request
router.get('/:id', protect, getRefundRequestById);

// Process a refund request (admin only)
router.put('/:id/process', protect, admin, processRefundRequest);

// Add a message to the refund request communication
router.post('/:id/message', protect, addRefundMessage);

// Upload evidence for a refund request
router.post('/:id/evidence', protect, upload.array('evidence', 5), uploadRefundEvidence);

export default router;