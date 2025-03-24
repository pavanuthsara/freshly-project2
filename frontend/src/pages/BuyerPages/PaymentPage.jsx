// src/pages/BuyerPages/PaymentPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './PaymentPage.css';

const PaymentPage = ({ paymentMethod, setPaymentMethod }) => {
  const [method, setMethod] = useState(paymentMethod || 'Cash on Delivery');
  const navigate = useNavigate();

  const handleContinue = () => {
    setPaymentMethod(method);
    navigate('/buyer/confirm-order');
  };

  return (
    <div className="payment-page">
      <h2>Choose Payment Method</h2>
      <div className="payment-options">
        <label>
          <input type="radio" value="Cash on Delivery" checked={method === 'Cash on Delivery'} onChange={(e) => setMethod(e.target.value)} />
          Cash on Delivery
        </label>
        <label>
          <input type="radio" value="Credit Card" checked={method === 'Credit Card'} onChange={(e) => setMethod(e.target.value)} />
          Credit Card (coming soon)
        </label>
      </div>
      <button onClick={handleContinue}>Confirm and Place Order</button>
    </div>
  );
};

export default PaymentPage;
