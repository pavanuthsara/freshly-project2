import express from 'express';
const router = express.Router();

// Placeholder route
router.get('/profile', (req, res) => {
  res.json({ message: 'Seller profile route' });
});

export default router; 