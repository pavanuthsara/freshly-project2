import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMoneyBillWave, FaCreditCard, FaPaypal, FaCcVisa,
  FaCcMastercard, FaCcAmex, FaCcDiscover, FaArrowRight
} from 'react-icons/fa';
import './PaymentPage.css';

const PaymentPage = ({ paymentMethod, setPaymentMethod }) => {
  const navigate = useNavigate();

  // Default to previously selected method or 'Cash on Delivery'
  const [method, setMethod] = useState(paymentMethod?.method || paymentMethod || 'Cash on Delivery');
  const [isLoading, setIsLoading] = useState(false);
  
  // Default provider to 'stripe' - this is what will be used for checkout
  const [paymentProvider, setPaymentProvider] = useState(
    paymentMethod?.provider || 'stripe'
  );
  
  // These card details are only for display - actual payment processing happens on Stripe
  const [cardDetails, setCardDetails] = useState({
    cardNumber: paymentMethod?.details?.cardNumber || '',
    cardName: paymentMethod?.details?.cardName || '',
    expiry: paymentMethod?.details?.expiry || '',
    cvv: paymentMethod?.details?.cvv || ''
  });

  useEffect(() => {
    console.log('PaymentPage received paymentMethod:', paymentMethod);
    // If we're coming back to this page with a previously selected method, restore it
    if (paymentMethod?.method) {
      setMethod(paymentMethod.method);
      if (paymentMethod.provider) {
        setPaymentProvider(paymentMethod.provider);
      }
      if (paymentMethod.details) {
        setCardDetails(paymentMethod.details);
      }
    }
  }, [paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      // Create the payment data object to pass to the next step
      const paymentData = {
        method: method,
        provider: method === 'Credit Card' ? paymentProvider : null,
        details: method === 'Credit Card' ? cardDetails : null
      };

      // Update state and localStorage
      setPaymentMethod(paymentData);
      localStorage.setItem('paymentMethod', JSON.stringify(paymentData));

      // Add a small delay for UI feedback
      setTimeout(() => {
        navigate('/buyer/confirm-order', { replace: true });
        setIsLoading(false);
      }, 700);
    } catch (error) {
      console.error('Error saving payment method:', error);
      setIsLoading(false);
      alert('Failed to save payment method. Please try again.');
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Choose Payment Method</h2>
          <p>Select how you'd like to pay for your order</p>
        </div>

        <div className="payment-options">
          <div
            className={`payment-option ${method === 'Cash on Delivery' ? 'selected' : ''}`}
            onClick={() => setMethod('Cash on Delivery')}
          >
            <div className="option-radio">
              <input
                type="radio"
                id="cod"
                value="Cash on Delivery"
                checked={method === 'Cash on Delivery'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <div className="radio-custom"></div>
            </div>
            <label htmlFor="cod" className="option-label">
              <FaMoneyBillWave size={20} />
              <div className="option-text">
                <span className="option-title">Cash on Delivery</span>
                <span className="option-desc">Pay when you receive your order</span>
              </div>
            </label>
          </div>

          <div
            className={`payment-option ${method === 'Credit Card' ? 'selected' : ''}`}
            onClick={() => setMethod('Credit Card')}
          >
            <div className="option-radio">
              <input
                type="radio"
                id="card"
                value="Credit Card"
                checked={method === 'Credit Card'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <div className="radio-custom"></div>
            </div>
            <label htmlFor="card" className="option-label">
              <FaCreditCard size={20} />
              <div className="option-text">
                <span className="option-title">Credit Card</span>
                <span className="option-desc">Pay securely with your credit or debit card</span>
              </div>
            </label>
          </div>

          {method === 'Credit Card' && (
            <div className="payment-card-details">
              <div className="payment-providers">
                <div className="providers-label">Select payment provider:</div>
                <div className="providers-options">
                  <div
                    className={`provider-option ${paymentProvider === 'stripe' ? 'active' : ''}`}
                    onClick={() => setPaymentProvider('stripe')}
                  >
                    <FaCreditCard size={24} className="provider-icon" />
                    <span className="provider-name">Stripe</span>
                    <div className="provider-check"></div>
                  </div>
                  <div
                    className={`provider-option ${paymentProvider === 'paypal' ? 'active' : ''}`}
                    onClick={() => setPaymentProvider('paypal')}
                  >
                    <FaPaypal size={24} className="provider-icon" />
                    <span className="provider-name">PayPal</span>
                    <div className="provider-check"></div>
                  </div>
                  <div
                    className={`provider-option ${paymentProvider === 'visa' ? 'active' : ''}`}
                    onClick={() => setPaymentProvider('visa')}
                  >
                    <FaCcVisa size={24} className="provider-icon" />
                    <span className="provider-name">Visa</span>
                    <div className="provider-check"></div>
                  </div>
                </div>
              </div>

              {/* Note: When using Stripe, this form is just for display - real payment info 
                  will be collected on Stripe's secure checkout page */}
              <div className="card-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      maxLength="19"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Smith"
                      value={cardDetails.cardName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row two-columns">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleInputChange}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={handleInputChange}
                      maxLength="4"
                    />
                  </div>
                </div>

                <div className="card-icons">
                  <FaCcVisa size={28} className="card-icon" />
                  <FaCcMastercard size={28} className="card-icon" />
                  <FaCcAmex size={28} className="card-icon" />
                  <FaCcDiscover size={28} className="card-icon" />
                </div>
                
                {paymentProvider === 'stripe' && (
                  <div className="stripe-notice">
                    <p>You'll enter your actual payment details securely on the Stripe payment page after placing your order.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="secure-payment-notice">
          <span>🔒 Your payment information is secure</span>
        </div>

        <button
          className={`continue-button ${isLoading ? 'loading' : ''}`}
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? <span className="loader"></span> : <>Continue to Confirm Order <FaArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;