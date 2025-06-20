import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    if (e.key === '@' || e.key === '#' || e.key === '$' || e.key === '%') e.preventDefault();
  };

  const validate = () => {
    const errors = {};

    // Address validation
    if (!formData.address.trim()) {
      errors.address = 'Street address is required.';
    } else if (formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters.';
    } else if (formData.address.length > 100) {
      errors.address = 'Address cannot exceed 100 characters.';
    } else if (!/^[a-zA-Z0-9\s,.#-]+$/.test(formData.address)) {
      errors.address = 'Address can only contain letters, numbers, spaces, and basic punctuation (,.#-).';
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
      errors.city = 'City must contain only letters and spaces.';
    } else if (formData.city.length < 2) {
      errors.city = 'City must be at least 2 characters.';
    } else if (formData.city.length > 50) {
      errors.city = 'City cannot exceed 50 characters.';
    }

    // Postal code validation
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal Code is required.';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      errors.postalCode = 'Postal Code must be exactly 5 digits.';
    }

    // Country validation
    if (!formData.country.trim()) {
      errors.country = 'Country is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.country)) {
      errors.country = 'Country must contain only letters and spaces.';
    } else if (formData.country.length < 2) {
      errors.country = 'Country must be at least 2 characters.';
    } else if (formData.country.length > 50) {
      errors.country = 'Country cannot exceed 50 characters.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For postalCode, only allow digits and limit to 5
    if (name === 'postalCode') {
      const filteredValue = value.replace(/[^0-9]/g, '').slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validate();
    setErrors(prev => ({ ...prev, [name]: validationErrors[name] || '' }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setShippingAddress(formData);
    localStorage.setItem('shippingAddress', JSON.stringify(formData));

    console.log('✅ Shipping address saved. Navigating to /buyer/payment');
    navigate('/buyer/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium">1</div>
              <span className="text-sm font-medium text-teal-600 mt-1">Cart</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-teal-600"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium">2</div>
              <span className="text-sm font-medium text-teal-600 mt-1">Delivery</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium">3</div>
              <span className="text-sm font-medium text-gray-600 mt-1">Payment</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium">4</div>
              <span className="text-sm font-medium text-gray-600 mt-1">Confirm</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-teal-100 overflow-hidden">
          <div className="bg-teal-600 py-4 px-6">
            <h2 className="text-xl font-bold text-white">Delivery Address</h2>
          </div>
          
          <div className="p-6">
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
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your street address"
                  maxLength={100}
                  className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
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
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your city"
                  maxLength={50}
                  className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
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
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter postal code"
                    maxLength={5}
                    className={`w-full px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
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
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter country"
                    maxLength={50}
                    className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                  {errors.country && (
                    <div className="text-red-500 text-sm mt-1">{errors.country}</div>
                  )}
                </div>
              </div>
              
              <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-teal-700">
                      We ensure safe and secure delivery to your doorstep with contact-free options available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/cart')}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Cart
                </button>
                
                <button 
                  type="submit" 
                  className="flex-1 bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors font-medium"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;