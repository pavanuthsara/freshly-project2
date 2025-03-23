const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require('../controllers/product.controller');
const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/category/:category', getProductsByCategory);

module.exports = router;