import Product from '../models/product.model.js';
import { deleteFile } from '../utils/file.js';

const getProducts = async (req, res, next) => {
  try {
    const total = await Product.countDocuments();
    const maxLimit = parseInt(process.env.PAGINATION_MAX_LIMIT) || 10;
    const maxSkip = total === 0 ? 0 : total - 1;
    const limit = Number(req.query.limit) || maxLimit;
    const skip = Number(req.query.skip) || 0;
    const search = req.query.search || '';

    const products = await Product.find({
      name: { $regex: search, $options: 'i' }
    })
      .limit(limit > maxLimit ? maxLimit : limit)
      .skip(skip > maxSkip ? maxSkip : skip < 0 ? 0 : skip);

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
    next(error);
  }
};

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

const createProduct = async (req, res, next) => {
  try {
    const { name, image, description, category, price, countInStock, certification } = req.body;

    const product = new Product({
      farmer: {
        id: req.farmer._id,
        name: req.farmer.name,
      },
      name,
      image,
      description,
      category,
      price,
      countInStock,
      certification: certification || 'Organic',
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Product created', createdProduct });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, image, description, category, price, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    if (product.farmer.id.toString() !== req.farmer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to update this product.');
    }

    const previousImage = product.image;

    product.name = name || product.name;
    product.image = image || product.image;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();

    if (previousImage && previousImage !== updatedProduct.image) {
      deleteFile(previousImage);
    }

    res.status(200).json({ message: 'Product updated', updatedProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    if (product.farmer.id.toString() !== req.farmer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to delete this product.');
    }

    await Product.deleteOne({ _id: product._id });
    deleteFile(product.image);

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

const getFarmerProducts = async (req, res, next) => {
  try {
    if (!req.farmer.id || !req.farmer._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const farmerId = req.farmer._id;
    
    const query = { 
      'farmer.id': farmerId
    };

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Product.countDocuments(query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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