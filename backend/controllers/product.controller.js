import Product from '../models/product.model.js';
import { deleteFile } from '../utils/file.js';

// @desc     Fetch All Products
// @method   GET
// @endpoint /api/products?limit=2&skip=0
// @access   Public
const getProducts = async (req, res, next) => {
  try {
    const total = await Product.countDocuments();
    const maxLimit = parseInt(process.env.PAGINATION_MAX_LIMIT) || 10;
    const maxSkip = total === 0 ? 0 : total - 1;
    const limit = Number(req.query.limit) || maxLimit;
    const skip = Number(req.query.skip) || 0;
    const search = req.query.search || '';

    const products = await Product.find({
      name: { $regex: search, $options: 'i' } // Case-insensitive search
    })
      .limit(limit > maxLimit ? maxLimit : limit) // Limit results
      .skip(skip > maxSkip ? maxSkip : skip < 0 ? 0 : skip); // Skip results

    if (!products || products.length === 0) {
      res.statusCode = 404;
      throw new Error('Products not found!');
    }

    res.status(200).json({
      products,
      total,
      maxLimit,
      maxSkip
    });
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
};

// @desc     Fetch Products by Category
// @method   GET
// @endpoint /api/products/category/:category
// @access   Public
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    if (!products || products.length === 0) {
      res.statusCode = 404;
      throw new Error(`No products found in category: ${category}`);
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch Single Product
// @method   GET
// @endpoint /api/products/:id
// @access   Public
const getProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc     Create product
// @method   POST
// @endpoint /api/farmerProducts
// @access   Private (Farmer only)
const createProduct = async (req, res, next) => {
  try {
    const { name, image, description, category, price, quantity,certification } = req.body;

    const product = new Product({
      farmer: {
        id: req.farmer._id, // Farmer's ID
        name: req.farmer.name, // Farmer's name
      },
      name,
      image,
      description,
      category,
      price,
      quantity,
      certification: certification || 'Organic', // Default certification is Organic
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Product created', createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc     Update product
// @method   PUT
// @endpoint /api/farmerProducts/:id
// @access   Private (Farmer only)
const updateProduct = async (req, res, next) => {
  try {
    const { name, image, description, brand, category, price, quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    // Check if the product belongs to the authenticated farmer
    if (product.farmer.id.toString() !== req.farmer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to update this product.');
    }

    const previousImage = product.image;

    product.name = name || product.name;
    product.image = image || product.image;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;

    const updatedProduct = await product.save();

    if (previousImage && previousImage !== updatedProduct.image) {
      deleteFile(previousImage); // Delete the old image file
    }

    res.status(200).json({ message: 'Product updated', updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc     Delete product
// @method   DELETE
// @endpoint /api/farmerProducts/:id
// @access   Private (Farmer only)
const deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    // Check if the product belongs to the authenticated farmer
    if (product.farmer.id.toString() !== req.farmer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to delete this product.');
    }

    await Product.deleteOne({ _id: product._id });
    deleteFile(product.image); // Delete the associated image file

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch Farmer's Products
// @method   GET
// @endpoint /api/farmerProducts/products?limit=2&skip=0
// @access   Private (Farmer only)
const getFarmerProducts = async (req, res, next) => {
  try {
    // Ensure we have the farmer from middleware
    if (!req.farmer.id || !req.farmer._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const farmerId = req.farmer._id;
    
    // Build query object
    const query = { 
      'farmer.id': farmerId // This must match your schema
    };

    // Add search filter if provided
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Count total products for this farmer
    const total = await Product.countDocuments(query);

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductsByCategory,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts
};