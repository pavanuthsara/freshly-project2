import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Better email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure the API endpoint path is correct
      const response = await fetch('/api/farmers/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password reset link has been sent to your email');
        setEmail('');
        
        // Automatically redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/farmer-login');
        }, 3000);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/farmer-login');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-2 border-green-600">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Farmer Forgot Password
        </h2>
        <p className="text-center text-green-800 mb-6">
          Enter your email address and we'll send you a link to reset your farmer account password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-green-800 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border ${error ? 'border-red-500' : 'border-green-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter your email"
              disabled={isSubmitting}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {message && <p className="text-green-600 text-sm mt-1">{message}</p>}
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-green-600 hover:underline font-semibold"
            type="button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerForgotPassword;