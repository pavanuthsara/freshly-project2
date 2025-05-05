import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [focused, setFocused] = useState({
    email: false,
    password: false
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate password complexity
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Sanitize inputs to prevent XSS
  const sanitizeInput = (input) => {
    return input
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize the input
    const sanitizedValue = sanitizeInput(value);
    
    // Update form data with sanitized value
    setFormData(prevState => ({
      ...prevState,
      [name]: sanitizedValue
    }));
    
    // Clear errors when user types
    setErrors(prevState => ({
      ...prevState,
      [name]: '',
      general: ''
    }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setFocused(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Mark field as touched when user leaves the field
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));
    
    // Unfocus the field
    setFocused(prevState => ({
      ...prevState,
      [name]: false
    }));
    
    // Validate on blur
    validateField(name);
  };
  
  const validateField = (fieldName) => {
    let errorMessage = '';
    
    if (fieldName === 'email') {
      if (!validateEmail(formData.email)) {
        errorMessage = 'Please enter a valid email address';
      }
    } else if (fieldName === 'password') {
      if (!validatePassword(formData.password)) {
        errorMessage = 'Password must be at least 8 characters';
      }
    }
    
    setErrors(prevState => ({
      ...prevState,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };

  const validateForm = () => {
    const emailValid = validateField('email');
    const passwordValid = validateField('password');
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a sanitized request object
      const sanitizedData = {
        email: formData.email.toLowerCase(),
        password: formData.password
      };
      
      const response = await fetch('/api/farmers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
        credentials: 'include'
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (data.success) {
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      } else {
        setErrors({ ...errors, general: data.message || 'Login Failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ ...errors, general: 'An error occurred during login. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate('/farmer-register');
  };

  const handleForgotPassword = () => {
    navigate('/farmer-forgot-password');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-2 border-green-600">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Farmer Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-800 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full p-3 border ${touched.email && errors.email ? 'border-red-500' : 'border-green-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            {focused.email && (
              <p className="text-blue-500 text-sm mt-1">Email should be in a valid format (e.g., user@example.com)</p>
            )}
            {touched.email && !focused.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full p-3 border ${touched.password && errors.password ? 'border-red-500' : 'border-green-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            {focused.password && (
              <p className="text-blue-500 text-sm mt-1">Password must be at least 8 characters</p>
            )}
            {touched.password && !focused.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-green-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errors.general}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-4">
            <p className="text-green-800">
              Don't have an account? 
              <button 
                type="button"
                onClick={handleRegisterClick}
                className="text-green-600 font-bold ml-2 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;