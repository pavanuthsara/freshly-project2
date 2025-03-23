import Product from "../models/productModel.js";
import generateProductID from "../utils/generateProductID.js";

const createProduct = async (req, res) => {
  const { name, description, image, quantity, price, category, certification } = req.body;

  try {
    // Generate a unique product ID
    const productID = generateProductID();

    // Create a new product
    const product = new Product({
      productID,
      name,
      description,
      image,
      quantity,
      price,
      category,
      certification,
      farmer: req.farmer._id, // Link product to the farmer
    });

    // Save the product
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createProduct };

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find({ category: req.params.category })
      .skip(skip)
      .limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};