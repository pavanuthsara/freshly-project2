import User from '../models/buyer.model.js';

// @desc Add or update item in cart
// @route POST /api/cart
// @access Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user._id);

    const itemExists = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (itemExists) {
      itemExists.qty = qty; // ✅ Overwrite the quantity with latest value
    } else {
      user.cart.push({ product: productId, qty });
    }

    await user.save();
    await user.populate('cart.product'); // ✅ Include product details
    res.status(200).json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc Get user's cart
// @route GET /api/cart
// @access Private
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const filteredCart = user.cart.filter(item => item.product !== null); // optional: remove missing products
    res.status(200).json(filteredCart);
  } catch (error) {
    next(error);
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();
    await user.populate('cart.product'); // ensure consistent response
    res.status(200).json(user.cart);
  } catch (error) {
    next(error);
  }
};

export { addToCart, getCart, removeFromCart };
