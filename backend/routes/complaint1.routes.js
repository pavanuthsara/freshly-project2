import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  addComplaint,
  showAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  generatePDF,
} from '../controllers/complaint1.controller.js';

const router = express.Router();

router.post('/complaints', protect, addComplaint);
router.get('/complaints', protect, showAllComplaints);
router.get('/complaints/:id', protect, getComplaintById);
router.put('/complaints/:id', protect, updateComplaint);
router.delete('/complaints/:id', protect, deleteComplaint);
router.get('/complaints/generate-pdf', protect, generatePDF)

export default router; 