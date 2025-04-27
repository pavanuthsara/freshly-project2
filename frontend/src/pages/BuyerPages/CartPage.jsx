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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoCartOutline className="text-gray-500 text-3xl" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <button
            onClick={continueShopping}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 uppercase">Product</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 uppercase">Price</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 uppercase">Quantity</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 uppercase">Total</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600 uppercase">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.product?._id || item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                              <img 
                                src={item.product?.image} 
                                alt={item.product?.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-gray-800">{item.product?.name}</h3>
                              <span className="text-xs bg-gray-100 inline-block px-2 py-1 mt-1 text-gray-600 rounded">
                                {item.product?.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-700">
                          {formatCurrency(item.product?.price)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => updateQty(item.product?._id, Math.max(1, item.qty - 1))}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.qty}
                              onChange={(e) => updateQty(item.product?._id, e.target.value)}
                              className="w-10 h-8 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                            <button
                              onClick={() => updateQty(item.product?._id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-gray-800">
                          {formatCurrency(item.product?.price * item.qty)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.product?._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <IoTrashOutline className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={continueShopping}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                <IoArrowBackOutline className="mr-2" />
                Continue Shopping
              </button>
            </div>
          </div>
          
          {/* Order summary section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between items-center text-teal-600">
                    <span>Discount (5%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                {shipping > 0 && (
                  <div className="bg-teal-50 text-teal-600 text-sm p-3 my-2 rounded-md">
                    Add {formatCurrency(1000 - subtotal)} more for free shipping
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-teal-700">{formatCurrency(total)}</span>
                </div>
              </div>
              
              {/* Promo code section */}
              <div className="mt-6">
                <p className="font-medium text-gray-700 mb-2">Promo Code</p>
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter your code"
                    className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button 
                    onClick={applyPromoCode}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-r transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-teal-600 mt-2">Promo code applied successfully!</p>
                )}
              </div>
              
              {/* Checkout button */}
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-md font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
              
              {/* Payment methods */}
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>Secure payment options</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;