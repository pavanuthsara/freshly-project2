import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

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

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h2>Your Shopping Cart</h2>
        <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {loading && <div className="cart-loader">Loading your cart...</div>}
      
      {error && <div className="cart-error">{error}</div>}

      {!loading && cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart and come back!</p>
          <button className="continue-shopping-btn" onClick={continueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        !loading && (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product?._id || item._id} className="cart-item-row">
                      {item.product ? (
                        <>
                          <td className="product-cell">
                            <div className="product-info">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="cart-img"
                              />
                              <div className="product-details">
                                <h4>{item.product.name}</h4>
                                <span className="product-category">{item.product.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="price-cell">Rs. {item.product.price.toFixed(2)}</td>
                          <td className="quantity-cell">
                            <div className="quantity-control">
                              <button 
                                className="quantity-btn" 
                                onClick={() => updateQty(item.product._id, Math.max(1, item.qty - 1))}
                                disabled={item.qty <= 1}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => updateQty(item.product._id, e.target.value)}
                                className="quantity-input"
                              />
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQty(item.product._id, item.qty + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="total-cell">
                            Rs. {(item.qty * item.product.price).toFixed(2)}
                          </td>
                          <td className="action-cell">
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="remove-btn"
                              title="Remove item"
                            >
                              <span>×</span>
                            </button>
                          </td>
                        </>
                      ) : (
                        <td colSpan="5" className="unavailable-product">
                          <div className="unavailable-message">
                            <span className="warning-icon">⚠️</span>
                            <span>Product no longer available</span>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="remove-unavailable-btn"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-sidebar">
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax:</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping > 0 ? `Rs. ${shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                {shipping > 0 && (
                  <div className="free-shipping-message">
                    Add Rs. {(1000 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                <button className="continue-shopping-btn" onClick={continueShopping}>
                  Continue Shopping
                </button>
              </div>
              
              <div className="promo-box">
                <h4>Have a Promo Code?</h4>
                <div className="promo-input">
                  <input type="text" placeholder="Enter your code" />
                  <button>Apply</button>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CartPage;