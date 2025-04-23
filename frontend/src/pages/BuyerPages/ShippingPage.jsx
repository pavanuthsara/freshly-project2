import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShippingPage.css';

const ShippingPage = ({ shippingAddress, setShippingAddress }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    shippingAddress || JSON.parse(localStorage.getItem('shippingAddress')) || {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('ShippingPage received shippingAddress:', shippingAddress);
  }, [shippingAddress]);

  const handleKeyDown = (e) => {
    if (e.key === '@') e.preventDefault();
  };

  const validate = () => {
    const errors = {};

    if (!formData.address.trim()) {
      errors.address = 'Street address is required.';
    } else if (formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters.';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
      errors.city = 'City must contain only letters and spaces.';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal Code is required.';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      errors.postalCode = 'Postal Code must be 5 digits or 5 digits + 4.';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.country)) {
      errors.country = 'Country must contain only letters and spaces.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ Save to state and localStorage
    setShippingAddress(formData);
    localStorage.setItem('shippingAddress', JSON.stringify(formData));

    console.log('✅ Shipping address saved. Navigating to /buyer/payment');
    navigate('/buyer/payment');
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
