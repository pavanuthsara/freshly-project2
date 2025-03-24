// src/pages/BuyerPages/ShippingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './ShippingPage.css';

const ShippingPage = ({ shippingAddress, setShippingAddress }) => {
  const [formData, setFormData] = useState(shippingAddress || {
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      alert('Please fill in all fields.');
      return;
    }
    setShippingAddress(formData);
    navigate('/buyer/payment'); // go to payment selection page
  };

  return (
    <div className="shipping-page">
      <h2>Delivery Address</h2>
      <div className="form">
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
        <button onClick={handleContinue}>Continue to Payment</button>
      </div>
    </div>
  );
};

export default ShippingPage;
