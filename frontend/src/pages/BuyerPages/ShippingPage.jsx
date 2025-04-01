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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Debug: Log props received
  useEffect(() => {
    console.log('ShippingPage received shippingAddress:', shippingAddress);
  }, [shippingAddress]);

  // Prevent the "@" character from being typed
  const handleKeyDown = (e) => {
    if (e.key === '@') {
      e.preventDefault();
    }
  };

  // Custom validation logic for each field
  const validate = () => {
    let errors = {};
    
    // Validate address
    if (!formData.address.trim()) {
      errors.address = "Street address is required.";
    } else if (formData.address.trim().length < 5) {
      errors.address = "Address should be at least 5 characters long.";
    }
    
    // Validate city
    if (!formData.city.trim()) {
      errors.city = "City is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city.trim())) {
      errors.city = "City must contain only letters and spaces.";
    }
    
    // Validate postal code
    if (!formData.postalCode.trim()) {
      errors.postalCode = "Postal Code is required.";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.postalCode.trim())) {
      errors.postalCode = "Postal Code must be 5 digits or 5 digits followed by a dash and 4 digits.";
    }
    
    // Validate country
    if (!formData.country.trim()) {
      errors.country = "Country is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
      errors.country = "Country must contain only letters and spaces.";
    }
    
    return errors;
  };

  // Update form data and clear the error for the field as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleContinue = (e) => {
    if (e) e.preventDefault();
    
    // Run our custom validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Save shipping address if valid
    console.log('Setting shipping address to:', formData);
    setShippingAddress(formData);
    localStorage.setItem('shippingAddress', JSON.stringify(formData));
    
    // Navigate to the payment page
    setTimeout(() => {
      console.log('Navigating to payment page');
      navigate('/buyer/payment');
    }, 100);
  };

  return (
    <div className="shipping-container">
      <div className="shipping-form-container">
        <h2 className="shipping-title">Delivery Address</h2>
        <form className="shipping-form" onSubmit={handleContinue} noValidate>
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your street address"
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your city"
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
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
                onKeyDown={handleKeyDown}
                placeholder="Enter postal code"
              />
              {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter country"
              />
              {errors.country && <div className="error-message">{errors.country}</div>}
            </div>
          </div>
          
          <button type="submit" className="continue-btn">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
