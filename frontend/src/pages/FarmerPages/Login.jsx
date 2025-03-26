import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/farmers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      } else {
        alert(data.message || 'Login Failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate('/register');
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
              className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-green-800 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
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