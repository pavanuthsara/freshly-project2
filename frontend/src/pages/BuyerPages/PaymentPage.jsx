import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMoneyBillWave, FaCreditCard, FaPaypal, FaCcVisa,
  FaCcMastercard, FaCcAmex, FaCcDiscover, FaArrowRight
} from 'react-icons/fa';
// Removed CSS import

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Choose Payment Method</h2>
          <p className="text-gray-600">Select how you'd like to pay for your order</p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Cash on Delivery Option */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              method === 'Cash on Delivery' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setMethod('Cash on Delivery')}
          >
            <div className="flex items-center">
              <div className="mr-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === 'Cash on Delivery' ? 'border-green-500' : 'border-gray-400'
                }`}>
                  {method === 'Cash on Delivery' && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
              </div>
              <label className="flex items-center flex-1 cursor-pointer">
                <FaMoneyBillWave size={20} className="text-gray-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive your order</div>
                </div>
              </label>
            </div>
          </div>

          {/* Credit Card Option */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              method === 'Credit Card' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setMethod('Credit Card')}
          >
            <div className="flex items-center">
              <div className="mr-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === 'Credit Card' ? 'border-green-500' : 'border-gray-400'
                }`}>
                  {method === 'Credit Card' && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
              </div>
              <label className="flex items-center flex-1 cursor-pointer">
                <FaCreditCard size={20} className="text-gray-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Credit Card</div>
                  <div className="text-sm text-gray-600">Pay securely with your credit or debit card</div>
                </div>
              </label>
            </div>

            {/* Card Details Section */}
            {method === 'Credit Card' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Select payment provider:</div>
                  <div className="flex flex-wrap gap-3">
                    <div 
                      className={`flex items-center border rounded-md p-2 cursor-pointer ${
                        paymentProvider === 'stripe' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentProvider('stripe')}
                    >
                      <FaCreditCard size={18} className="mr-2 text-gray-600" />
                      <span className="text-sm">Stripe</span>
                      {paymentProvider === 'stripe' && (
                        <svg className="w-4 h-4 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <div 
                      className={`flex items-center border rounded-md p-2 cursor-pointer ${
                        paymentProvider === 'paypal' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentProvider('paypal')}
                    >
                      <FaPaypal size={18} className="mr-2 text-gray-600" />
                      <span className="text-sm">PayPal</span>
                      {paymentProvider === 'paypal' && (
                        <svg className="w-4 h-4 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <div 
                      className={`flex items-center border rounded-md p-2 cursor-pointer ${
                        paymentProvider === 'visa' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentProvider('visa')}
                    >
                      <FaCcVisa size={18} className="mr-2 text-gray-600" />
                      <span className="text-sm">Visa</span>
                      {paymentProvider === 'visa' && (
                        <svg className="w-4 h-4 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      maxLength="19"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Smith"
                      value={cardDetails.cardName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        maxLength="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        maxLength="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3 py-2">
                    <FaCcVisa size={28} className="text-blue-600" />
                    <FaCcMastercard size={28} className="text-red-500" />
                    <FaCcAmex size={28} className="text-blue-500" />
                    <FaCcDiscover size={28} className="text-orange-500" />
                  </div>
                  
                  {paymentProvider === 'stripe' && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-700 rounded">
                      <p>You'll enter your actual payment details securely on the Stripe payment page after placing your order.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center mb-6 text-sm text-gray-600">
          <span className="flex items-center">
            🔒 Your payment information is secure
          </span>
        </div>

        <button
          className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center font-medium ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
          ) : (
            <>
              Continue to Confirm Order <FaArrowRight size={16} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;