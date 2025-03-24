import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaCreditCard, FaPaypal, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaArrowRight } from 'react-icons/fa';
import './PaymentPage.css';

const PaymentPage = ({ paymentMethod, setPaymentMethod }) => {
  // Debug: Log props received
  useEffect(() => {
    console.log('PaymentPage received paymentMethod:', paymentMethod);
  }, [paymentMethod]);

  // Determine initial method from props or localStorage
  const initialMethod = paymentMethod?.method || paymentMethod || 'Cash on Delivery';

  const [method, setMethod] = useState(initialMethod);
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [paymentProvider, setPaymentProvider] = useState('stripe');
  const navigate = useNavigate();

  // Check if navigation is available
  useEffect(() => {
    if (!navigate) {
      console.error("Navigation function is not available!");
    }
  }, [navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    setIsLoading(true);
    
    // Create payment data object
    const paymentData = {
      method: method,
      provider: method === 'Credit Card' ? paymentProvider : null,
      details: method === 'Credit Card' ? cardDetails : null
    };
    
    // Save payment method
    console.log("Setting payment method to:", paymentData);
    setPaymentMethod(paymentData);
    
    // Also save to localStorage for persistence
    localStorage.setItem('paymentMethod', JSON.stringify(paymentData));
    
    // Wait briefly to ensure state is updated
    setTimeout(() => {
      console.log("Payment processed, navigating to confirm-order page");
      navigate('/buyer/confirm-order', { replace: true });
      setIsLoading(false);
    }, 800);
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
          {isLoading ? (
            <span className="loader"></span>
          ) : (
            <>
              Confirm and Place Order
              <FaArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;