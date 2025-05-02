import express from 'express';
import multer from 'multer';
import path from 'path';
import { farmerProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

// File Filter: Accept only images
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed!'), false);
  }
};

// Multer Upload Instance
const upload = multer({ storage, fileFilter }).single('image');

// Upload Route
router.post('/', farmerProtect, (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: `/${req.file.path.replace(/\\/g, '/')}`
    });
  });
});

export default router;
