import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ConfirmOrderPage.css';

const ConfirmOrderPage = ({ cartItems, shippingAddress, paymentMethod, setCartItems }) => {
  const navigate = useNavigate();
  const pageRef = useRef();

  useEffect(() => {
    console.log('ConfirmOrderPage received:');
    console.log('- cartItems:', cartItems);
    console.log('- shippingAddress:', shippingAddress);
    console.log('- paymentMethod:', paymentMethod);
  }, [cartItems, shippingAddress, paymentMethod]);

  // Prevent access if required data is missing
  if (!shippingAddress || !paymentMethod || !cartItems.length) {
    return (
      <div className="confirm-order-page">
        <div className="error-container">
          <h2>Missing Information</h2>
          <p>Please complete the previous steps before confirming your order.</p>
          <div className="action-buttons">
            {!cartItems.length && <button onClick={() => navigate('/cart')}>Go to Cart</button>}
            {!shippingAddress && <button onClick={() => navigate('/buyer/shipping')}>Go to Shipping</button>}
            {!paymentMethod && <button onClick={() => navigate('/buyer/payment')}>Go to Payment</button>}
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0);
  const taxPrice = subtotal * 0.1;
  const shippingPrice = subtotal > 1000 ? 0 : 150;
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

      const { data } = await axios.post('/api/orders', payload, { withCredentials: true });

      // Save order ID for payment session
      localStorage.setItem('latestOrderId', data._id);

      // ⛔ Don't clear cart yet if using Stripe
      if (
        typeof paymentMethod === 'object' &&
        paymentMethod.method === 'Credit Card' &&
        paymentMethod.provider === 'stripe'
      ) {
        const stripeRes = await axios.post(
          'http://localhost:5000/api/payment/create-checkout-session',
          { orderId: data._id },
          { withCredentials: true }
        );

        // Redirect to Stripe Checkout
        window.location.href = stripeRes.data.url;
        return;
      }

      // For other methods, proceed to final confirmation page
      alert('✅ Order placed successfully!');
      setCartItems([]);
      localStorage.removeItem('cartItems');
      navigate('/buyer/profile');
    } catch (err) {
      console.error('Order error:', err);
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  const getPaymentMethodDisplay = () => {
    if (typeof paymentMethod === 'object') {
      return paymentMethod.method === 'Credit Card'
        ? `${paymentMethod.method} (${paymentMethod.provider || 'Stripe'})`
        : paymentMethod.method;
    }
    return paymentMethod;
  };

  const downloadPDF = async () => {
    const element = pageRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

    if (imgHeight > pdf.internal.pageSize.getHeight()) {
      let heightLeft = imgHeight - pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
    }

    pdf.save('Order_Confirmation.pdf');
  };

  return (
    <div className="confirm-order-page" ref={pageRef}>
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
          <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
          <button className="back-btn" onClick={() => navigate('/buyer/shipping')}>Back to Shipping</button>
          <button className="pdf-btn" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;
