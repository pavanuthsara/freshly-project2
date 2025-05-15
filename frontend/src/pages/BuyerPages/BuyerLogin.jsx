import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle, User, Facebook, Eye, EyeOff } from 'lucide-react';

const BuyerLogin = ({ setIsAuthenticated, setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMsg('Password must be at least 8 characters long, include at least one uppercase letter and one number.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        '/api/buyers/login',
        formData,
        { withCredentials: true }
      );
      // Assuming the response includes a token and user data
      const { token, user } = response.data;
      // Store token in localStorage to match checkAuthentication
      if (token) {
        localStorage.setItem('token', token);
      }
      // Update user state if user data is provided
      if (user) {
        setUser(user);
      }
      // Update authentication state
      setIsAuthenticated(true);
      setSuccessMsg(response.data.message || 'Login successful!');
      // Immediate redirect to dashboard
      navigate('/buyer/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300">
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-8">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white">Welcome Back</h2>
          <p className="text-center text-green-100 mt-1">Sign in to your buyer account</p>
        </div>

        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-600 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg border-l-4 border-green-600 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{successMsg}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-green-600 hover:text-green-500 transition">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters with at least one uppercase letter and one number.</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="#4285F4" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.212 1.205-0.88 2.227-1.879 2.916l0.003 0.003 2.901 2.252c1.696-1.564 2.745-3.874 2.745-6.619 0-0.645-0.061-1.266-0.164-1.868l-0.008-0.046h-9.043z"></path>
                  <path d="M5.265 14.278l-0.53 0.202-1.88 1.462c1.198 2.364 3.653 3.978 6.478 3.978 0.001 0 0.002 0 0.003 0h-0c1.863 0 3.438-0.615 4.585-1.674l-0.001 0.001-2.901-2.252c-0.814 0.542-1.813 0.864-2.886 0.864-0.002 0-0.005 0-0.007 0h0c-2.281 0-4.214-1.52-4.91-3.6l-0.010-0.036z"></path>
                  <path d="M5.264 9.723c-0.292-0.872-0.462-1.876-0.462-2.922 0-0.063 0.001-0.125 0.002-0.188l-0 0.009c0-1.001 0.176-1.957 0.483-2.841l-0.017 0.057 2.402 1.866 0.012 0.003c-0.513 1.026-0.815 2.236-0.815 3.516 0 0.011 0 0.022 0 0.032v-0.002c0 1.313 0.321 2.549 0.878 3.637l-0.021-0.045-2.462 1.911z"></path>
                  <path d="M12.132 4.851c1.362-0.047 2.67 0.484 3.696 1.467l-0.002-0.002 2.559-2.559c-1.645-1.522-3.842-2.457-6.248-2.457-2.829 0-5.368 1.245-7.095 3.217l0.005-0.006 2.391 1.854c0.699-1.507 2.212-2.533 3.957-2.533 0.282 0 0.558 0.028 0.825 0.080l-0.027-0.004z"></path>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <Facebook className="h-5 w-5 mr-2 text-blue-600" />
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <Link to="/buyer/register" className="ml-1 font-medium text-green-600 hover:text-green-500 hover:underline transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;