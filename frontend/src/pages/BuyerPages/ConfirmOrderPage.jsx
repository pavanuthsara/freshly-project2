import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ConfirmOrderPage.css';

const ConfirmOrderPage = ({ cartItems, shippingAddress, paymentMethod, setCartItems }) => {
  const navigate = useNavigate();

  // Debug: Log props received
  useEffect(() => {
    console.log('ConfirmOrderPage received:');
    console.log('- cartItems:', cartItems);
    console.log('- shippingAddress:', shippingAddress);
    console.log('- paymentMethod:', paymentMethod);
  }, [cartItems, shippingAddress, paymentMethod]);

  // Check if required data is available
  if (!shippingAddress || !paymentMethod || !cartItems.length) {
    return (
      <div className="confirm-order-page">
        <div className="error-container">
          <h2>Missing Information</h2>
          <p>Please complete the previous steps before confirming your order.</p>
          <div className="action-buttons">
            {!cartItems.length && (
              <button onClick={() => navigate('/cart')}>Go to Cart</button>
            )}
            {!shippingAddress && (
              <button onClick={() => navigate('/buyer/shipping')}>Go to Shipping</button>
            )}
            {!paymentMethod && (
              <button onClick={() => navigate('/buyer/payment')}>Go to Payment</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * (item.product?.price || 0),
    0
  );
  const taxPrice = subtotal * 0.1; // 10% tax
  const shippingPrice = subtotal > 1000 ? 0 : 150; // Free shipping over 1000
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const placeOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.product?.name,
        qty: item.qty,
        price: item.product?.price,
        image: item.product?.image,
        product: item.product?._id,
      }));

      const payload = {
        orderItems,
        shippingAddress,
        paymentMethod: typeof paymentMethod === 'object' ? paymentMethod.method : paymentMethod,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      console.log('Placing order with payload:', payload);

      await axios.post('/api/orders', payload, { withCredentials: true });
      alert('✅ Order placed successfully!');
      
      // Clear cart and localStorage
      setCartItems([]);
      localStorage.removeItem('cartItems');
      
      navigate('/buyer/profile');
    } catch (err) {
      console.error('Order error:', err);
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  // Get payment method display text
  const getPaymentMethodDisplay = () => {
    if (typeof paymentMethod === 'object') {
      if (paymentMethod.method === 'Credit Card') {
        return `${paymentMethod.method} (${paymentMethod.provider || 'Stripe'})`;
      }
      return paymentMethod.method;
    }
    return paymentMethod;
  };

  return (
    <div className="confirm-order-page">
      <div className="confirm-order-container">
        <h2>Review Your Order</h2>
        
        <div className="order-sections">
          <div className="order-section">
            <h3>Shipping</h3>
            <div className="section-content">
              <p className="address">
                {shippingAddress.address}, <br />
                {shippingAddress.city}, {shippingAddress.postalCode}, <br />
                {shippingAddress.country}
              </p>
            </div>
          </div>
          
          <div className="order-section">
            <h3>Payment Method</h3>
            <div className="section-content">
              <p>{getPaymentMethodDisplay()}</p>
            </div>
          </div>
          
          <div className="order-section">
            <h3>Order Items</h3>
            <div className="section-content">
              <ul className="order-items-list">
                {cartItems.map((item) => (
                  <li key={item.product?._id || item._id} className="order-item">
                    <div className="item-image">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product.name} />
                      ) : (
                        <div className="placeholder-image">No Image</div>
                      )}
                    </div>
                    <div className="item-details">
                      <span className="item-name">{item.product?.name || 'Product'}</span>
                      <span className="item-quantity">Qty: {item.qty}</span>
                    </div>
                    <div className="item-price">
                      Rs. {(item.qty * (item.product?.price || 0)).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="order-section">
            <h3>Order Summary</h3>
            <div className="section-content">
              <div className="summary-row">
                <span>Items:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shippingPrice > 0 ? `Rs. ${shippingPrice.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>Rs. {taxPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-actions">
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
          <button className="back-btn" onClick={() => navigate('/buyer/payment')}>
            Back to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;