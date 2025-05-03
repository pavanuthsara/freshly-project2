import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoTrashOutline, IoCartOutline, IoArrowBackOutline } from 'react-icons/io5';

const CartPage = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Debug: Log props received
  useEffect(() => {
    console.log('CartPage received cartItems:', cartItems);
  }, [cartItems]);

  // Load cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/cart', {
          withCredentials: true
        });
        // Store in state and localStorage
        setCartItems(data);
        localStorage.setItem('cartItems', JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Unable to load your cart. Please try again later.');
        setLoading(false);
        
        // If API fails, try to use localStorage as fallback
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          console.log('Using cached cart from localStorage');
          setCartItems(JSON.parse(savedCart));
        }
      }
    };
    
    fetchCart();
  }, [setCartItems]);

  // Remove product from backend
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/cart/${productId}`, {
        withCredentials: true
      });
      // Update both state and localStorage
      setCartItems(data);
      localStorage.setItem('cartItems', JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Failed to remove item. Please try again.');
      setLoading(false);
      
      // Fallback: Remove locally if API fails
      if (error) {
        const updatedCart = cartItems.filter(
          item => (item.product?._id || item._id) !== productId
        );
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    }
  };

  // Update quantity via backend
  const updateQty = async (productId, qty) => {
    const numericQty = Number(qty);
    if (!numericQty || numericQty < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/cart',
        { productId, qty: numericQty },
        { withCredentials: true }
      );
      // Update both state and localStorage
      setCartItems(data);
      localStorage.setItem('cartItems', JSON.stringify(data));
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Failed to update quantity. Please try again.');
      setLoading(false);
      
      // Fallback: Update locally if API fails
      if (error) {
        const updatedCart = cartItems.map(item => 
          (item.product?._id || item._id) === productId 
            ? { ...item, qty: numericQty } 
            : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }
    
    // Mock promo code application (would connect to backend in real implementation)
    setPromoApplied(true);
    setError('');
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product;
    return product ? acc + item.qty * product.price : acc;
  }, 0);

  // Calculate estimated tax (example: 10%)
  const tax = subtotal * 0.1;
  
  // Calculate estimated shipping (free over Rs. 1000)
  const shipping = subtotal > 1000 ? 0 : 150;
  
  // Apply mock discount if promo is applied
  const discount = promoApplied ? subtotal * 0.05 : 0;
  
  // Calculate total
  const total = subtotal + tax + shipping - discount;

  // Navigate to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    
    // Make sure cart is saved to localStorage before navigating
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Navigating to shipping page, cart saved:', cartItems);
    
    navigate('/buyer/shipping');
  };

  // Continue shopping
  const continueShopping = () => {
    navigate('/products');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mr-3"></div>
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <div className="ml-4 h-1 w-24 bg-gradient-to-r from-teal-500 to-teal-600 rounded"></div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center backdrop-blur-sm bg-opacity-90">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCartOutline className="text-teal-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your cart yet. Start exploring our fresh products!</p>
            <button
              onClick={continueShopping}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <div className="flex items-center justify-center space-x-2">
                <IoArrowBackOutline className="text-xl" />
                <span>Start Shopping</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden backdrop-blur-sm bg-opacity-90">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <tr key={item.product?._id || item._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-6 px-6">
                            <div className="flex items-center">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 mr-4">
                                <img 
                                  src={item.product?.image} 
                                  alt={item.product?.name}
                                  className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-gray-800 hover:text-teal-600 transition-colors">
                                  {item.product?.name}
                                </h3>
                                <span className="text-xs bg-gradient-to-r from-teal-50 to-teal-100 inline-block px-3 py-1 mt-2 text-teal-700 rounded-full font-medium">
                                  {item.product?.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-right font-medium text-gray-700">
                            {formatCurrency(item.product?.price)}
                          </td>
                          <td className="py-6 px-6">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => updateQty(item.product?._id, Math.max(1, item.qty - 1))}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                -
                              </button>
                              <input
                                type="text"
                                value={item.qty}
                                onChange={(e) => updateQty(item.product?._id, e.target.value)}
                                className="w-16 h-10 text-center border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                              <button 
                                onClick={() => updateQty(item.product?._id, item.qty + 1)}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-right font-semibold text-gray-800">
                            {formatCurrency(item.product?.price * item.qty)}
                          </td>
                          <td className="py-6 px-6">
                            <button
                              onClick={() => removeFromCart(item.product?._id)}
                              className="group rounded-full p-2 hover:bg-red-50 transition-colors duration-300"
                            >
                              <IoTrashOutline className="text-xl text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order summary section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 backdrop-blur-sm bg-opacity-90">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Promo code section */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Summary calculations */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-teal-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Proceed to Checkout
                </button>

                {/* Continue shopping link */}
                <button
                  onClick={continueShopping}
                  className="w-full mt-4 bg-transparent border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <IoArrowBackOutline className="text-xl" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;