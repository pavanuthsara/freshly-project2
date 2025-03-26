import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    nic: '',
    farmAddress: {
      streetNo: '',
      city: '',
      district: ''
    }
  });

  // New state for validation errors
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateName = (name) => {
    // Only allow letters and dot, no consecutive dots or dots at start/end
    const nameRegex = /^[A-Za-z]+(\.[A-Za-z]+)*$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    // Standard email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters long
    return password.length >= 8;
  };

  const validateNIC = (nic) => {
    // Either 12 digits or 10 digits followed by V/v
    const nicRegex = /^(\d{12}|\d{9}[Vv])$/;
    return nicRegex.test(nic);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle nested farm address fields
    if (name.startsWith('farmAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        farmAddress: {
          ...prevState.farmAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!validateName(formData.name)) {
      newErrors.name = 'Name should only contain letters and optional dots';
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // NIC validation
    if (!validateNIC(formData.nic)) {
      newErrors.nic = 'NIC must be 12 digits or 10 digits with V/v at end';
    }

    // Set errors
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/farmers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration Successful!');
        // Call the prop function to handle navigation or state update
        if (onRegistrationSuccess) {
          onRegistrationSuccess(data);
        }
      } else {
        alert(data.message || 'Registration Failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-2 border-green-600">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Farmer Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-800 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Create a strong password"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-green-800 mb-2">NIC Number</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.nic ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your National ID number"
              required
            />
            {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Farm Address</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="farmAddress.streetNo"
                value={formData.farmAddress.streetNo}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Street Number"
                required
              />
              <input
                type="text"
                name="farmAddress.city"
                value={formData.farmAddress.city}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="City"
                required
              />
              <input
                type="text"
                name="farmAddress.district"
                value={formData.farmAddress.district}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="District"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Register
          </button>

          <div className="text-center mt-4">
            <p className="text-green-800">
              Already have an account? 
              <button 
                type="button"
                onClick={handleLoginRedirect}
                className="text-green-600 font-bold ml-2 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;