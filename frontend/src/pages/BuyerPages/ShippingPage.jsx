import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShippingPage.css';

const ShippingPage = ({ shippingAddress, setShippingAddress }) => {
  const [formData, setFormData] = useState(shippingAddress || {
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const navigate = useNavigate();

  // Debug: Log props received
  useEffect(() => {
    console.log('ShippingPage received shippingAddress:', shippingAddress);
  }, [shippingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue = (e) => {
    // Prevent default form submission behavior
    if (e) e.preventDefault();
    
    // Validate form
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Save shipping address
    console.log('Setting shipping address to:', formData);
    setShippingAddress(formData);
    
    // Also save to localStorage for persistence
    localStorage.setItem('shippingAddress', JSON.stringify(formData));
    
    // Wait briefly to ensure state is updated
    setTimeout(() => {
      console.log('Navigating to payment page');
      navigate('/buyer/payment');
    }, 100);
  };

  return (
    <div className="shipping-container">
      <div className="shipping-form-container">
        <h2 className="shipping-title">Delivery Address</h2>
        <form className="shipping-form" onSubmit={handleContinue}>
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your street address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                required
              />
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="continue-btn"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;