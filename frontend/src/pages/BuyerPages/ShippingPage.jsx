import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed CSS import

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Address</h2>
        
        <form onSubmit={handleContinue} noValidate>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your street address"
              className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.address && (
              <div className="text-red-500 text-sm mt-1">{errors.address}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your city"
              className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.city && (
              <div className="text-red-500 text-sm mt-1">{errors.city}</div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter postal code"
                className={`w-full px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.postalCode && (
                <div className="text-red-500 text-sm mt-1">{errors.postalCode}</div>
              )}
            </div>

            <div className="md:w-1/2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter country"
                className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.country && (
                <div className="text-red-500 text-sm mt-1">{errors.country}</div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;