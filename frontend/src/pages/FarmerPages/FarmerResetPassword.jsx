import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

const FarmerResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Page loaded. Extracted token:', token);
    if (!token) {
      setError('Invalid or missing reset token');
      console.error('No token found in URL query');
    }
  }, [token]);

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    console.log('Form submitted with:', { token, password });

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters');
      console.log('Validation failed: Password too short');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      console.log('Validation failed: Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Sending POST /api/farmers/reset-password with:', { token, password });
      const response = await fetch('/api/farmers/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      console.log('Response received:', data);

      if (data.success) {
        setMessage('Password reset successfully. Redirecting to login...');
        console.log('Reset successful. Redirecting in 3 seconds');
        setTimeout(() => navigate('/farmer-login'), 3000);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
        console.log('Reset failed:', data.message);
      }
    } catch (err) {
      const errorMessage = err.message.includes('Failed to fetch')
        ? 'Cannot connect to the server. Please ensure the backend is running on http://localhost:5000.'
        : 'An error occurred. Please try again later.';
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-2 border-green-600">
        <div className="flex items-center justify-center mb-6">
          <Lock className="text-green-600 mr-2" size={32} />
          <h2 className="text-3xl font-bold text-green-700">Reset Farmer Password</h2>
        </div>

        {error && (
          <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <CheckCircle className="mr-2" size={20} />
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-800 mb-2" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border ${
                error && error.includes('Password') ? 'border-red-500' : 'border-green-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter new password"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-green-800 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 border ${
                error && error.includes('Passwords do not match') ? 'border-red-500' : 'border-green-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Confirm new password"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !token}
            className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isSubmitting || !token ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/farmer-login')}
            className="text-green-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerResetPassword;