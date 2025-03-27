import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './BuyerLogin.css';

const BuyerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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

    if (!validateEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMsg('Password must be at least 8 characters long, include at least one uppercase letter and one number.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/buyers/login',
        formData,
        { withCredentials: true }
      );
      setSuccessMsg(response.data.message);
      navigate('/buyer/profile');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="buyer-login-container">
      <h2>Buyer Login</h2>

      <form className="buyer-login-form" onSubmit={handleSubmit}>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="login-button" type="submit">Login</button>

        <div className="register-link">
          <p>
            Don't have an account? <Link to="/buyer/register">Register here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default BuyerLogin;
