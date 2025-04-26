import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product;
    return product ? acc + item.qty * product.price : acc;
  }, 0);

  // Calculate estimated tax (example: 10%)
  const tax = subtotal * 0.1;
  
  // Calculate estimated shipping (free over Rs. 1000)
  const shipping = subtotal > 1000 ? 0 : 150;
  
  // Calculate total
  const total = subtotal + tax + shipping;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mr-2"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      <div className="w-full">
        {/* Cart items */}
        <div className="mb-8">
          <table className="w-full">
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product?._id || item._id} className="border-b">
                  <td className="py-4 flex items-start">
                    <img 
                      src={item.product?.image} 
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.product?.name}</span>
                      <span className="text-xs bg-gray-100 inline-block px-2 py-1 mt-1 text-gray-600 rounded">
                        {item.product?.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right">Rs. {item.product?.price.toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => updateQty(item.product?._id, Math.max(1, item.qty - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.qty}
                        onChange={(e) => updateQty(item.product?._id, e.target.value)}
                        className="w-8 h-8 text-center border-t border-b border-gray-300"
                      />
                      <button
                        onClick={() => updateQty(item.product?._id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right">Rs. {(item.product?.price * item.qty).toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => removeFromCart(item.product?._id)}
                      className="text-gray-400 hover:text-red-500 text-xl"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Order summary */}
        <div className="max-w-md ml-auto">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Subtotal:</span>
              <span className="text-right">Rs. {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Estimated Tax:</span>
              <span className="text-right">Rs. {tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Shipping:</span>
              <span className="text-right">Rs. {shipping.toFixed(2)}</span>
            </div>
            
            {shipping > 0 && (
              <div className="bg-green-50 text-green-600 text-sm p-2 rounded">
                Add Rs. {(1000 - subtotal).toFixed(2)} more for free shipping
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span className="text-right">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={continueShopping}
              className="w-full border border-gray-300 py-2 rounded text-gray-700"
            >
              Continue Shopping
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Have a Promo Code?</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter your code"
                className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
              />
              <button className="bg-gray-800 text-white px-4 py-2 rounded-r">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;